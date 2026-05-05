const axios = require('axios');

async function testRedirectURLs() {
  try {
    const response = await axios.get('http://localhost:5000/api/movies');
    const shawshank = response.data.data.find(m => m.title === 'The Shawshank Redemption');
    const darkKnight = response.data.data.find(m => m.title === 'The Dark Knight');
    
    console.log('The Shawshank Redemption:');
    console.log('Poster:', shawshank.posterPath);
    console.log('---');
    console.log('The Dark Knight:');
    console.log('Poster:', darkKnight.posterPath);
    console.log('---');
    
    // Test if URLs are accessible with redirect following
    const https = require('https');
    
    function testURL(url) {
      return new Promise((resolve) => {
        const request = https.get(url, { followRedirects: true }, (res) => {
          console.log(`Status for ${url}: ${res.statusCode}`);
          // Follow redirects manually
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log(`Redirecting to: ${res.headers.location}`);
            return testURL(res.headers.location).then(resolve);
          }
          resolve(res.statusCode === 200);
        }).on('error', (err) => {
          console.log(`Error for ${url}: ${err.message}`);
          resolve(false);
        });
      });
    }
    
    console.log('Testing URL accessibility with redirects...');
    const shawshankAccessible = await testURL(shawshank.posterPath);
    const darkKnightAccessible = await testURL(darkKnight.posterPath);
    
    console.log('Shawshank URL accessible:', shawshankAccessible);
    console.log('Dark Knight URL accessible:', darkKnightAccessible);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRedirectURLs();
