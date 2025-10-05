# 🍌 nano Banana GIF Generator

A professional CLI tool for generating animated GIFs and performing advanced image understanding using Google's nano Banana (Gemini) AI technology. This tool leverages the latest AI image generation and understanding capabilities to create smooth, consistent animations and analyze images with state-of-the-art computer vision.

## ✨ Features

### 🎬 Animation Generation
- 🍌 **Real nano Banana Integration** - Uses Google's Gemini 2.5 Flash image generation
- 🎨 **Professional Animation** - Consistent character and background across frames
- 🎬 **Multiple Animation Types** - Walking, flying, dancing, transformation, and more
- 🚀 **Pure Node.js** - No Python dependencies, modern ES modules
- 🎯 **AI Fallbacks** - OpenAI DALL-E, Stability AI, and placeholder modes

### 🔍 Image Understanding (NEW!)
- 🔍 **Advanced Image Analysis** - Detailed image description and analysis
- 🎯 **Enhanced Object Detection** - Gemini 2.0+ improved object detection
- ✂️ **Image Segmentation** - Gemini 2.5+ advanced segmentation capabilities
- 📝 **Smart Captioning** - Multiple caption styles (detailed, brief, artistic, technical)
- ❓ **Visual Question Answering** - Ask questions about images
- 🎨 **Image-to-Image Style Transfer** - Transform images with artistic styles
- 🎬 **Style Animation** - Create animations from reference images with style variations

### 🛠️ Developer Experience
- 📁 **Professional Structure** - Clean, maintainable codebase
- 🛠️ **CLI Interface** - Easy-to-use command-line interface
- 📸 **Multi-format Support** - PNG, JPEG, WEBP, HEIC, HEIF

## 🏗️ Project Structure

```
nano-banana-gif-generator/
├── src/                          # Source code
│   ├── core/                     # Core functionality
│   │   ├── config.js            # Configuration management
│   │   ├── logger.js            # Logging utilities
│   │   └── generator.js         # Main GIF generator
│   ├── integrations/            # AI service integrations
│   │   └── gemini_integration.js # nano Banana integration
│   ├── utils/                   # Utility functions
│   │   ├── fileUtils.js         # File operations
│   │   └── animationUtils.js     # Animation logic
│   ├── cli/                     # CLI interface
│   │   └── commands.js          # Command definitions
│   └── index.js                 # Main entry point
├── tests/                       # Test files
├── docs/                        # Documentation
├── config/                      # Configuration files
├── scripts/                     # Build scripts
├── output/                      # Generated GIFs
├── temp/                        # Temporary files
└── package.json                 # Project configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (ES modules support)
- **Google API Key** for Gemini image generation
- **ImageMagick or FFmpeg** for final GIF creation

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nano-banana-gif-generator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Environment Setup

Create a `.env` file with your API keys:

```bash
# Required for nano Banana integration
GOOGLE_API_KEY=your_google_api_key_here

# Optional fallback services
OPENAI_API_KEY=your_openai_api_key_here
STABILITY_API_KEY=your_stability_api_key_here

# Optional: Disable AI and use placeholders
USE_API=true
```

## 📖 Usage

### Animation Commands

```bash
# Generate an animated GIF
npm start generate "a cat walking through a garden"

# Generate multiple animations
npm start generate-multiple "a dancing robot" --animations "walking,flying,dancing"

# Test nano Banana integration
npm test

# Test API key
npm run test:api

# Clean temporary files
npm run clean

# Show help information
npm start info
```

### Image Understanding Commands (NEW!)

```bash
# Analyze an image
npm start analyze path/to/image.jpg

# Custom analysis prompt
npm start analyze path/to/image.jpg -p "What emotions does this image convey?"

# Detect objects in an image
npm start detect path/to/image.jpg

# Transform image with style transfer
npm start transform path/to/image.jpg "watercolor painting style"

