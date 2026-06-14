const apiKey = "56305437-d5a06ea9b9035b8e2b6f16c9e";
const query = "lavender";

async function test() {
  console.log("Fetching Pixabay...");
  try {
    const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    console.log("Result:", JSON.stringify(data).substring(0, 200));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
