/**
 * CLI commands for nano Banana GIF Generator
 * Handles command-line interface and user interactions
 */

import { Command } from 'commander';
import { logger } from '../core/logger.js';
import { CONFIG } from '../core/config.js';
import { FileUtils } from '../utils/fileUtils.js';
import { AnimationUtils } from '../utils/animationUtils.js';
import { GifCommands } from './gifCommands.js';

export class CLICommands {
  constructor() {
    this.program = new Command();
    this.gifCommands = new GifCommands();
    this.setupCommands();
  }

  setupCommands() {
    this.program
      .name('nano-banana-gif')
      .description('Generate animated GIFs using nano Banana-style image generation')
      .version('1.0.0');

    // Generate command (default: single image, use --gif for animation)
    this.program
      .command('generate')
      .description('Generate an image from a text prompt (use --gif for animation)')
      .argument('<prompt>', 'text prompt for image generation')
      .option('--gif', 'generate animated GIF instead of single image', false)
      .option('-f, --frames <number>', 'number of frames to generate (GIF only)', '5')
      .option('-d, --delay <number>', 'delay between frames in milliseconds (GIF only)', '500')
      .option('-a, --animation <type>', 'animation type (GIF only)', 'general')
      .option('-w, --width <number>', 'image/GIF width in pixels', '512')
      .option('-h, --height <number>', 'image/GIF height in pixels', '512')
      .option('-q, --quality <number>', 'GIF quality (1-100)', '80')
      .option('-k, --keep-frames', 'keep individual frame files (GIF only)', false)
      .option('-r, --aspect-ratio <ratio>', 'aspect ratio (1:1, 16:9, 4:3, etc.)', '1:1')
      .option('-m, --model <model>', 'model to use', 'gemini-2.5-flash-image')
      .action(this.handleGenerate.bind(this));

    // Generate multiple command
    this.program
      .command('generate-multiple')
      .description('Generate multiple GIFs with different animation types')
      .argument('<prompt>', 'text prompt for image generation')
      .option('-a, --animations <types>', 'comma-separated animation types', 'walking,flying,dancing')
      .option('-f, --frames <number>', 'number of frames to generate', '5')
      .option('-w, --width <number>', 'GIF width in pixels', '512')
      .option('-h, --height <number>', 'GIF height in pixels', '512')
      .action(this.handleGenerateMultiple.bind(this));

    // Test command
    this.program
      .command('test')
      .description('Test nano Banana integration')
      .argument('[prompt]', 'test prompt for Gemini API', 'a cat walking')
      .action(this.handleTest.bind(this));

    // Clean command
    this.program
      .command('clean')
      .description('Clean temporary files')
      .action(this.handleClean.bind(this));

    // Info command
    this.program
      .command('info')
      .description('Show information about the tool')
      .action(this.handleInfo.bind(this));

    // Analyze command - New image understanding feature
    this.program
      .command('analyze')
      .description('Analyze an image using Gemini image understanding')
      .argument('<image-path>', 'path to the image to analyze')
      .option('-p, --prompt <prompt>', 'analysis prompt (e.g., "Caption this image", "What objects do you see?")', 'Analyze this image and describe what you see')
      .option('-s, --style <style>', 'caption style (detailed, brief, artistic, technical)', 'detailed')
      .action(this.handleAnalyze.bind(this));

    // Object detection command
    this.program
      .command('detect')
      .description('Detect objects in an image using Gemini enhanced object detection')
      .argument('<image-path>', 'path to the image for object detection')
      .action(this.handleDetectObjects.bind(this));

    // Image-to-image generation command
    this.program
      .command('transform')
      .description('Transform an image with style transfer using Gemini')
      .argument('<image-path>', 'path to the reference image')
      .argument('<style-prompt>', 'style description for transformation')
      .option('-o, --output <path>', 'output path for the transformed image')
      .action(this.handleTransform.bind(this));

    // Style animation command
    this.program
      .command('style-animation')
      .description('Generate animated GIF from a reference image with style variations')
      .argument('<image-path>', 'path to the reference image')
      .argument('<animation-prompt>', 'animation description')
      .option('-f, --frames <number>', 'number of frames to generate', '5')
      .option('-w, --width <number>', 'GIF width in pixels', '512')
      .option('-h, --height <number>', 'GIF height in pixels', '512')
      .option('-d, --delay <number>', 'delay between frames in milliseconds', '500')
      .action(this.handleStyleAnimation.bind(this));

    // Text-to-image command
    this.program
      .command('text-to-image')
      .description('Generate high-quality images from text descriptions')
      .argument('<prompt>', 'text description for image generation')
      .option('-m, --model <model>', 'model to use (gemini-2.5-flash-image, imagen-4, imagen-4-ultra)', 'gemini-2.5-flash-image')
      .option('-a, --aspect-ratio <ratio>', 'aspect ratio (1:1, 16:9, 4:3, etc.)', '1:1')
      .option('-o, --output <path>', 'output path for the generated image')
      .action(this.handleTextToImage.bind(this));

    // Image editing command
    this.program
      .command('edit-image')
      .description('Edit an image using text prompts to add, remove, or modify elements')
      .argument('<image-path>', 'path to the image to edit')
      .argument('<edit-prompt>', 'text prompt for editing instructions')
      .option('-m, --model <model>', 'model to use', 'gemini-2.5-flash-image')
      .option('-a, --aspect-ratio <ratio>', 'aspect ratio', '1:1')
      .option('-o, --output <path>', 'output path for the edited image')
      .action(this.handleImageEditing.bind(this));

    // Multi-image composition command
    this.program
      .command('compose')
      .description('Compose a new scene using multiple input images')
      .argument('<composition-prompt>', 'prompt for composition instructions')
      .option('-i, --images <paths>', 'comma-separated image paths', '')
      .option('-m, --model <model>', 'model to use', 'gemini-2.5-flash-image')
      .option('-a, --aspect-ratio <ratio>', 'aspect ratio', '1:1')
      .option('-o, --output <path>', 'output path for the composed image')
      .action(this.handleMultiImageComposition.bind(this));

    // Style transfer command
    this.program
      .command('style-transfer')
      .description('Apply style from one image to another')
      .argument('<source-image>', 'path to the source image')
      .argument('<style-image>', 'path to the style reference image')
      .argument('<style-prompt>', 'description of the style transfer')
      .option('-m, --model <model>', 'model to use', 'gemini-2.5-flash-image')
      .option('-a, --aspect-ratio <ratio>', 'aspect ratio', '1:1')
      .option('-o, --output <path>', 'output path for the styled image')
      .action(this.handleStyleTransfer.bind(this));

    // Text rendering command
    this.program
      .command('render-text')
      .description('Generate images with high-fidelity text rendering')
      .argument('<text-prompt>', 'text to render in the image')
      .option('-m, --model <model>', 'model to use (imagen-4 recommended)', 'imagen-4')
      .option('-a, --aspect-ratio <ratio>', 'aspect ratio', '1:1')
      .option('-o, --output <path>', 'output path for the text image')
      .action(this.handleTextRendering.bind(this));

    // Iterative refinement command
    this.program
      .command('refine')
      .description('Progressively refine an image through iterative editing')
      .argument('<refinement-prompt>', 'prompt for refinement')
      .option('-p, --previous-image <path>', 'path to the previous image')
      .option('-m, --model <model>', 'model to use', 'gemini-2.5-flash-image')
      .option('-a, --aspect-ratio <ratio>', 'aspect ratio', '1:1')
      .option('-o, --output <path>', 'output path for the refined image')
      .action(this.handleIterativeRefinement.bind(this));

    // Imagen generation command
    this.program
      .command('imagen')
      .description('Generate images using Imagen model for specialized tasks')
      .argument('<prompt>', 'text prompt for image generation')
      .option('-v, --version <version>', 'Imagen version (4 or ultra)', '4')
      .option('-a, --aspect-ratio <ratio>', 'aspect ratio', '1:1')
      .option('-o, --output <path>', 'output path for the generated image')
      .action(this.handleImagenGeneration.bind(this));

    // List available options command
    this.program
      .command('list-options')
      .description('List available models, aspect ratios, and other options')
      .action(this.handleListOptions.bind(this));
  }

