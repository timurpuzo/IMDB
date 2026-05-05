const axios = require('axios');

async function testAPI() {
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
    
    // Test if URLs are accessible
    const https = require('https');
    
    function testURL(url) {
      return new Promise((resolve) => {
        const request = https.get(url, (res) => {
          resolve(res.statusCode === 200);
        }).on('error', () => {
          resolve(false);
        });
      });
    }
    
    console.log('Testing URL accessibility...');
    console.log('Shawshank URL accessible:', await testURL(shawshank.posterPath));
    console.log('Dark Knight URL accessible:', await testURL(darkKnight.posterPath));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
