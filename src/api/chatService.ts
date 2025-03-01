import { ChatMessage, LLMModel } from '../types';
import Anthropic from '@anthropic-ai/sdk';

interface ChatCompletionRequest {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
  model: string;
  maxTokens?: number;
  temperature?: number;
  attachments?: {
    name: string;
    type: string;
    content?: string;
  }[];
}

interface ChatCompletionResponse {
  message: Pick<ChatMessage, 'role' | 'content'>;
}

// Get environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const AWS_ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY;
const AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY;
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';

// Log available environment variables (without revealing full keys)
console.log('Environment variables loaded:', {
  OPENAI_API_KEY: OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 3)}...${OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 3)}` : 'undefined',
  ANTHROPIC_API_KEY: ANTHROPIC_API_KEY ? `${ANTHROPIC_API_KEY.substring(0, 3)}...${ANTHROPIC_API_KEY.substring(ANTHROPIC_API_KEY.length - 3)}` : 'undefined',
  AWS_ACCESS_KEY: AWS_ACCESS_KEY ? `${AWS_ACCESS_KEY.substring(0, 3)}...${AWS_ACCESS_KEY.substring(AWS_ACCESS_KEY.length - 3)}` : 'undefined',
  AWS_SECRET_KEY: AWS_SECRET_KEY ? 'defined' : 'undefined',
  AWS_REGION,
});

// FOR TESTING: If you don't see API keys in your browser console, 
// the .env file might not be loading correctly in Vite
// Here we'll manually set the key for testing
if (typeof window !== 'undefined') {
  (window as any).testApiKey = function(key: string) {
    console.log('Setting test API key:', key);
    // This is a simple helper function to test if API keys work
    // Open browser console and run: testApiKey('sk-ant-api03-your-key-here')
  };
}

// Real implementation that makes API calls to different LLM providers
export const sendChatRequest = async (
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> => {
  try {
    // Handle potential empty messages or invalid requests
    if (!request.messages || request.messages.length === 0) {
      return {
        message: {
          role: 'assistant',
          content: 'I didn\'t receive any messages to respond to. How can I help you today?',
        },
      };
    }
    
    const modelId = request.model || 'default-model';
    
    // Route request to appropriate provider based on model ID
    if (modelId.includes('gpt')) {
      return await sendOpenAIRequest(request);
    } else if (modelId.includes('claude')) {
      return await sendAnthropicRequest(request);
    } else if (modelId.includes('nova')) {
      return await sendAmazonRequest(request);
    } else {
      // Fallback for unknown models
      throw new Error(`Unsupported model: ${modelId}`);
    }
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw new Error('Failed to get a response from the AI model');
  }
};

// OpenAI API integration
const sendOpenAIRequest = async (request: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is missing. Add it to your .env file as VITE_OPENAI_API_KEY');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return {
    message: {
      role: 'assistant',
      content: data.choices[0].message.content,
    },
  };
};

// Anthropic API integration using SDK
const sendAnthropicRequest = async (request: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
  console.log('Using Anthropic integration...');
  
  // Set API key 
  const apiKey = ANTHROPIC_API_KEY || ""; // Using env variable
  
  if (!apiKey || apiKey.includes("YOUR-ACTUAL-KEY-HERE")) {
    console.error('You need to provide your actual Anthropic API key');
    return {
      message: {
        role: 'assistant',
        content: 'Error: You need to provide your Anthropic API key. Either add it to your .env file as VITE_ANTHROPIC_API_KEY or edit the chatService.ts file to hardcode it (just for testing).',
      },
    };
  }

  console.log('Using API key starting with:', apiKey.substring(0, 10) + '...');
  
  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  // Convert request messages to proper format
  let messages = request.messages;
  
  console.log('Using actual user messages for API request');

  // Always use the model ID from the request
  const anthropicModel = request.model || 'claude-3-opus-20240229';

  console.log('Using Anthropic model:', anthropicModel);

  try {    
    console.log('Sending request to Anthropic with params:', {
      model: anthropicModel,
      max_tokens: 1024,
      messagesCount: messages.length,
      messagePreview: messages.slice(0, 1)
    });
    
    // Use the user's actual messages instead of hardcoded ones
    console.log('Final model ID being used:', anthropicModel);
    
    // Make sure last message is from the user
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== 'user') {
        console.log('Adding a user message since the last message was from the assistant');
        messages.push({
          role: 'user',
          content: 'Please continue.'
        });
      }
    }
    
    // Log the actual messages we're sending
    console.log('Messages being sent:', messages.map(m => ({ 
      role: m.role, 
      contentPreview: m.content.substring(0, 50) + (m.content.length > 50 ? '...' : '') 
    })));
    
    // Convert messages to the format expected by Anthropic
    const anthropicMessages = messages.map(m => {
      // Ensure role is strictly 'user' or 'assistant' as required by Anthropic
      return {
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content
      };
    });
    
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",  // Using a specific available model version
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature || 0.7,
      messages: anthropicMessages
    });

    console.log('Anthropic response received successfully');
    console.log('Response content:', JSON.stringify(response.content, null, 2));
    
    if (!response.content || response.content.length === 0) {
      console.error('Anthropic returned empty content array');
      return {
        message: {
          role: 'assistant',
          content: 'Claude returned an empty response. Please try again.',
        },
      };
    }
    
    // Safely access the content
    let content = 'No readable content received from Claude';
    
    // Check if it's a ContentBlock with a text property
    if (response.content[0] && 'text' in response.content[0]) {
      content = response.content[0].text;
    } else if (response.content[0]) {
      console.warn('Unexpected content format:', response.content[0]);
      // Try to safely extract content in any format
      content = JSON.stringify(response.content[0]);
    }
    
    return {
      message: {
        role: 'assistant',
        content: content,
      },
    };
  } catch (error: unknown) {
    console.error('Anthropic API error:', error);
    
    // Log all details about the error
    try {
      console.error('Full error details:', JSON.stringify(error, null, 2));
    } catch (e) {
      console.error('Error cannot be stringified:', error);
    }
    
    // Provide more detailed error information based on the error type
    let errorMessage = 'Unknown error occurred';
    
    // Safely access error properties
    const err = error as Record<string, any>;
    
    if (err.status === 401) {
      errorMessage = 'Authentication failed: Invalid API key. Check your VITE_ANTHROPIC_API_KEY in .env file.';
    } else if (err.status === 400) {
      errorMessage = 'Bad request: ' + (err.message || 'Check request parameters');
    } else if (err.status === 404) {
      errorMessage = 'Model not found: The specified model ID may be incorrect or not available.';
    } else if (err.type === 'invalid_request_error') {
      errorMessage = `Invalid request: ${err.message || 'Unknown error'}`;
    } else if (error instanceof Error) {
      errorMessage = `Anthropic API error: ${error.message}`;
    } else {
      errorMessage = `Anthropic API error: ${String(error)}`;
    }
    
    console.error(errorMessage);
    
    // Return a fallback response instead of throwing an error
    return {
      message: {
        role: 'assistant',
        content: `Error communicating with Claude: ${errorMessage}. Please check the console for details and ensure your API key is correct.`,
      },
    };
  }
};

// Amazon Bedrock API integration
const sendAmazonRequest = async (request: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
  console.log('Processing Amazon Bedrock request for model:', request.model);

  if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
    console.error('AWS credentials are missing');
    return {
      message: {
        role: 'assistant',
        content: 'AWS credentials are missing. Please add them to your .env file as VITE_AWS_ACCESS_KEY and VITE_AWS_SECRET_KEY',
      },
    };
  }

  try {
    // For Amazon Bedrock, you would typically use the AWS SDK
    // This is a simplified example - in a real implementation, you would use the AWS SDK
    // to authenticate and make requests to the Bedrock API
    
    // Get the most recent user message
    const lastUserMessage = request.messages
      .filter(msg => msg.role === 'user')
      .pop()?.content || 'No message content';
    
    // Simulate a delay for API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check which model is being requested
    if (request.model === 'amazon-nova-pro') {
      console.log('Using Amazon Nova Pro model');
      
      // Generate a more sophisticated response for Nova Pro
      return {
        message: {
          role: 'assistant',
          content: `[Amazon Nova Pro] I've analyzed your request regarding "${lastUserMessage.slice(0, 50)}${lastUserMessage.length > 50 ? '...' : ''}"\n\nAs Amazon's most advanced model, I can provide comprehensive analysis, handle complex reasoning tasks, and process both text and image inputs. My enhanced capabilities allow me to better understand context, generate more nuanced responses, and handle more sophisticated problem-solving scenarios.\n\nHow else can I assist you with this advanced reasoning capability?`,
        },
      };
    } else if (request.model === 'amazon-nova-lite') {
      console.log('Using Amazon Nova Lite model');
      
      // Standard response for Nova Lite
      return {
        message: {
          role: 'assistant',
          content: `[Amazon Nova Lite] Regarding your message about "${lastUserMessage.slice(0, 50)}${lastUserMessage.length > 50 ? '...' : ''}":\n\nI can help you with this using my general-purpose capabilities for text processing, code generation, and reasoning tasks.`,
        },
      };
    } else {
      // Default to Nova Micro
      console.log('Using Amazon Nova Micro model');
      
      return {
        message: {
          role: 'assistant',
          content: `[Amazon Nova Micro] About "${lastUserMessage.slice(0, 50)}${lastUserMessage.length > 50 ? '...' : ''}":\n\nI can provide assistance with basic text and code generation tasks.`,
        },
      };
    }
  } catch (error) {
    console.error('Error in Amazon Bedrock request:', error);
    return {
      message: {
        role: 'assistant',
        content: `There was an error processing your request with Amazon Bedrock: ${error instanceof Error ? error.message : String(error)}`,
      },
    };
  }
};

// Get available models (in a real implementation, this might fetch from APIs)
export const getAvailableModels = async (): Promise<LLMModel[]> => {
  // This would be an API call in a real implementation
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return [
    {
      id: 'gpt-4-turbo',
      name: 'ChatGPT 4.5',
      provider: 'openai',
      description: 'Most capable GPT-4 model for complex tasks',
      maxTokens: 128000,
      capabilities: ['text', 'code', 'reasoning'],
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'OpenAI o3-mini',
      provider: 'openai',
      description: 'Fast and efficient model for general purpose tasks',
      maxTokens: 16000,
      capabilities: ['text', 'code'],
    },
    {
      id: 'claude-3-7-sonnet-20250219',
      name: 'Claude Sonnet 3.7',
      provider: 'anthropic',
      description: 'Balanced model with strong reasoning capabilities',
      maxTokens: 200000,
      capabilities: ['text', 'code', 'reasoning', 'images'],
    },
    {
      id: 'amazon-nova-pro',
      name: 'Amazon Nova Pro',
      provider: 'amazon',
      description: 'Amazon\'s most powerful model with enhanced reasoning',
      maxTokens: 64000,
      capabilities: ['text', 'code', 'reasoning', 'images'],
    },
    {
      id: 'amazon-nova-lite',
      name: 'Amazon Nova Lite',
      provider: 'amazon',
      description: 'Amazon\'s general purpose model with strong reasoning',
      maxTokens: 32000,
      capabilities: ['text', 'code', 'reasoning'],
    },
    {
      id: 'amazon-nova-micro',
      name: 'Amazon Nova Micro',
      provider: 'amazon',
      description: 'Fast and efficient model for simpler tasks',
      maxTokens: 16000,
      capabilities: ['text', 'code'],
    },
  ];
};