// A very simple script to test Claude API
// Run this with: node claude-simple-test.js YOUR_API_KEY

const https = require('https');

// Get API key from command line argument
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Please provide your API key as an argument:');
  console.error('node claude-simple-test.js YOUR_API_KEY');
  process.exit(1);
}

// API request data
const data = JSON.stringify({
  model: 'claude-3-7-sonnet-20250219',
  max_tokens: 300,
  messages: [
    { role: 'user', content: 'Hello Claude, please reply with a brief greeting.' }
  ]
});

// Request options
const options = {
  hostname: 'api.anthropic.com',
  port: 443,
  path: '/v1/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Length': data.length
  }
};

console.log('Testing Claude API...');

// Make the request
const req = https.request(options, (res) => {
  let responseData = '';

  // Collect response data
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  // Process the complete response
  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      
      if (res.statusCode === 200) {
        console.log('Success! Claude responded:');
        console.log(result.content[0].text);
      } else {
        console.error('API Error:', result.error || result);
      }
    } catch (e) {
      console.error('Error parsing response:', e.message);
      console.error('Raw response:', responseData);
    }
  });
});

// Handle request errors
req.on('error', (error) => {
  console.error('Request failed:', error.message);
});

// Send the request
req.write(data);
req.end();

console.log('Request sent, waiting for response...');