# Gemini Image Understanding Examples

This document provides comprehensive examples of how to use the enhanced nano-banana-gif-generator with Gemini's image understanding capabilities.

## Setup

First, ensure you have your Google API key set up:

```bash
# Create .env file
echo "GOOGLE_API_KEY=your_api_key_here" > .env
```

## New CLI Commands

### 1. Image Analysis

Analyze any image with custom prompts:

```bash
# Basic analysis
nano-banana-gif analyze path/to/image.jpg

# Custom analysis prompt
nano-banana-gif analyze path/to/image.jpg -p "What emotions does this image convey?"

# Different caption styles
nano-banana-gif analyze path/to/image.jpg -s detailed
nano-banana-gif analyze path/to/image.jpg -s brief
nano-banana-gif analyze path/to/image.jpg -s artistic
nano-banana-gif analyze path/to/image.jpg -s technical
```

### 2. Object Detection

Use Gemini's enhanced object detection (Gemini 2.0+):

```bash
# Detect all objects in an image
nano-banana-gif detect path/to/image.jpg

# The system will identify objects, their locations, and characteristics
```

### 3. Image Transformation

Transform images with style transfer:

```bash
# Basic style transfer
nano-banana-gif transform path/to/image.jpg "watercolor painting style"

# Save to specific output
nano-banana-gif transform path/to/image.jpg "oil painting style" -o output/styled_image.png

# Different artistic styles
nano-banana-gif transform path/to/image.jpg "impressionist painting style"
nano-banana-gif transform path/to/image.jpg "pixel art style"
nano-banana-gif transform path/to/image.jpg "anime art style"
nano-banana-gif transform path/to/image.jpg "vintage photograph style"
```

### 4. Style Animation

Create animated GIFs from reference images with style variations:

```bash
# Basic style animation
nano-banana-gif style-animation path/to/image.jpg "transform with different artistic styles"

# Customize animation parameters
nano-banana-gif style-animation path/to/image.jpg "cycling through art styles" \
  --frames 8 \
  --width 1024 \
  --height 1024 \
  --delay 300

# Different animation types
nano-banana-gif style-animation path/to/image.jpg "walking through different art galleries"
nano-banana-gif style-animation path/to/image.jpg "transforming between painting styles"
```

## Programmatic Usage

### Image Analysis

```javascript
import { NanoBananaIntegration } from './src/integrations/gemini_integration.js';

const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

// Analyze an image
const analysis = await integration.analyzeImage('path/to/image.jpg', 'Describe this image in detail');
console.log(analysis);

// Generate captions
const caption = await integration.generateCaption('path/to/image.jpg', 'artistic');
console.log(caption);

// Answer questions about images
const answer = await integration.answerQuestion('path/to/image.jpg', 'What colors are prominent?');
console.log(answer);
```

### Object Detection

```javascript
// Detect objects in an image
const detection = await integration.detectObjects('path/to/image.jpg');
console.log(detection);
```

### Image-to-Image Generation

```javascript
// Transform image with style transfer
const styledImage = await integration.imageToImageGeneration(
  'path/to/reference.jpg',
  'transform into a watercolor painting',
  'output/styled_image.png'
);
console.log('Styled image saved:', styledImage);
```

### Style Animation

```javascript
// Generate style animation frames
const framePaths = await integration.generateStyleAnimationFrames(
  'path/to/reference.jpg',
  'cycling through different art styles',
  5,
  './temp_frames'
);

// Then assemble into GIF using your preferred GIF library
```

## Supported Image Formats

The tool supports all Gemini-compatible image formats:

- **PNG** (`.png`) - `image/png`
- **JPEG** (`.jpg`, `.jpeg`) - `image/jpeg`
- **WEBP** (`.webp`) - `image/webp`
- **HEIC** (`.heic`) - `image/heic`
- **HEIF** (`.heif`) - `image/heif`

## Model Capabilities

### Gemini 1.5 Models
- Basic image understanding
- Text-to-image generation
- Image analysis and captioning

### Gemini 2.0 Models
- Enhanced object detection
- Improved accuracy for specialized tasks
- Better multimodal understanding

### Gemini 2.5 Models
- Advanced segmentation capabilities
- Enhanced object detection
- Superior image understanding

## Token Calculation

Understanding token usage for images:

- **Small images** (≤384px both dimensions): 258 tokens
- **Larger images**: Tiled into 768x768 pixel tiles, each costing 258 tokens
- **Formula**: floor(min(width, height) / 1.5) determines crop unit size

Example: 960x540 image = 6 tiles = 1,548 tokens

## Best Practices

### Image Quality
- Use clear, non-blurry images
- Ensure images are correctly rotated
- Optimal resolution: 512x512 to 1024x1024 pixels

### Prompt Engineering
- Be specific with analysis prompts
- Use descriptive style prompts for transformations
- For animations, describe the desired motion clearly

### Performance Tips
- Start with smaller images for testing
- Use appropriate frame counts (3-8 frames for most animations)
- Consider token costs for large images

## Error Handling

Common issues and solutions:

```javascript
try {
  const result = await integration.analyzeImage('path/to/image.jpg');
} catch (error) {
  if (error.message.includes('Image file not found')) {
    console.error('Please check the image path');
  } else if (error.message.includes('Unsupported image format')) {
    console.error('Please use supported formats: PNG, JPEG, WEBP, HEIC, HEIF');
  } else {
    console.error('Analysis failed:', error.message);
  }
}
```

## Integration with Existing Features

The image understanding features work seamlessly with existing GIF generation:

```bash
# Generate frames using image understanding
nano-banana-gif style-animation reference.jpg "walking animation" --frames 5

# Then use existing GIF assembly features
# The frames will be automatically assembled into a GIF
```

## Testing

Run the comprehensive test suite:

```bash
# Test all image understanding features
node tests/test_image_understanding.js

# Test specific functionality
npm test
```

## Advanced Use Cases

### Content Creation Workflow
1. Analyze existing images for style and content
2. Generate variations using style transfer
3. Create animations from style variations
4. Combine with text-to-image generation

### Educational Applications
1. Analyze historical artwork
2. Generate style variations for learning
3. Create educational animations
4. Answer questions about visual content

### Creative Projects
1. Style transfer for artistic projects
2. Object detection for photo organization
3. Caption generation for social media
4. Animation creation from static images

## Troubleshooting

### API Key Issues
```bash
# Check if API key is set
echo $GOOGLE_API_KEY

# Test API connection
npm run test:api
```

### Image Format Issues
- Convert unsupported formats using image conversion tools
- Ensure images are not corrupted
- Check file permissions

### Performance Issues
- Reduce image resolution for faster processing
- Use fewer frames for animations
- Consider token limits for large images

## Resources

- [Gemini Image Understanding Documentation](https://ai.google.dev/gemini-api/docs/image-understanding)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Gemini API Reference](https://ai.google.dev/gemini-api/docs)
- [nano Banana Overview](https://gemini.google/overview/image-generation/)