  async handleGenerate(prompt, options) {
    try {
      const isGif = options.gif || false;
      const aspectRatio = options.aspectRatio || '1:1';
      const model = options.model || 'gemini-2.5-flash-image';
      const width = parseInt(options.width) || 512;
      const height = parseInt(options.height) || 512;

      if (isGif) {
        // GIF Generation Mode
        const frameCount = parseInt(options.frames) || 5;
        const delay = parseInt(options.delay) || 500;
        const quality = parseInt(options.quality) || 80;
        const animationType = options.animation || 'general';
        const keepFrames = options.keepFrames || false;

        logger.header('nano Banana GIF Generation');
        logger.info(`Prompt: "${prompt}"`);
        logger.info(`Frames: ${frameCount}, Animation: ${animationType}`);
        logger.info(`Size: ${width}x${height}, Delay: ${delay}ms`);

        const result = await this.gifCommands.generateGif(prompt, {
          frameCount: frameCount,
          animationType: animationType,
          width: width,
          height: height,
          delay: delay,
          quality: quality,
          keepFrames: keepFrames
        });

        logger.success(`🎉 GIF generated successfully!`);
        logger.info(`📁 Location: ${result.gifPath}`);
      } else {
        // Single Image Generation Mode (Default)
        logger.header('nano Banana Image Generation');
        logger.info(`Prompt: "${prompt}"`);
        logger.info(`Aspect Ratio: ${aspectRatio}, Model: ${model}`);

        const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
        const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

        const result = await integration.textToImage(prompt, {
          aspectRatio: aspectRatio,
          model: model,
          outputPath: `output/images/generated_image_${Date.now()}.png`
        });

        logger.success(`🎉 Image generated successfully!`);
        logger.info(`📁 Location: ${result.imagePath}`);
        logger.info(`📊 Resolution: ${result.resolution}`);
        logger.info(`🎯 Tokens: ${result.tokens}`);
      }
      
    } catch (error) {
      logger.error('Generation failed:', error.message);
      process.exit(1);
    }
  }

