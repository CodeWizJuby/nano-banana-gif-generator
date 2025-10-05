# 📁 Project Structure

This document outlines the clean, organized structure of the nano-banana-gif-generator project.

## 🏗️ **Root Level Files**

```
nano-banana-gif-generator/
├── README.md                    # Main project documentation
├── package.json                 # Project configuration and dependencies
├── package-lock.json           # Dependency lock file
├── .env.example                # Environment variables template
├── index.js                    # Main entry point
├── nano-banana-gif.bat         # Windows batch file for easy execution
└── .gitignore                  # Git ignore rules
```

## 📂 **Directory Structure**

### 🎯 **Source Code (`src/`)**
```
src/
├── config/
│   └── environment.js          # Centralized environment configuration
├── core/                       # Core application logic
│   ├── config.js              # Legacy configuration
│   ├── logger.js              # Logging utilities
│   ├── gifGenerator.js        # Main GIF generator
│   ├── sequenceGenerator.js   # Animation frame generation
│   ├── canvasGifAssembler.js  # Canvas-based GIF assembly
│   ├── gifAssembler.js        # GIF assembly logic
│   ├── simpleGifAssembler.js  # Simple GIF assembly
│   └── generator.js           # Core generation logic
├── integrations/               # AI service integrations
│   └── gemini_integration.js  # Comprehensive Gemini integration
├── utils/                      # Utility functions
│   ├── fileUtils.js           # File operations
│   └── animationUtils.js      # Animation logic
├── cli/                        # Command-line interface
│   ├── commands.js            # Command definitions
│   └── gifCommands.js         # GIF-specific commands
└── index.js                   # Main entry point
```

### 🧪 **Scripts (`scripts/`)**
```
scripts/
├── demos/                      # Demonstration scripts
│   └── demo_comprehensive_features.js
└── tests/                      # Comprehensive test scripts
    └── test_comprehensive_features.js
```

### 🧪 **Tests (`tests/`)**
```
tests/                          # Legacy test files
├── test_api_key.js            # API key validation tests
├── test_basic_gemini.js       # Basic Gemini integration tests
├── test_gemini_integration.js # Gemini integration tests
├── test_image_understanding.js # Image understanding tests
├── test_simple_api.js         # Simple API tests
├── test_canvas_gif.js         # Canvas GIF tests
├── test_cli_parsing.js        # CLI parsing tests
├── test_gif_assembly.js       # GIF assembly tests
└── test_gif_generation.js     # GIF generation tests
```

### 📚 **Documentation (`docs/`)**
```
docs/
├── features/                  # Feature documentation
│   ├── COMPREHENSIVE_FEATURES.md
│   └── IMPLEMENTATION_SUMMARY.md
├── MIGRATION_SUMMARY.md       # Migration documentation
├── PROJECT_STRUCTURE.md       # This file
├── TROUBLESHOOTING.md         # Troubleshooting guide
└── USAGE_GUIDE.md             # Usage guide
```

### 📁 **Output Directories**
```
output/                        # Main output directory
├── images/                    # Single images (default)
├── frames/                    # Animation frames (GIF mode)
└── gifs/                      # Final animated GIFs

demo_output/                   # Demo script outputs
test_output/                   # Test script outputs
temp/                          # Temporary files
```

### 🔧 **Configuration (`config/`)**
```
config/
└── eslint.config.js          # ESLint configuration
```

### 📖 **Examples (`examples/`)**
```
examples/
└── image_understanding_examples.md
```

## 🎯 **Key Features of This Structure**

### ✅ **Clean Organization**
- **Single README.md** at root level (not in src/)
- **Organized directories** with clear purposes
- **Separated concerns** (source, tests, docs, scripts)
- **No scattered files** in root directory

### ✅ **Environment Management**
- **Centralized configuration** in `src/config/environment.js`
- **Environment validation** before running scripts
- **Template file** (`.env.example`) for easy setup

### ✅ **Script Organization**
- **Demo scripts** in `scripts/demos/`
- **Test scripts** in `scripts/tests/`
- **Legacy tests** in `tests/` directory
- **Clear separation** between different types of scripts

### ✅ **Documentation Structure**
- **Main README.md** at root level
- **Feature docs** in `docs/features/`
- **Usage guides** in `docs/`
- **Examples** in `examples/`

### ✅ **Output Management**
- **Organized outputs** in separate directories
- **Clear separation** between images, frames, and GIFs
- **Demo and test outputs** in dedicated directories

## 🚀 **Benefits of This Structure**

1. **Professional Appearance**: Clean, organized project structure
2. **Easy Navigation**: Clear directory purposes and file locations
3. **Maintainable**: Easy to find and modify specific components
4. **Scalable**: Easy to add new features and documentation
5. **Standard Compliant**: Follows Node.js project best practices
6. **Environment Ready**: Proper environment variable management
7. **Documentation Rich**: Comprehensive documentation structure

## 📋 **File Purposes Summary**

| File/Directory | Purpose |
|----------------|---------|
| `README.md` | Main project documentation (root level) |
| `src/` | Source code and application logic |
| `scripts/` | Demo and test scripts |
| `tests/` | Legacy test files |
| `docs/` | All documentation files |
| `output/` | Generated content (images, frames, GIFs) |
| `config/` | Configuration files |
| `examples/` | Usage examples |
| `.env.example` | Environment variables template |

This structure provides a clean, professional, and maintainable project organization that follows best practices for Node.js projects.
