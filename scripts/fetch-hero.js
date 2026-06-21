const fs = require('fs');
const https = require('https');

async function downloadHero() {
  const url = "https://pixabay.com/api/?key=56305437-d5a06ea9b9035b8e2b6f16c9e&q=lush+green+garden+nature&image_type=photo&orientation=horizontal&per_page=3";
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      const imgUrl = data.hits[0].largeImageURL;
      
      const file = fs.createWriteStream('./public/assets/hero.jpg');
      https.get(imgUrl, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close();
          console.log('Hero downloaded successfully.');
        });
      });
    } else {
      console.log('No hits found.');
    }
  } catch(e) {
    console.error(e);
  }
}
downloadHero();
