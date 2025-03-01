# Modern LLM Chat Playground

A modern and feature-rich chat playground for interacting with various Large Language Models (LLMs) including:

- OpenAI o3-mini
- ChatGPT 4.5
- Claude Sonnet 3.7
- Amazon Nova Lite
- Amazon Nova Micro

## Features

- 🤖 Support for multiple LLM providers and models
- 📁 File uploads with drag and drop support (PDF, Excel, CSV, images, text)
- 💬 Persistent chat history
- 🎨 Modern, responsive UI with dark mode
- ⚡ Fast and lightweight
- 📱 Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/chat-playground.git
cd chat-playground
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Usage

1. Select an LLM model from the dropdown in the sidebar
2. Start a new chat by clicking the "New Chat" button
3. Type your message in the input field at the bottom
4. Optionally, upload files by clicking the attachment icon
5. Press Enter or click the send button to send your message
6. View the model's response in the chat area

## File Support

The application supports the following file types:

- PDF documents
- Excel spreadsheets (.xls, .xlsx)
- CSV files
- Images (PNG, JPG, JPEG, GIF, WebP)
- Text files (.txt, .md, etc.)

## Development

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

### Linting and Type Checking

To lint the code:

```bash
npm run lint
# or
yarn lint
```

To check types:

```bash
npm run typecheck
# or
yarn typecheck
```

## Technology Stack

- React for UI components
- TypeScript for type safety
- Material UI for component styling
- Zustand for state management
- Vite for fast development and building
- React Dropzone for file uploads
- React Markdown for rendering markdown

## Implementing LLM API Integration

This version includes a mock implementation for simulating LLM responses. To connect to real LLM APIs:

1. Obtain API keys for each provider (OpenAI, Anthropic, Amazon Bedrock, etc.)
2. Update the `chatService.ts` file to make actual API calls
3. Implement proper error handling and rate limiting
4. Add appropriate authentication and security measures

## License

MIT

## Acknowledgments

- Inspired by various LLM chat interfaces
- Built with modern web technologies