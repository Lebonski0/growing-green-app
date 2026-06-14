const fs = require('fs');

async function test() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const keyMatch = envFile.match(/OPENROUTER_API_KEY=(.+)/);
  const apiKey = keyMatch ? keyMatch[1].trim() : null;

  // Simulate exactly what happens when user completes questions + goes to results
  const answers = {
    gardenType: 'Vegetable Plot',
    climateZone: 'Temperate',
    sunExposure: 'Full Sun (6+ hours)',
    plotSize: 'Medium – 25 to 100m²',
    soilTest: 'No – Use regional defaults',
    soilDetails: null,
    surroundings: ['Urban / City Center'],
    challenges: ['Strong Winds'],
    lang: 'en'
  };

  console.log("Testing local API with real-world answers...");
  console.log("Payload:", JSON.stringify(answers, null, 2));

  const response = await fetch("http://localhost:3000/api/recommend", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers)
  });
  
  console.log("Status:", response.status);
  const text = await response.text();
  
  if (!response.ok) {
    console.error("ERROR RESPONSE:", text);
    return;
  }
  
  try {
    const data = JSON.parse(text);
    console.log("SUCCESS! Plants:", data?.plants?.map(p => p.name));
  } catch {
    console.error("JSON PARSE FAILED:", text.substring(0, 500));
  }
}

test().catch(console.error);
