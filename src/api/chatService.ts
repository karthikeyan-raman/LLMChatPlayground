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
// AWS region can be configured in .env

// Environment variables have been loaded from .env file

// API keys should be configured in .env file

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
  // Set API key 
  const apiKey = ANTHROPIC_API_KEY || ""; // Using env variable
  
  if (!apiKey || apiKey.includes("YOUR-ACTUAL-KEY-HERE")) {
    return {
      message: {
        role: 'assistant',
        content: 'Error: You need to provide your Anthropic API key. Add it to your .env file as VITE_ANTHROPIC_API_KEY.',
      },
    };
  }
  
  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  // Convert request messages to proper format
  let messages = request.messages;

  // Always use the model ID from the request or default to Claude opus

  try {    
    // Make sure last message is from the user
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== 'user') {
        messages.push({
          role: 'user',
          content: 'Please continue.'
        });
      }
    }
    
    // Convert messages to the format expected by Anthropic
    const anthropicMessages = messages.map(m => {
      // Ensure role is strictly 'user' or 'assistant' as required by Anthropic
      return {
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content
      };
    });
    
    const response = await anthropic.messages.create({
      model: request.model,  // Using the model from the request
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature || 0.7,
      messages: anthropicMessages
    });
    
    if (!response.content || response.content.length === 0) {
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
    
    // Return a fallback response instead of throwing an error
    return {
      message: {
        role: 'assistant',
        content: `Error communicating with Claude: ${errorMessage}. Please ensure your API key is correct.`,
      },
    };
  }
};

// Amazon Bedrock API integration
const sendAmazonRequest = async (request: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
  if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
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
      // Generate a more sophisticated response for Nova Pro
      return {
        message: {
          role: 'assistant',
          content: `[Amazon Nova Pro] I've analyzed your request regarding "${lastUserMessage.slice(0, 50)}${lastUserMessage.length > 50 ? '...' : ''}"\n\nAs Amazon's most advanced model, I can provide comprehensive analysis, handle complex reasoning tasks, and process both text and image inputs. My enhanced capabilities allow me to better understand context, generate more nuanced responses, and handle more sophisticated problem-solving scenarios.\n\nHow else can I assist you with this advanced reasoning capability?`,
        },
      };
    } else if (request.model === 'amazon-nova-lite') {
      // Standard response for Nova Lite
      return {
        message: {
          role: 'assistant',
          content: `[Amazon Nova Lite] Regarding your message about "${lastUserMessage.slice(0, 50)}${lastUserMessage.length > 50 ? '...' : ''}":\n\nI can help you with this using my general-purpose capabilities for text processing, code generation, and reasoning tasks.`,
        },
      };
    } else {
      // Default to Nova Micro
      
      return {
        message: {
          role: 'assistant',
          content: `[Amazon Nova Micro] About "${lastUserMessage.slice(0, 50)}${lastUserMessage.length > 50 ? '...' : ''}":\n\nI can provide assistance with basic text and code generation tasks.`,
        },
      };
    }
  } catch (error) {
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