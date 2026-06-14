const fs = require('fs');
async function test() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const keyMatch = envFile.match(/OPENROUTER_API_KEY=(.+)/);
  const key = keyMatch ? keyMatch[1].trim() : null;
  console.log("Key exists:", !!key);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "user", content: "Suggest 1 plant in JSON. {\"plants\":[{\"name\":\"test\"}]}" }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Error:", response.status, err);
    return;
  }
  const data = await response.json();
  console.log(data);
}
test();
