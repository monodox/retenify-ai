# Contributing to Retenify AI

Thank you for your interest in contributing to Retenify AI! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/retenify-ai.git
   cd retenify-ai
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/original-owner/retenify-ai.git
   ```

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- Google Cloud Project (for AI features)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**: Fix issues in the codebase
- **Feature development**: Add new features or enhance existing ones
- **Documentation**: Improve or add documentation
- **Testing**: Add or improve tests
- **Performance**: Optimize performance
- **Security**: Address security vulnerabilities
- **Agent development**: Create new AI agents or improve existing ones

### Before You Start

1. **Check existing issues** to see if your contribution is already being worked on
2. **Create an issue** to discuss major changes before implementing them
3. **Assign yourself** to the issue you're working on
4. **Keep changes focused** - one feature or fix per pull request

## Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new analysis agent for revenue forecasting"
git commit -m "fix: resolve chat persistence issue"
git commit -m "docs: update API documentation"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference to related issues
- Screenshots (if UI changes)
- Testing instructions

### 5. Code Review Process

- All pull requests require review from maintainers
- Address feedback promptly
- Keep your branch up to date with main
- Be responsive to questions and suggestions

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, Node.js version)
- **Screenshots** or error messages (if applicable)
- **Additional context** that might be helpful

### Feature Requests

For feature requests, provide:

- **Clear description** of the proposed feature
- **Use case** and motivation
- **Possible implementation** approach (if you have ideas)
- **Alternatives considered**

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use strict mode settings

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router conventions
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow existing design patterns
- Use shadcn/ui components when available
- Ensure responsive design

### Code Quality

- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Comments**: Add comments for complex logic
- **Naming**: Use descriptive variable and function names

### Agent Development

When creating new AI agents:

1. **Extend base agent interface**
2. **Implement required methods**
3. **Add proper error handling**
4. **Include confidence scoring**
5. **Write comprehensive tests**
6. **Document agent capabilities**

Example agent structure:
```typescript
export class CustomAgent implements Agent {
  async process(input: AgentInput): Promise<AgentOutput> {
    // Implementation
  }
  
  getCapabilities(): AgentCapabilities {
    // Return agent capabilities
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e

# Run type checking
npm run type-check
```

### Writing Tests

- Write unit tests for new functions and components
- Add integration tests for API endpoints
- Include end-to-end tests for critical user flows
- Aim for 80%+ test coverage
- Test both success and error scenarios

### Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Test implementation
  })
  
  it('should handle error cases', () => {
    // Error handling test
  })
})
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms and business logic
- Include usage examples where helpful
- Keep comments up to date with code changes

### README Updates

- Update README.md for new features
- Add new environment variables to setup instructions
- Update API documentation for new endpoints
- Include migration guides for breaking changes

### Changelog

- Add entries to CHANGELOG.md for all changes
- Follow the existing format
- Include breaking changes prominently
- Reference related issues and pull requests

## Getting Help

If you need help with contributing:

- **GitHub Discussions**: Ask questions in our discussions
- **Issues**: Create an issue for bugs or feature requests
- **Email**: Contact us at contribute@retenify.ai
- **Discord**: Join our community Discord server

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation
- Community highlights

## License

By contributing to Retenify AI, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.