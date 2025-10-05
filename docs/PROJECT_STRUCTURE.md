# 🏗️ Project Structure Documentation

## Overview

The nano Banana GIF Generator follows a professional, modular architecture designed for maintainability, scalability, and ease of development.

## Directory Structure

```
nano-banana-gif-generator/
├── 📁 src/                          # Source code
│   ├── 📁 core/                     # Core application logic
│   │   ├── 📄 config.js            # Centralized configuration
│   │   ├── 📄 logger.js            # Logging utilities
│   │   └── 📄 generator.js          # Main GIF generation orchestrator
│   ├── 📁 integrations/             # AI service integrations
│   │   └── 📄 gemini_integration.js # nano Banana (Gemini) integration
│   ├── 📁 utils/                    # Utility functions
│   │   ├── 📄 fileUtils.js          # File operations and management
│   │   └── 📄 animationUtils.js     # Animation logic and frame generation
│   ├── 📁 cli/                      # Command-line interface
│   │   └── 📄 commands.js           # CLI command definitions
│   └── 📄 index.js                  # Main application entry point
├── 📁 tests/                        # Test files
│   ├── 📄 test_gemini_integration.js # Integration tests
│   └── 📄 test_api_key.js           # API key validation tests
├── 📁 docs/                         # Documentation
│   ├── 📄 TROUBLESHOOTING.md        # Troubleshooting guide
│   └── 📄 PROJECT_STRUCTURE.md     # This file
├── 📁 config/                       # Configuration files
│   └── 📄 eslint.config.js          # ESLint configuration
├── 📁 scripts/                      # Build and utility scripts
├── 📁 output/                       # Generated GIF files
├── 📁 temp/                         # Temporary files during generation
├── 📄 package.json                  # Project configuration and dependencies
├── 📄 README.md                     # Main project documentation
├── 📄 .gitignore                    # Git ignore rules
├── 📄 env.example                   # Environment variables template
└── 📄 index.js                      # Legacy entry point (redirects to src/)
```

## Module Responsibilities

### 🎯 Core Modules (`src/core/`)

#### `config.js`
- **Purpose**: Centralized configuration management
- **Exports**: `CONFIG` object with all application settings
- **Features**: 
  - Output directory configuration
  - Animation parameters
  - API settings
  - Supported formats

#### `logger.js`
- **Purpose**: Consistent logging across the application
- **Exports**: `Logger` class and default `logger` instance
- **Features**:
  - Structured logging with emojis
  - Different log levels (info, success, warning, error, debug)
  - Header and separator utilities

#### `generator.js`
- **Purpose**: Main GIF generation orchestrator
- **Exports**: `GifGenerator` class and `generateAnimatedGif` function
- **Features**:
  - Coordinates the entire generation process
  - Manages AI service fallbacks
  - Handles frame generation and GIF creation
  - Error handling and recovery

### 🔌 Integration Modules (`src/integrations/`)

#### `gemini_integration.js`
- **Purpose**: nano Banana (Google Gemini) AI integration
- **Exports**: `NanoBananaIntegration` class
- **Features**:
  - Direct integration with Gemini 2.5 Flash
  - Image generation with reference support
  - Animation frame generation
  - Error handling and fallbacks

### 🛠️ Utility Modules (`src/utils/`)

#### `fileUtils.js`
- **Purpose**: File operations and management
- **Exports**: `FileUtils` class with static methods
- **Features**:
  - Directory creation and management
  - File reading/writing operations
  - MIME type detection
  - File validation and cleanup

#### `animationUtils.js`
- **Purpose**: Animation logic and frame generation
- **Exports**: `AnimationUtils` class with static methods
- **Features**:
  - Animation type detection
  - Frame prompt generation
  - Animation parameter validation
  - Motion sequence creation

### 💻 CLI Modules (`src/cli/`)

#### `commands.js`
- **Purpose**: Command-line interface implementation
- **Exports**: `CLICommands` class
- **Features**:
  - Commander.js integration
  - Command definitions and handlers
  - User interaction management
  - Help and information display

## Design Patterns

### 🏛️ Architecture Patterns

1. **Modular Architecture**: Clear separation of concerns
2. **Dependency Injection**: Services injected into classes
3. **Factory Pattern**: Service creation and management
4. **Strategy Pattern**: Multiple AI service implementations
5. **Observer Pattern**: Event-driven logging and notifications

### 📦 Module Organization

1. **Core**: Essential application logic
2. **Integrations**: External service connections
3. **Utils**: Reusable utility functions
4. **CLI**: User interface components

### 🔄 Data Flow

```
User Input → CLI Commands → Generator → AI Integration → File Utils → Output
     ↓              ↓           ↓            ↓              ↓
  Validation → Processing → Orchestration → Generation → File Management
```

## Development Guidelines

### 📝 Code Standards

- **ES Modules**: Use `import/export` syntax
- **Async/Await**: Prefer over Promises for readability
- **Error Handling**: Comprehensive try/catch blocks
- **Logging**: Use the centralized logger
- **Documentation**: JSDoc comments for all public methods

### 🧪 Testing Strategy

- **Unit Tests**: Individual module testing
- **Integration Tests**: Service integration testing
- **CLI Tests**: Command-line interface testing
- **API Tests**: External service testing

### 🔧 Maintenance

- **Linting**: ESLint for code quality
- **Formatting**: Consistent code style
- **Dependencies**: Regular updates and security
- **Documentation**: Keep docs up to date

## Extension Points

### 🚀 Adding New Features

1. **New AI Service**: Add to `src/integrations/`
2. **New Utility**: Add to `src/utils/`
3. **New CLI Command**: Extend `src/cli/commands.js`
4. **New Animation Type**: Extend `src/utils/animationUtils.js`

### 🔌 Integration Points

1. **AI Services**: Implement in `src/integrations/`
2. **File Formats**: Extend `src/utils/fileUtils.js`
3. **Animation Types**: Extend `src/utils/animationUtils.js`
4. **Output Formats**: Extend `src/core/generator.js`

## Performance Considerations

### ⚡ Optimization Strategies

1. **Lazy Loading**: Import modules only when needed
2. **Caching**: Cache API responses and generated content
3. **Parallel Processing**: Generate frames concurrently
4. **Memory Management**: Clean up temporary files
5. **Error Recovery**: Graceful fallbacks for failures

### 📊 Monitoring

1. **Logging**: Comprehensive logging for debugging
2. **Metrics**: Performance tracking and monitoring
3. **Error Reporting**: Detailed error information
4. **User Feedback**: Clear status messages

This structure ensures the project remains maintainable, scalable, and professional while providing clear separation of concerns and easy extension points for future development.