  async handleGenerateMultiple(prompt, options) {
    try {
      // Validate and set default values
      const frameCount = parseInt(options.frames) || 5;
      const width = parseInt(options.width) || 512;
      const height = parseInt(options.height) || 512;
      const animationTypes = (options.animations || 'walking,flying,dancing').split(',').map(type => type.trim());

      logger.header('nano Banana Multiple GIF Generation');
      logger.info(`Prompt: "${prompt}"`);
      logger.info(`Animation Types: ${animationTypes.join(', ')}`);

      const results = await this.gifCommands.generateMultipleGifs(prompt, animationTypes, {
        frameCount: frameCount,
        width: width,
        height: height
      });

      logger.success(`🎉 Generated ${results.filter(r => r.success).length}/${results.length} GIFs successfully!`);
      
    } catch (error) {
      logger.error('Multiple generation failed:', error.message);
      process.exit(1);
    }
  }

  async handleTest(prompt) {
    try {
      logger.header('nano Banana Integration Test');
      
      // Import test function
      const { testNanoBananaIntegration } = await import('../../tests/test_gemini_integration.js');
      await testNanoBananaIntegration();
      
    } catch (error) {
      logger.error('Test failed:', error.message);
      process.exit(1);
    }
  }

  async handleClean() {
    try {
      logger.info('🧹 Cleaning all output directories...');
      
      const directoriesToClean = [
        'temp',
        'test_output',
        'demo_output',
        'output/frames',
        'output/gifs',
        'output/images'
      ];
      
      let cleanedCount = 0;
      
      for (const dir of directoriesToClean) {
        try {
          await FileUtils.cleanDirectory(dir);
          logger.info(`✅ Cleaned: ${dir}`);
          cleanedCount++;
        } catch (error) {
          // Directory might not exist, which is fine
          if (error.code !== 'ENOENT') {
            logger.warning(`⚠️ Could not clean ${dir}: ${error.message}`);
          }
        }
      }
      
      logger.success(`🧹 Cleanup completed! Cleaned ${cleanedCount} directories`);
      logger.info('📁 Cleaned directories: temp, test_output, demo_output, output/frames, output/gifs, output/images');
      
    } catch (error) {
      logger.error('❌ Clean failed:', error.message);
      process.exit(1);
    }
  }