# Create style animation from reference image
npm start style-animation path/to/image.jpg "cycling through art styles" --frames 8
```

### Advanced Options

```bash
# Custom analysis style
npm start analyze image.jpg -s artistic

# Save transformed image to specific location
npm start transform image.jpg "oil painting style" -o output/styled.png

# Custom animation parameters
npm start style-animation image.jpg "art style variations" --frames 10 --width 1024 --delay 300
```

### Advanced Usage

```bash
# Custom frame count and delay
npm start generate "a sunset over mountains" --frames 8 --delay 300

# Specify output file
npm start generate "dancing robot" --output my_animation.gif

# Test with custom prompt
npm start test "Create a picture of my cat eating a nano-banana"
```

### Programmatic Usage

```javascript
import { generateAnimatedGif } from './src/core/generator.js';

const result = await generateAnimatedGif('a cat walking', {
  frames: 5,
  delay: 500,
  output: './my_animation.gif'
});

console.log('Generated:', result);
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Project Structure

- **`src/core/`** - Core application logic
- **`src/integrations/`** - AI service integrations
- **`src/utils/`** - Utility functions
- **`src/cli/`** - Command-line interface
- **`tests/`** - Test files
- **`docs/`** - Documentation

### Adding New Features

1. **New AI Integration**: Add to `src/integrations/`
2. **New Utility**: Add to `src/utils/`
3. **New CLI Command**: Add to `src/cli/commands.js`
4. **New Test**: Add to `tests/`

## 🎨 Animation Types

The tool automatically detects animation types from prompts:

- **Walking** - Character movement animations
- **Flying** - Soaring and flight sequences
- **Dancing** - Dance and movement patterns
- **Transformation** - Morphing and changing objects
- **Flowing** - Water and wave animations
- **Rotating** - Spinning and rotation effects
- **General** - Default motion sequences

## 🔍 Image Understanding Capabilities

### Supported Formats
- **PNG** (`.png`) - `image/png`
- **JPEG** (`.jpg`, `.jpeg`) - `image/jpeg`
- **WEBP** (`.webp`) - `image/webp`
- **HEIC** (`.heic`) - `image/heic`
- **HEIF** (`.heif`) - `image/heif`

### Model Capabilities by Version

#### Gemini 1.5 Models
- Basic image understanding and analysis
- Text-to-image generation
- Image captioning and description

#### Gemini 2.0 Models
- **Enhanced object detection** with improved accuracy
- Better multimodal understanding
- Specialized task performance improvements

#### Gemini 2.5 Models
- **Advanced segmentation** capabilities
- Enhanced object detection
- Superior image understanding and analysis
- Best performance for complex visual tasks

### Token Calculation
- **Small images** (≤384px both dimensions): 258 tokens
- **Larger images**: Tiled into 768x768 pixel tiles, each costing 258 tokens
- **Example**: 960x540 image = 6 tiles = 1,548 tokens

## 🔗 API Integration

### Google Gemini (nano Banana)
- **Primary Service** - Best quality and consistency
- **API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Model**: `gemini-2.5-flash` (supports image understanding)

### OpenAI DALL-E
- **Fallback Service** - High quality alternative
- **API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Model**: `dall-e-3`

### Stability AI
- **Alternative Service** - Open source option
- **API Key**: Get from [Stability AI](https://platform.stability.ai/account/keys)
- **Model**: `stable-diffusion-xl-1024-v1-0`

## 📚 Documentation

- [Image Understanding Examples](examples/image_understanding_examples.md) - Comprehensive examples and usage guide
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [API Documentation](docs/API.md) - Detailed API reference
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute

### Quick Links
- [Gemini Image Understanding Documentation](https://ai.google.dev/gemini-api/docs/image-understanding)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [nano Banana Overview](https://gemini.google/overview/image-generation/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google DeepMind** for nano Banana technology
- **OpenAI** for DALL-E integration
- **Stability AI** for open source alternatives
- **BCI Innovation Labs** for development

---

**Made with ❤️ by BCI Innovation Labs**