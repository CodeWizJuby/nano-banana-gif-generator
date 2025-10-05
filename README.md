# 🍌 nano Banana GIF Generator

A comprehensive CLI tool for AI-powered image generation, editing, and animation using Google's Gemini technology. Now supports **ALL** Gemini image generation capabilities with organized output structure and consistent animation generation.

## ✨ Features

### 🎨 **Comprehensive Image Generation**
- 📝 **Text-to-Image** - Generate high-quality images from text descriptions
- ✏️ **Image Editing** - Add, remove, or modify elements with text prompts
- 🖼️ **Multi-Image Composition** - Combine multiple images into new scenes
- 🔄 **Iterative Refinement** - Progressively refine images over multiple turns
- 📝 **High-Fidelity Text Rendering** - Generate images with legible text
- 🎨 **Style Transfer** - Apply styles from one image to another
- 🔧 **Imagen Integration** - Use Imagen models for specialized tasks

### 🎬 **Consistent Animation Generation**
- 🍌 **Real nano Banana Integration** - Uses Google's Gemini 2.5 Flash image generation
- 🎨 **Consistent Animations** - Same character, background, and scene across frames
- 🎬 **Multiple Animation Types** - Walking, flying, dancing, transformation, and more
- 🚀 **Pure Node.js** - No Python dependencies, modern ES modules
- 📁 **Organized Output** - Clean structure: `output/images/`, `output/frames/`, `output/gifs/`

### 🔍 **Advanced Image Understanding**
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
│   │   ├── gifGenerator.js      # Main GIF generator
│   │   └── sequenceGenerator.js # Animation frame generation
│   ├── integrations/            # AI service integrations
│   │   └── gemini_integration.js # Comprehensive Gemini integration
│   ├── utils/                   # Utility functions
│   │   ├── fileUtils.js         # File operations
│   │   └── animationUtils.js     # Animation logic
│   ├── cli/                     # CLI interface
│   │   ├── commands.js          # Command definitions
│   │   └── gifCommands.js       # GIF-specific commands
│   └── index.js                 # Main entry point
├── tests/                       # Test files
│   ├── test_comprehensive_features.js # All features testing
│   └── test_gemini_integration.js     # Integration testing
├── output/                      # Organized output structure
│   ├── images/                  # Single images (default)
│   ├── frames/                  # Animation frames (GIF mode)
│   └── gifs/                    # Final animated GIFs
├── demo_comprehensive_features.js # Feature demonstration
├── COMPREHENSIVE_FEATURES.md    # Complete feature documentation
├── USAGE_GUIDE.md              # Usage guide
└── package.json                # Project configuration
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

### 🎨 **Default: Single Image Generation**

```bash
# Generate single image (saved to output/images/)
node src/index.js generate "A beautiful sunset over mountains" --aspect-ratio 16:9

# Generate with different aspect ratios
node src/index.js generate "A portrait of a cat" --aspect-ratio 1:1
node src/index.js generate "A landscape" --aspect-ratio 16:9
node src/index.js generate "A mobile image" --aspect-ratio 9:16
```

### 🎬 **GIF Mode: Animation Generation**

```bash
# Generate animated GIF (frames to output/frames/, final to output/gifs/)
node src/index.js generate "A cat walking" --gif --frames 5 --animation walking

# Different animation types
node src/index.js generate "A bird flying" --gif --frames 8 --animation flying
node src/index.js generate "A dancer" --gif --frames 6 --animation dancing
node src/index.js generate "A transformation" --gif --frames 10 --animation transformation
```

### 🎯 **Comprehensive Image Features**

```bash
# Text-to-image with specific settings
node src/index.js text-to-image "A beautiful landscape" --aspect-ratio 16:9 --model gemini-2.5-flash-image

# Edit existing image
node src/index.js edit-image "output/images/your_image.png" "Add a rainbow" --aspect-ratio 16:9

# Multi-image composition
node src/index.js compose "Create a scene" --images "img1.jpg,img2.jpg" --aspect-ratio 16:9

# Style transfer
node src/index.js style-transfer "source.jpg" "style.jpg" "Apply the style"

# Text rendering
node src/index.js render-text "Create a poster with 'Welcome' text" --aspect-ratio 4:3

# Iterative refinement
node src/index.js refine "Add more details" --previous-image "previous.png"
```

### 🔍 **Image Understanding Commands**

```bash
# Analyze an image
node src/index.js analyze path/to/image.jpg

# Custom analysis prompt
node src/index.js analyze path/to/image.jpg -p "What emotions does this image convey?"

# Detect objects in an image
node src/index.js detect path/to/image.jpg

# Transform image with style transfer
node src/index.js transform path/to/image.jpg "watercolor painting style"

# Create style animation from reference image
node src/index.js style-animation path/to/image.jpg "cycling through art styles" --frames 8
```

### 🛠️ **Utility Commands**

```bash
# Show all available options
node src/index.js list-options

# Show comprehensive help
node src/index.js info

# Test the system
node src/index.js test "A simple test image"

# Clean temporary files
node src/index.js clean

# Run comprehensive tests
npm run test:comprehensive

# Run feature demonstration
npm run demo
```

### 📊 **Supported Aspect Ratios**

| Ratio | Resolution | Best For |
|-------|------------|----------|
| 1:1   | 1024x1024  | Social media, profile pictures |
| 16:9  | 1344x768   | Widescreen, presentations |
| 4:3   | 1184x864   | Traditional photos |
| 3:4   | 864x1184   | Mobile screens |
| 9:16  | 768x1344   | Stories, vertical videos |
| 3:2   | 1248x832   | Landscape photos |
| 2:3   | 832x1248   | Portrait orientation |

### 🎬 **Animation Types**

- **walking** - Walking motion with consistent character
- **flying** - Flying motion with consistent character  
- **dancing** - Dancing motion with consistent character
- **transformation** - Transformation effects
- **rotating** - Rotation motion
- **flowing** - Flowing motion
- **general** - General motion (default)

### 🔧 **Model Options**

- **gemini-2.5-flash-image** (default) - Best for flexibility and editing
- **imagen-4** - Best for photorealistic images
- **imagen-4-ultra** - Best quality (when available)

### 📁 **Output Structure**

```
output/
├── images/     # Single images (default)
├── frames/     # Animation frames (GIF mode)
└── gifs/       # Final animated GIFs
```

### Programmatic Usage

```javascript
import { NanoBananaIntegration } from './src/integrations/gemini_integration.js';

const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

// Generate single image
const result = await integration.textToImage("A beautiful landscape", {
  aspectRatio: "16:9",
  model: "gemini-2.5-flash-image"
});

// Generate animation frames
const frames = await integration.generateAnimationFrames("A cat walking", 5, "./output/frames");
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

- **[COMPREHENSIVE_FEATURES.md](COMPREHENSIVE_FEATURES.md)** - Complete feature documentation with examples
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Detailed usage guide and examples
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[demo_comprehensive_features.js](demo_comprehensive_features.js)** - Feature demonstration script

### Quick Links
- [Gemini Image Generation Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
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