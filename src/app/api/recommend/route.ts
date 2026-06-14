import { NextResponse } from 'next/server';

async function fetchImage(query: string): Promise<string | null> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    }
  } catch (e) {
    console.error("Pixabay fetch error for", query, e);
  }
  return null;
}

export const maxDuration = 25; // Setup max duration for Vercel/Next.js if needed

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { gardenType, climateZone, sunExposure, plotSize, soilTest } = body;

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
- Partner is always a generic local nursery placeholder for now

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
    "name": "Local Nursery Partner",
    "location": "Your nearest garden center",
    "imageQuery": "garden nursery plants"
  }
}`;

    const userPrompt = `
User Context:
Garden Type: ${gardenType}
Climate Zone: ${climateZone}
Sun Exposure: ${sunExposure}
Plot Size: ${plotSize}
Soil Test Results: ${soilTest || 'None provided'}
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 24000); // 24s timeout

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // Switched to valid model ID
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
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

    const parsedJson = JSON.parse(rawText);
    
    // Validate: need at least 1 plant
    if (!parsedJson.plants || !Array.isArray(parsedJson.plants) || parsedJson.plants.length < 1) {
      throw new Error('Invalid format returned by AI — no plants array');
    }
    // Ensure max 5 plants
    parsedJson.plants = parsedJson.plants.slice(0, 5);
    // Ensure partner exists
    if (!parsedJson.partner) {
      parsedJson.partner = {
        name: 'Local Nursery Partner',
        location: 'Check your nearest garden center',
        imageQuery: 'garden nursery plants',
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
    
    // Fallback data
    const fallbackData = {
      plants: [
        {
          id: "lavender",
          name: "Lavender",
          scientificName: "Lavandula angustifolia",
          description: "A hardy, aromatic herb that thrives in full sun and well-drained soil. Perfect for your climate.",
          bestPractices: [
            "Water deeply but infrequently to encourage strong root growth.",
            "Ensure proper drainage to prevent root rot.",
            "Prune dead foliage in late winter before new growth starts."
          ],
          whenToPlant: "Spring or early Fall",
          howToStart: "Transplant",
          careLevel: "Easy",
          tags: ["Drought Tolerant", "Pollinator"],
          imageQuery: "lavender field purple",
          imageUrl: encodeURI("/images/screens/Pollinator Garden.jpg")
        },
        {
          id: "rosemary",
          name: "Rosemary",
          scientificName: "Salvia rosmarinus",
          description: "Fragrant and pollinator-friendly evergreen shrub.",
          bestPractices: ["Avoid overwatering", "Plant in full sun", "Prune lightly in spring"],
          whenToPlant: "Spring",
          howToStart: "Transplant or cuttings",
          careLevel: "Easy",
          tags: ["Full Sun", "Aromatic"],
          imageQuery: "rosemary bush",
          imageUrl: encodeURI("/images/screens/Vegetable Plot.jpg")
        },
        {
          id: "thyme",
          name: "Thyme",
          scientificName: "Thymus vulgaris",
          description: "Excellent ground cover that smells wonderful.",
          bestPractices: ["Ensure good drainage", "Trim after flowering", "Do not fertilize heavily"],
          whenToPlant: "Spring",
          howToStart: "Direct seed or transplant",
          careLevel: "Easy",
          tags: ["Edible", "Hardy"],
          imageQuery: "thyme herb",
          imageUrl: encodeURI("/images/screens/Continental.jpg")
        },
        {
          id: "sage",
          name: "Sage",
          scientificName: "Salvia officinalis",
          description: "Drought resistant herb with beautiful velvety leaves.",
          bestPractices: ["Requires good air circulation", "Replace every 3-4 years", "Harvest leaves before blooming"],
          whenToPlant: "Spring or Fall",
          howToStart: "Transplant",
          careLevel: "Medium",
          tags: ["Low Water", "Edible"],
          imageQuery: "sage plant leaves",
          imageUrl: encodeURI("/images/screens/Temperate.jpg")
        },
        {
          id: "oregano",
          name: "Oregano",
          scientificName: "Origanum vulgare",
          description: "Spreads easily and is great for cooking.",
          bestPractices: ["Cut back regularly to encourage bushy growth", "Thrives in poorer soils", "Divide every few years"],
          whenToPlant: "Spring",
          howToStart: "Direct seed or cuttings",
          careLevel: "Easy",
          tags: ["Edible", "Perennial"],
          imageQuery: "oregano herb garden",
          imageUrl: encodeURI("/images/screens/Mediterranean.jpg")
        }
      ],
      partner: {
        name: "Local Nursery Partner",
        location: "Check your nearest garden center",
        imageQuery: "garden nursery plants",
        imageUrl: encodeURI("/images/screens/Lawn Replacemen.jpg")
      }
    };

    return NextResponse.json(fallbackData);
  }
}
