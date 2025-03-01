# CLAUDE.md - Chat Playground Guidelines

## Commands
- **Development**: `npm run dev` (starts Vite dev server)
- **Build**: `npm run build` (builds for production)
- **Preview**: `npm run preview` (preview production build)
- **Lint**: `npm run lint` (ESLint for src directory)
- **Typecheck**: `npm run typecheck` (TypeScript checks)

## Code Style
- **Imports**: Group by external dependencies then internal (@/components, @/utils, etc.)
- **Components**: Use functional components with React.FC<Props> type
- **Props**: Define interfaces with descriptive names (e.g., ChatInputProps)
- **Types**: Strict typing, use TypeScript interfaces, prefer union types for enums
- **Error Handling**: Use try/catch with specific error messages
- **State Management**: Use Zustand with actions defined in store.ts
- **File Organization**: Group by feature in appropriate directories
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Formatting**: 2-space indentation, semicolons required
- **Hooks**: Custom hooks start with 'use' prefix and extracted to /hooks

## File Structure
- API logic in /api
- UI components in /components
- Custom hooks in /hooks
- Global types in /types
- Utility functions in /utils
- Global styles in /styles