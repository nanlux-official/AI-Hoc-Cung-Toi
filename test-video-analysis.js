// Test script để phân tích video
const axios = require('axios');

const testUrl = 'https://www.youtube.com/watch?v=IO8VqVE3LuU';

console.log('🎬 Testing video analysis...');
console.log('URL:', testUrl);
console.log('');

axios.post('http://localhost:5000/api/video/analyze', {
  url: testUrl
})
.then(response => {
  console.log('✅ SUCCESS!');
  console.log('');
  console.log('📊 Analysis Result:');
  console.log(JSON.stringify(response.data, null, 2));
})
.catch(error => {
  console.error('❌ ERROR!');
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else {
    console.error('Message:', error.message);
  }
});