  async handleAnalyze(imagePath, options) {
    try {
      const prompt = options.prompt || 'Analyze this image and describe what you see';
      const style = options.style || 'detailed';

      logger.header('Gemini Image Analysis');
      logger.info(`🖼️ Image: ${imagePath}`);
      logger.info(`📝 Prompt: ${prompt}`);
      logger.info(`🎨 Style: ${style}`);

      // Import the integration
      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.generateCaption(imagePath, style);
      
      logger.success('🎉 Image analysis completed!');
      logger.info('📄 Analysis Result:');
      logger.info(result);
      
    } catch (error) {
      logger.error('Analysis failed:', error.message);
      process.exit(1);
    }
  }

  async handleDetectObjects(imagePath) {
    try {
      logger.header('Gemini Object Detection');
      logger.info(`🖼️ Image: ${imagePath}`);

      // Import the integration
      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.detectObjects(imagePath);
      
      logger.success('🎉 Object detection completed!');
      logger.info('🔍 Detection Results:');
      logger.info(result);
      
    } catch (error) {
      logger.error('Object detection failed:', error.message);
      process.exit(1);
    }
  }

  async handleTransform(imagePath, stylePrompt, options) {
    try {
      const outputPath = options.output || null;

      logger.header('Gemini Image Transformation');
      logger.info(`🖼️ Reference Image: ${imagePath}`);
      logger.info(`🎨 Style Prompt: ${stylePrompt}`);
      if (outputPath) logger.info(`📁 Output Path: ${outputPath}`);

      // Import the integration
      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.imageToImageGeneration(imagePath, stylePrompt, outputPath);
      
      logger.success('🎉 Image transformation completed!');
      logger.info(`📁 Transformed image saved: ${result}`);
      
    } catch (error) {
      logger.error('Image transformation failed:', error.message);
      process.exit(1);
    }
  }

  async handleStyleAnimation(imagePath, animationPrompt, options) {
    try {
      const frameCount = parseInt(options.frames) || 5;
      const width = parseInt(options.width) || 512;
      const height = parseInt(options.height) || 512;
      const delay = parseInt(options.delay) || 500;

      logger.header('Gemini Style Animation');
      logger.info(`🖼️ Reference Image: ${imagePath}`);
      logger.info(`🎬 Animation Prompt: ${animationPrompt}`);
      logger.info(`📊 Frames: ${frameCount}, Size: ${width}x${height}, Delay: ${delay}ms`);

      // Import the integration
      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      // Generate style animation frames
      const framePaths = await integration.generateStyleAnimationFrames(imagePath, animationPrompt, frameCount, CONFIG.tempDir);

      // Assemble frames into GIF
      const result = await this.gifCommands.generateGifFromFrames(framePaths, {
        width: width,
        height: height,
        delay: delay,
        animationType: 'style-animation'
      });

      logger.success('🎉 Style animation completed!');
      logger.info(`📁 Animation GIF saved: ${result.gifPath}`);
      
    } catch (error) {
      logger.error('Style animation failed:', error.message);
      process.exit(1);
    }
  }

  async handleTextToImage(prompt, options) {
    try {
      const model = options.model || 'gemini-2.5-flash-image';
      const aspectRatio = options.aspectRatio || '1:1';
      const outputPath = options.output || null;

      logger.header('Text-to-Image Generation');
      logger.info(`📝 Prompt: ${prompt}`);
      logger.info(`🔧 Model: ${model}`);
      logger.info(`📐 Aspect Ratio: ${aspectRatio}`);

      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.textToImage(prompt, {
        model: model,
        aspectRatio: aspectRatio,
        outputPath: outputPath
      });

      logger.success('🎉 Text-to-image generation completed!');
      logger.info(`📁 Image saved: ${result.imagePath}`);
      logger.info(`📊 Resolution: ${result.resolution}`);
      logger.info(`🎯 Tokens: ${result.tokens}`);
      
    } catch (error) {
      logger.error('Text-to-image generation failed:', error.message);
      process.exit(1);
    }
  }

