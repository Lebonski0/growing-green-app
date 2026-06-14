async function test() {
  try {
    const response = await fetch("http://localhost:3000/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gardenType: "Vegetable Plot",
        climateZone: "Temperate",
        sunExposure: "Full Sun",
        plotSize: "Medium",
        soilTest: null,
        surroundings: ["Urban"],
        challenges: ["Strong Winds"],
        lang: "en"
      })
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data plants length:", data?.plants?.length);
    console.log("First plant name:", data?.plants?.[0]?.name);
  } catch(e) {
    console.error("Local API Error:", e.message);
  }
}
test();
