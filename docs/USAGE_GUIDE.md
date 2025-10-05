# 🎨 nano-banana-gif-generator Usage Guide

## 📁 **New Organized Structure**

Your project now has a clean, organized output structure:

```
output/
├── images/     # Single images (default)
├── frames/     # Animation frames (GIF mode)
└── gifs/       # Final animated GIFs
```

## 🚀 **Default Behavior: Single Image Generation**

**By default, the `generate` command creates single images:**

```bash
# Generate a single image (saved to output/images/)
node src/index.js generate "A beautiful sunset over mountains" --aspect-ratio 16:9

# Generate with different aspect ratios
node src/index.js generate "A portrait of a cat" --aspect-ratio 1:1
node src/index.js generate "A landscape" --aspect-ratio 16:9
node src/index.js generate "A mobile image" --aspect-ratio 9:16
```

## 🎬 **GIF Mode: Animation Generation**

**Use `--gif` flag to create animations:**

```bash
# Generate animated GIF (saves frames to output/frames/, final GIF to output/gifs/)
node src/index.js generate "A cat walking" --gif --frames 5 --animation walking

# Different animation types
node src/index.js generate "A bird flying" --gif --frames 8 --animation flying
node src/index.js generate "A dancer" --gif --frames 6 --animation dancing
node src/index.js generate "A transformation" --gif --frames 10 --animation transformation
```

## 🎯 **All Available Commands**

### **Single Image Generation (Default)**
```bash
# Basic image generation
node src/index.js generate "Your prompt here"

# With specific aspect ratio
node src/index.js generate "Your prompt" --aspect-ratio 16:9

# With specific model
node src/index.js generate "Your prompt" --model gemini-2.5-flash-image
```

### **Animation Generation**
```bash
# Create animated GIF
node src/index.js generate "Your prompt" --gif

# With custom settings
node src/index.js generate "Your prompt" --gif --frames 8 --animation walking --delay 300
```

### **Advanced Image Features**
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

## 📐 **Supported Aspect Ratios**

| Ratio | Resolution | Best For |
|-------|------------|----------|
| 1:1   | 1024x1024  | Social media, profile pictures |
| 16:9  | 1344x768   | Widescreen, presentations |
| 4:3   | 1184x864   | Traditional photos |
| 3:4   | 864x1184   | Mobile screens |
| 9:16  | 768x1344   | Stories, vertical videos |
| 3:2   | 1248x832   | Landscape photos |
| 2:3   | 832x1248   | Portrait orientation |

## 🎬 **Animation Types**

- **walking** - Walking motion
- **flying** - Flying motion  
- **dancing** - Dancing motion
- **transformation** - Transformation effects
- **rotating** - Rotation motion
- **flowing** - Flowing motion
- **general** - General motion (default)

## 🔧 **Model Options**

- **gemini-2.5-flash-image** (default) - Best for flexibility and editing
- **imagen-4** - Best for photorealistic images
- **imagen-4-ultra** - Best quality (when available)

## 📊 **Output Examples**

### **Single Image Generation**
```bash
node src/index.js generate "A futuristic city at sunset"
# Output: output/images/generated_image_1759696861227.png
# Resolution: 1024x1024 (1:1 default)
# Tokens: 1290
```

### **GIF Generation**
```bash
node src/index.js generate "A cat walking" --gif --frames 5
# Frames: output/frames/frame_00_timestamp.png, frame_01_timestamp.png, etc.
# Final GIF: output/gifs/animated_cat_walking_timestamp.gif
```

## 🎨 **Creative Workflows**

### **1. Quick Image Generation**
```bash
# Generate a single image quickly
node src/index.js generate "A beautiful landscape" --aspect-ratio 16:9
```

### **2. Animation Creation**
```bash
# Create a walking animation
node src/index.js generate "A character walking" --gif --frames 8 --animation walking

# Create a transformation
node src/index.js generate "A butterfly emerging" --gif --frames 12 --animation transformation
```

### **3. Image Editing Workflow**
```bash
# Generate base image
node src/index.js generate "A simple house"

# Edit the image
node src/index.js edit-image "output/images/generated_image_xxx.png" "Add a garden and rainbow"
```

### **4. Style Transfer Workflow**
```bash
# Generate source image
node src/index.js generate "A modern building"

# Apply artistic style
node src/index.js style-transfer "output/images/building.png" "style_reference.jpg" "Apply Van Gogh style"
```

## 🛠️ **Helpful Commands**

```bash
# Show all available options
node src/index.js list-options

# Show comprehensive help
node src/index.js info

# Test the system
node src/index.js test "A simple test image"

# Clean temporary files
node src/index.js clean
```

## 📁 **File Organization**

- **Single images** → `output/images/`
- **Animation frames** → `output/frames/`
- **Final GIFs** → `output/gifs/`

## 🎯 **Quick Start Examples**

```bash
# 1. Generate a single image
node src/index.js generate "A beautiful sunset"

# 2. Generate with specific aspect ratio
node src/index.js generate "A portrait" --aspect-ratio 1:1

# 3. Create an animation
node src/index.js generate "A bird flying" --gif --frames 6

# 4. Edit an existing image
node src/index.js edit-image "output/images/your_image.png" "Add a rainbow"

# 5. Create a text poster
node src/index.js render-text "Create a poster with 'Welcome to AI' text"
```

## 🎉 **You're All Set!**

Your nano-banana-gif-generator now has:
- ✅ **Default single image generation** to `output/images/`
- ✅ **GIF mode** with `--gif` flag for animations
- ✅ **Organized output structure**
- ✅ **All comprehensive Gemini features**
- ✅ **Easy-to-use CLI interface**

**Start creating amazing images and animations!** 🚀✨