  async handleImageEditing(imagePath, editPrompt, options) {
    try {
      const model = options.model || 'gemini-2.5-flash-image';
      const aspectRatio = options.aspectRatio || '1:1';
      const outputPath = options.output || null;

      logger.header('Image Editing');
      logger.info(`🖼️ Image: ${imagePath}`);
      logger.info(`📝 Edit Prompt: ${editPrompt}`);
      logger.info(`🔧 Model: ${model}`);
      logger.info(`📐 Aspect Ratio: ${aspectRatio}`);

      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.imageEditing(imagePath, editPrompt, {
        model: model,
        aspectRatio: aspectRatio,
        outputPath: outputPath
      });

      logger.success('🎉 Image editing completed!');
      logger.info(`📁 Edited image saved: ${result.imagePath}`);
      
    } catch (error) {
      logger.error('Image editing failed:', error.message);
      process.exit(1);
    }
  }

  async handleMultiImageComposition(compositionPrompt, options) {
    try {
      const imagePaths = options.images ? options.images.split(',').map(path => path.trim()) : [];
      const model = options.model || 'gemini-2.5-flash-image';
      const aspectRatio = options.aspectRatio || '1:1';
      const outputPath = options.output || null;

      logger.header('Multi-Image Composition');
      logger.info(`📝 Composition Prompt: ${compositionPrompt}`);
      logger.info(`🖼️ Images: ${imagePaths.join(', ')}`);
      logger.info(`🔧 Model: ${model}`);
      logger.info(`📐 Aspect Ratio: ${aspectRatio}`);

      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.multiImageComposition(imagePaths, compositionPrompt, {
        model: model,
        aspectRatio: aspectRatio,
        outputPath: outputPath
      });

      logger.success('🎉 Multi-image composition completed!');
      logger.info(`📁 Composed image saved: ${result.imagePath}`);
      
    } catch (error) {
      logger.error('Multi-image composition failed:', error.message);
      process.exit(1);
    }
  }

  async handleStyleTransfer(sourceImage, styleImage, stylePrompt, options) {
    try {
      const model = options.model || 'gemini-2.5-flash-image';
      const aspectRatio = options.aspectRatio || '1:1';
      const outputPath = options.output || null;

      logger.header('Style Transfer');
      logger.info(`🖼️ Source Image: ${sourceImage}`);
      logger.info(`🎨 Style Image: ${styleImage}`);
      logger.info(`📝 Style Prompt: ${stylePrompt}`);
      logger.info(`🔧 Model: ${model}`);

      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.styleTransfer(sourceImage, styleImage, stylePrompt, {
        model: model,
        aspectRatio: aspectRatio,
        outputPath: outputPath
      });

      logger.success('🎉 Style transfer completed!');
      logger.info(`📁 Styled image saved: ${result.imagePath}`);
      
    } catch (error) {
      logger.error('Style transfer failed:', error.message);
      process.exit(1);
    }
  }

  async handleTextRendering(textPrompt, options) {
    try {
      const model = options.model || 'imagen-4';
      const aspectRatio = options.aspectRatio || '1:1';
      const outputPath = options.output || null;

      logger.header('High-Fidelity Text Rendering');
      logger.info(`📝 Text Prompt: ${textPrompt}`);
      logger.info(`🔧 Model: ${model}`);
      logger.info(`📐 Aspect Ratio: ${aspectRatio}`);

      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.textRendering(textPrompt, {
        model: model,
        aspectRatio: aspectRatio,
        outputPath: outputPath
      });

      logger.success('🎉 Text rendering completed!');
      logger.info(`📁 Text image saved: ${result.imagePath}`);
      
    } catch (error) {
      logger.error('Text rendering failed:', error.message);
      process.exit(1);
    }
  }

