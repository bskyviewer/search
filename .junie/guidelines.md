# Development Guidelines for Search Project

## Build/Configuration Instructions

### Setup and Installation
1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

## Code Conventions

### Code Generation
- When generating React components, use functional components with TypeScript interfaces for props
- Follow the existing pattern of using Redux hooks (`useAppSelector`, `useAppDispatch`) for state management
- When writing tests, follow the Arrange-Act-Assert pattern shown in the example above

### Preferred Patterns
- Use async/await for asynchronous operations instead of Promise chains
- Use destructuring for props and state
- Use the Redux Toolkit's createSlice for state management
- Use TypeScript interfaces for defining data structures

### File Organization
- New components should be placed in the `src/components` directory
- New Redux slices should be placed in the `src/store` directory
- Tests should be placed in `__tests__` directories adjacent to the files they test

### TypeScript Configuration
- The project uses strict TypeScript configuration
- Path aliases are configured to use the `src` directory as the base URL
- Two separate TypeScript configurations:
  - `tsconfig.app.json` - For the application code
  - `tsconfig.node.json` - For Node.js-specific code (like Vite config)

### Code Style and Linting
- ESLint is configured with TypeScript and React-specific rules
- Run linting with:
  ```bash
  npm run lint
  ```

### State Management
- Redux Toolkit is used for state management
- Redux slices are located in `src/store/`
- Custom hooks for accessing the store are in `src/store/hooks.ts`

### API Integration
- The project uses `@atproto/api` for API integration
- API-related code is in `src/store/api.ts`

## Testing Information

### Running Tests
To run tests without entering watch mode:
```bash
npm test run
```

**Important**: Always use `npm test run` instead of just `npm test` to ensure Vitest doesn't enter watch mode.

### Test Structure
- Tests are located in `__tests__` directories adjacent to the files they test
- The project uses Vitest with JSDOM for testing React components
- Test files follow the naming convention `*.test.ts` or `*.test.tsx`

### Writing Tests
- Tests use the describe/it/expect pattern
- Example test structure:
  ```typescript
  import { describe, it, expect } from "vitest";
  import { yourFunction } from "../yourFile";

  describe("component or function name", () => {
    it("should do something specific", () => {
      // Arrange
      const input = "some input";
      
      // Act
      const result = yourFunction(input);
      
      // Assert
      expect(result).toEqual("expected output");
    });
  });
  ```

### Testing React Components
- Use `@testing-library/react` for rendering and interacting with components
- Use `@testing-library/jest-dom` for additional DOM matchers

## Additional Development Information

### Project Structure
- `src/` - Source code
  - `components/` - React components
  - `store/` - Redux store configuration and slices
  - `__tests__/` - Test files

### TypeScript Configuration
- The project uses strict TypeScript configuration
- Path aliases are configured to use the `src` directory as the base URL
- Two separate TypeScript configurations:
  - `tsconfig.app.json` - For the application code
  - `tsconfig.node.json` - For Node.js-specific code (like Vite config)

### Code Style and Linting
- ESLint is configured with TypeScript and React-specific rules
- Run linting with:
  ```bash
  npm run lint
  ```

### State Management
- Redux Toolkit is used for state management
- Redux slices are located in `src/store/`
- Custom hooks for accessing the store are in `src/store/hooks.ts`

### API Integration
- The project uses `@atproto/api` for API integration
- API-related code is in `src/store/api.ts`

### Important Dependencies
- React 19
- Redux Toolkit
- TypeScript
- Vite
- Vitest for testing