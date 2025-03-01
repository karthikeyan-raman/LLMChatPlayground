// This is a standalone test script to check if Anthropic API is working
// Run with: node test-anthropic.js

const Anthropic = require('@anthropic-ai/sdk');

// Replace this with your actual API key
const apiKey = process.env.ANTHROPIC_API_KEY || "your_api_key_here";

async function testAnthropicAPI() {
  try {
    console.log("Testing Anthropic API connection...");
    
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });
    
    console.log("Making API request...");
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Hello, Claude. Please respond with a brief greeting.' }]
    });
    
    console.log("API Response received!");
    console.log("Response ID:", response.id);
    console.log("Content:", response.content[0].text);
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Error testing Anthropic API:");
    console.error(error);
  }
}

// Run the test
testAnthropicAPI();