  async handleIterativeRefinement(refinementPrompt, options) {
    try {
      const previousImagePath = options.previousImage;
      const model = options.model || 'gemini-2.5-flash-image';
      const aspectRatio = options.aspectRatio || '1:1';
      const outputPath = options.output || null;

      logger.header('Iterative Refinement');
      logger.info(`📝 Refinement Prompt: ${refinementPrompt}`);
      logger.info(`🖼️ Previous Image: ${previousImagePath || 'None'}`);
      logger.info(`🔧 Model: ${model}`);

      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.iterativeRefinement(refinementPrompt, previousImagePath, {
        model: model,
        aspectRatio: aspectRatio,
        outputPath: outputPath
      });

      logger.success('🎉 Iterative refinement completed!');
      logger.info(`📁 Refined image saved: ${result.imagePath}`);
      
    } catch (error) {
      logger.error('Iterative refinement failed:', error.message);
      process.exit(1);
    }
  }

  async handleImagenGeneration(prompt, options) {
    try {
      const version = options.version || '4';
      const aspectRatio = options.aspectRatio || '1:1';
      const outputPath = options.output || null;

      logger.header('Imagen Generation');
      logger.info(`📝 Prompt: ${prompt}`);
      logger.info(`🔧 Imagen Version: ${version}`);
      logger.info(`📐 Aspect Ratio: ${aspectRatio}`);

      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      const result = await integration.generateWithImagen(prompt, {
        imagenVersion: version,
        aspectRatio: aspectRatio,
        outputPath: outputPath
      });

      logger.success('🎉 Imagen generation completed!');
      logger.info(`📁 Image saved: ${result.imagePath}`);
      
    } catch (error) {
      logger.error('Imagen generation failed:', error.message);
      process.exit(1);
    }
  }

  async handleListOptions() {
    try {
      logger.header('Available Options');
      
      const { NanoBananaIntegration } = await import('../integrations/gemini_integration.js');
      const integration = new NanoBananaIntegration(process.env.GOOGLE_API_KEY);

      logger.info('🔧 Available Models:');
      const models = integration.getAvailableModels();
      for (const [model, description] of Object.entries(models)) {
        logger.info(`  • ${model}: ${description}`);
      }

      logger.separator();
      logger.info('📐 Available Aspect Ratios:');
      const aspectRatios = integration.getAvailableAspectRatios();
      for (const [ratio, config] of Object.entries(aspectRatios)) {
        logger.info(`  • ${ratio}: ${config.resolution} (${config.tokens} tokens)`);
      }

      logger.separator();
      logger.info('🎯 Model Recommendations:');
      logger.info('  • photorealistic → imagen-4');
      logger.info('  • artistic → gemini-2.5-flash-image');
      logger.info('  • text rendering → imagen-4');
      logger.info('  • editing → gemini-2.5-flash-image');
      logger.info('  • composition → gemini-2.5-flash-image');
      logger.info('  • ultra quality → imagen-4-ultra');
      
    } catch (error) {
      logger.error('Failed to list options:', error.message);
      process.exit(1);
    }
  }

