import { NextResponse } from 'next/server';

async function fetchImage(query: string): Promise<string | null> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`, { 
      signal: AbortSignal.timeout(3000),
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    }
  } catch (e) {
    console.error("Pixabay fetch error for", query, e);
  }
  return null;
}

export const dynamic = 'force-dynamic';
export const maxDuration = 25; // Setup max duration for Vercel/Next.js if needed

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { gardenType, climateZone, sunExposure, plotSize, soilTest, soilDetails, surroundings, challenges, lang = 'en' } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY");
    }

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
- **CRITICAL: You MUST translate ALL output strings (names, descriptions, practices, resource names, tags) into the language corresponding to language code: "${lang}". Keep the JSON keys in English.**

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


    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 24000); // 24s timeout

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Reverting to the correct model name
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Suggest plants for a ${gardenType} in a ${climateZone} climate. 
Sun: ${sunExposure}. Size: ${plotSize}. 
Soil: ${soilTest === 'Yes – I have test results' ? soilDetails : soilTest || "Unknown/Regional Default"}.
Surroundings/Micro-climate: ${Array.isArray(surroundings) ? surroundings.join(", ") : surroundings || "Unknown"}.
Specific Challenges: ${challenges && challenges.length > 0 ? challenges.join(", ") : "None"}.` }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error("No text returned from Gemini");
    }

    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(cleanText);
    
    // Validate: need at least 1 plant
    if (!parsedJson.plants || !Array.isArray(parsedJson.plants) || parsedJson.plants.length < 1) {
      throw new Error('Invalid format returned by AI — no plants array');
    }
    // Ensure max 5 plants
    parsedJson.plants = parsedJson.plants.slice(0, 5);
    // Ensure partner exists
    if (!parsedJson.partner) {
      parsedJson.partner = {
        name: 'Community Resource',
        location: 'Look for local seed swaps or community gardens',
        imageQuery: 'community garden',
      };
    }

    // Fetch images from Pixabay
    await Promise.all(parsedJson.plants.map(async (plant: { name: string; scientificName?: string; imageUrl?: string }) => {
      let img = await fetchImage(plant.name);
      if (!img && plant.scientificName) {
         img = await fetchImage(plant.scientificName);
      }
      plant.imageUrl = img || encodeURI('/images/screens/Full Sun.jpg'); // fallback
    }));

    parsedJson.partner.imageUrl = encodeURI('/images/screens/Lawn Replacemen.jpg');

    return NextResponse.json(parsedJson);

  } catch (error) {
    console.error("API Error in /recommend:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred while generating your garden plan.";
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
}
