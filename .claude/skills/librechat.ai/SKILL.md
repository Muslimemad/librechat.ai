```markdown
# librechat.ai Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `librechat.ai` TypeScript codebase. It covers file naming, import/export styles, commit message conventions, and testing patterns. The guide also provides suggested commands for common workflows to help streamline development and collaboration.

## Coding Conventions

### File Naming
- **Style:** camelCase
- **Example:**  
  ```plaintext
  userProfile.ts
  chatSessionManager.ts
  ```

### Import Style
- **Style:** Alias imports are preferred.
- **Example:**  
  ```typescript
  import utils from '@lib/utils';
  import { fetchData } from '@services/api';
  ```

### Export Style
- **Style:** Mixed (both default and named exports are used).
- **Example:**  
  ```typescript
  // Named export
  export function startSession() { ... }

  // Default export
  export default ChatManager;
  ```

### Commit Message Conventions
- **Type:** Conventional Commits
- **Prefix:** `feat`
- **Average Length:** 63 characters
- **Example:**  
  ```
  feat: add user authentication to chat sessions
  ```

## Workflows

### Creating a New Feature
**Trigger:** When adding new functionality.
**Command:** `/new-feature`

1. Create a new TypeScript file using camelCase naming.
2. Use alias imports for dependencies.
3. Export functions or classes using the mixed export style.
4. Write a conventional commit message prefixed with `feat`.
5. Add or update corresponding test files as needed.

### Writing and Running Tests
**Trigger:** When verifying code correctness.
**Command:** `/run-tests`

1. Create or update test files matching the pattern `*.test.*`.
2. Ensure tests cover new or modified functionality.
3. Run the test suite using the project's test runner (framework unknown; see project documentation).

### Importing Modules
**Trigger:** When using code from other parts of the project.
**Command:** `/import-module`

1. Use alias imports for internal modules.
2. Prefer named imports when importing multiple utilities.
3. Use default imports for main modules.

## Testing Patterns

- **Test File Pattern:** Files should be named with the pattern `*.test.*` (e.g., `chatSession.test.ts`).
- **Framework:** Not explicitly detected; refer to project documentation.
- **Example:**  
  ```typescript
  // chatSession.test.ts
  import { startSession } from '@lib/chatSession';

  test('should start a new session', () => {
    expect(startSession()).toBeTruthy();
  });
  ```

## Commands
| Command         | Purpose                                 |
|-----------------|-----------------------------------------|
| /new-feature    | Scaffold a new feature with conventions |
| /run-tests      | Run the test suite                      |
| /import-module  | Import modules using alias style        |
```