  handleInfo() {
    logger.header('nano Banana GIF Generator - Enhanced with Comprehensive Gemini Features');
    logger.info('What is nano Banana?');
    logger.info('• Google\'s premier image generation and editing AI from DeepMind');
    logger.info('• Available at: https://gemini.google/overview/image-generation/');
    logger.info('• Excels at photo editing, combining images, and style transfers');
    logger.info('• Can turn a single photo into countless new creations');
    logger.info('• Specializes in precise, localized image changes');
    logger.separator();
    logger.info('This CLI Tool Features:');
    logger.info('• 🍌 Google Gemini API integration with comprehensive image generation');
    logger.info('• 🔍 Image understanding and analysis capabilities');
    logger.info('• 🎯 Enhanced object detection and segmentation');
    logger.info('• 🎨 Image-to-image style transfer');
    logger.info('• 🎬 Style-based animation generation');
    logger.info('• 🎨 Sequential motion animation (like nano Banana\'s consistency)');
    logger.info('• 🌅 Progressive background sequences');
    logger.info('• 🎞️ Multiple animation types (walking, flying, dancing, etc.)');
    logger.info('• 📱 Fallback to OpenAI DALL-E and Stability AI');
    logger.info('• 🎬 Actual GIF file generation');
    logger.separator();
    logger.info('NEW: Comprehensive Gemini Image Generation Features:');
    logger.info('• 📝 Text-to-Image: Generate high-quality images from text descriptions');
    logger.info('• ✏️ Image Editing: Add, remove, or modify elements with text prompts');
    logger.info('• 🖼️ Multi-Image Composition: Combine multiple images into new scenes');
    logger.info('• 🔄 Iterative Refinement: Progressively refine images over multiple turns');
    logger.info('• 📝 High-Fidelity Text Rendering: Generate images with legible text');
    logger.info('• 🎨 Style Transfer: Apply styles from one image to another');
    logger.info('• 🔧 Imagen Integration: Use Imagen models for specialized tasks');
    logger.info('• 📐 Aspect Ratio Control: Support for all Gemini aspect ratios');
    logger.info('• 🎯 Model Selection: Choose between Gemini and Imagen models');
    logger.separator();
    logger.info('Setup Instructions:');
    logger.info('1. Add GOOGLE_API_KEY to .env file (priority for nano Banana)');
    logger.info('2. Optional: Add OPENAI_API_KEY for current generation');
    logger.info('3. Optional: Add STABILITY_API_KEY as additional backup');
    logger.info('4. Run: npm test to test Gemini');
    logger.separator();
    logger.info('Available Commands:');
    logger.info('• generate "<prompt>" - Generate single image (default)');
    logger.info('• generate "<prompt>" --gif - Generate animated GIF');
    logger.info('• text-to-image "<prompt>" - Generate image from text');
    logger.info('• edit-image "<image>" "<prompt>" - Edit image with text');
    logger.info('• compose "<prompt>" - Compose scene from multiple images');
    logger.info('• style-transfer "<source>" "<style>" "<prompt>" - Transfer style');
    logger.info('• render-text "<text>" - Generate image with text');
    logger.info('• refine "<prompt>" - Iteratively refine image');
    logger.info('• imagen "<prompt>" - Generate with Imagen model');
    logger.info('• analyze "<image-path>" - Analyze image with Gemini');
    logger.info('• detect "<image-path>" - Detect objects in image');
    logger.info('• transform "<image-path>" "<style>" - Transform image with style');
    logger.info('• style-animation "<image-path>" "<prompt>" - Create style animation');
    logger.info('• list-options - Show available models and options');
    logger.info('• test "<prompt>" - Test Gemini API connection');
    logger.info('• clean - Clean temporary files');
    logger.info('• info - Show this information');
    logger.separator();
    logger.info('Image Understanding Features:');
    logger.info('• 📸 Supports PNG, JPEG, WEBP, HEIC, HEIF formats');
    logger.info('• 🔍 Enhanced object detection (Gemini 2.0+)');
    logger.info('• ✂️ Advanced segmentation (Gemini 2.5+)');
    logger.info('• 📝 Multiple caption styles (detailed, brief, artistic, technical)');
    logger.info('• 🎨 Style transfer and image transformation');
    logger.separator();
    logger.info('Output Structure:');
    logger.info(`• Single images: output/images/`);
    logger.info(`• Animation frames: output/frames/`);
    logger.info(`• Final GIFs: output/gifs/`);
    logger.separator();
    logger.info('Important Links:');
    logger.info('• nano Banana: https://gemini.google/overview/image-generation/');
    logger.info('• Gemini Image Generation: https://ai.google.dev/gemini-api/docs/image-generation');
    logger.info('• Gemini Image Understanding: https://ai.google.dev/gemini-api/docs/image-understanding');
    logger.info('• Google API Keys: https://makersuite.google.com/app/apikey');
    logger.info('• OpenAI API: https://platform.openai.com/api-keys');
    logger.info('• Stability AI: https://platform.stability.ai/account/keys');
    logger.separator();
    logger.info('This tool now supports ALL Gemini image generation capabilities!');
  }

  parse() {
    this.program.parse();
  }
}

export default CLICommands;
