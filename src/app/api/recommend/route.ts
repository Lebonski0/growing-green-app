import { NextResponse } from 'next/server';

async function fetchImage(query: string): Promise<string | null> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    }
  } catch {
    // Silently fall through to null
  }
  return null;
}

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      gardenType,
      climateZone,
      sunExposure,
      plotSize,
      soilTest,
      soilDetails,
      surroundings,
      challenges,
      lang = 'en',
    } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfiguration: missing API key.' }, { status: 500 });
    }

    // Build soil string
    const soilString =
      soilTest === 'Yes – I have test results' && soilDetails
        ? soilDetails
        : soilTest || 'Unknown';

    // Build surroundings string
    const surroundingsString = Array.isArray(surroundings) && surroundings.length > 0
      ? surroundings.join(', ')
      : typeof surroundings === 'string' && surroundings
      ? surroundings
      : 'Not specified';

    // Build challenges string
    const challengesString =
      Array.isArray(challenges) && challenges.length > 0
        ? challenges.join(', ')
        : 'None';

    const userContent = `Garden type: ${gardenType}
Climate zone: ${climateZone}
Sun exposure: ${sunExposure}
Plot size: ${plotSize}
Soil: ${soilString}
Surroundings / micro-climate: ${surroundingsString}
Specific challenges: ${challengesString}`;

    const systemPrompt = `You are an expert sustainable horticulturalist.
The user has provided their garden context. Suggest exactly 5 plants suited to their specific conditions.
The first plant is the hero recommendation; plants 2-5 are additional suggestions.

IMPORTANT RULES:
- Only plants that GENUINELY thrive in the given climate zone.
- Prioritize native, heirloom, or open-pollinated varieties.
- No synthetic pesticides; all plants must suit organic growing.
- At least 2 plants must support pollinators.
- Best practices must be specific and actionable, not generic.
- Maximum 2 tags per plant (1-2 words each).
- The partner object MUST describe a real community resource (seed library, community garden, plant swap).
- Translate ALL text values to the language with code: "${lang}". Keep JSON keys in English.
- Return ONLY the raw JSON object below — no markdown fences, no preamble, no explanation.

Required JSON shape:
{
  "plants": [
    {
      "id": "kebab-slug",
      "name": "...",
      "scientificName": "...",
      "description": "Two sentences.",
      "bestPractices": ["...", "...", "..."],
      "whenToPlant": "Month – Month",
      "howToStart": "...",
      "careLevel": "Easy | Medium | Hard",
      "tags": ["Tag1", "Tag2"],
      "imageQuery": "short pixabay search phrase"
    }
  ],
  "partner": {
    "name": "...",
    "location": "...",
    "imageQuery": "community garden"
  }
}`;

    const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
      // No AbortController — let Next.js/Vercel handle the timeout via maxDuration
    });

    if (!orResponse.ok) {
      const errText = await orResponse.text();
      console.error('OpenRouter error:', orResponse.status, errText);
      return NextResponse.json(
        { error: `AI service error (${orResponse.status}). Please try again.` },
        { status: 502 }
      );
    }

    const orData = await orResponse.json();
    const rawText: string | undefined = orData.choices?.[0]?.message?.content;

    if (!rawText) {
      console.error('OpenRouter returned no content:', JSON.stringify(orData));
      return NextResponse.json({ error: 'AI returned empty response. Please try again.' }, { status: 502 });
    }

    // Strip markdown code fences if model added them despite instructions
    const cleanText = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let parsedJson: { plants: Record<string, unknown>[]; partner: Record<string, unknown> };
    try {
      parsedJson = JSON.parse(cleanText);
    } catch {
      console.error('JSON parse failed. Raw text:', rawText.substring(0, 500));
      return NextResponse.json({ error: 'AI returned invalid data. Please try again.' }, { status: 502 });
    }

    if (!Array.isArray(parsedJson.plants) || parsedJson.plants.length < 1) {
      console.error('No plants array in response:', cleanText.substring(0, 300));
      return NextResponse.json({ error: 'AI did not return any plants. Please try again.' }, { status: 502 });
    }

    parsedJson.plants = parsedJson.plants.slice(0, 5);

    if (!parsedJson.partner) {
      parsedJson.partner = {
        name: 'Local Community Garden',
        location: 'Search for community gardens or seed swaps in your area.',
        imageQuery: 'community garden',
      };
    }

    // Fetch Pixabay images in parallel
    await Promise.all(
      parsedJson.plants.map(async (plant) => {
        const query = (plant.imageQuery as string) || (plant.name as string);
        const img = await fetchImage(query)
          ?? await fetchImage(plant.name as string)
          ?? null;
        plant.imageUrl = img ?? '/images/screens/Full Sun.jpg';
      })
    );

    parsedJson.partner.imageUrl = '/images/screens/Lawn Replacemen.jpg';

    return NextResponse.json(parsedJson);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unexpected server error.';
    console.error('Unhandled error in /api/recommend:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
