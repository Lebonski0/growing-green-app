const fs = require('fs');

async function test() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const keyMatch = envFile.match(/OPENROUTER_API_KEY=(.+)/);
  const apiKey = keyMatch ? keyMatch[1].trim() : null;

  const lang = 'en';
  const gardenType = 'Vegetable Plot';
  const climateZone = 'Temperate';
  const sunExposure = 'Full Sun (6+ hours)';
  const plotSize = 'Medium – 25 to 100m²';
  const soilTest = 'No – Use regional defaults';
  const surroundings = ['Urban / City Center'];
  const challenges = ['Strong Winds'];

  const systemPrompt = `
You are an expert sustainable horticulturalist. The user has provided their garden context.
Return ONLY valid JSON — no markdown, no explanation, no backticks.
Return exactly 5 plants: the first is the hero recommendation, the next 4 are additional.

Rules:
- Only recommend plants that GENUINELY thrive in the specified climate zone
- Prioritize native, heirloom, or open-pollinated varieties
- No synthetic pesticides — all plants must suit organic growing
- Include at minimum 2 plants that support pollinators
- Best practices must be practical and actionable (not generic)
- Tags maximum 2 per plant, short (1-2 words each)
- All content must be understandable by a 10-year-old AND a 70-year-old
- The "partner" object MUST be a "Community Resource" recommendation (e.g., local seed library, community garden, or Facebook plant swap group).
- **CRITICAL: You MUST translate ALL output strings into the language corresponding to language code: "${lang}". Keep the JSON keys in English.**

Output JSON format exactly like this:
{
  "plants": [
    {
      "id": "slug-name",
      "name": "Plant Name",
      "scientificName": "Scientific Name",
      "description": "2 sentences describing the plant.",
      "bestPractices": ["Practice 1", "Practice 2", "Practice 3"],
      "whenToPlant": "March - May",
      "howToStart": "Direct seed or transplant",
      "careLevel": "Easy",
      "tags": ["Drought-resistant", "Pollinator"],
      "imageQuery": "unsplash query keywords"
    }
  ],
  "partner": {
    "name": "Community Seed Library (or similar)",
    "location": "A helpful action they can take locally",
    "imageQuery": "community garden"
  }
}`;

  console.log("Calling OpenRouter directly...");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Suggest plants for a ${gardenType} in a ${climateZone} climate. 
Sun: ${sunExposure}. Size: ${plotSize}. 
Soil: ${soilTest}.
Surroundings/Micro-climate: ${surroundings.join(", ")}.
Specific Challenges: ${challenges.join(", ")}.` }
      ]
    })
  });

  console.log("OpenRouter status:", response.status);
  const data = await response.json();
  
  if (!response.ok) {
    console.error("OpenRouter error:", JSON.stringify(data));
    return;
  }
  
  const rawText = data.choices?.[0]?.message?.content;
  console.log("Raw text length:", rawText?.length);
  console.log("Raw text preview:", rawText?.substring(0, 200));
  
  try {
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    console.log("SUCCESS! Plants:", parsed?.plants?.map(p => p.name));
  } catch(e) {
    console.error("Parse error:", e.message);
    console.log("Full raw text:", rawText);
  }
}

test().catch(console.error);
