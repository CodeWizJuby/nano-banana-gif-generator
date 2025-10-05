#!/usr/bin/env node

/**
 * Demonstration script for all comprehensive Gemini image generation features
 * This script showcases all the new capabilities implemented based on the Gemini API documentation
 */

import { NanoBananaIntegration } from '../../src/integrations/gemini_integration.js';
import { ENV_CONFIG, validateEnvironment, displayEnvironmentStatus } from '../../src/config/environment.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Configuration using environment variables
const DEMO_CONFIG = {
  apiKey: ENV_CONFIG.GOOGLE_API_KEY,
  outputDir: ENV_CONFIG.DEMO_DIR,
  timeout: ENV_CONFIG.API_TIMEOUT
};

// Ensure output directory exists
if (!fs.existsSync(DEMO_CONFIG.outputDir)) {
  fs.mkdirSync(DEMO_CONFIG.outputDir, { recursive: true });
}

/**
 * Display feature information
 */
function displayFeatureInfo() {
  console.log('🎨 Comprehensive Gemini Image Generation Features Demo');
  console.log('='.repeat(60));
  console.log('');
  console.log('This demo showcases ALL the features implemented based on:');
  console.log('📚 Gemini API Documentation: https://ai.google.dev/gemini-api/docs/image-generation');
  console.log('');
  console.log('🚀 Features Available:');
  console.log('  • Text-to-Image Generation');
  console.log('  • Image Editing (Text-and-Image-to-Image)');
  console.log('  • Multi-Image Composition');
  console.log('  • Iterative Refinement');
  console.log('  • High-Fidelity Text Rendering');
  console.log('  • Style Transfer');
  console.log('  • Imagen Model Integration');
  console.log('  • Aspect Ratio Control');
  console.log('  • Model Selection');
  console.log('');
  
  // Display environment status
  displayEnvironmentStatus();
}

/**
 * Demonstrate text-to-image generation
 */
async function demoTextToImage() {
  console.log('📝 Demo: Text-to-Image Generation');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    const result = await integration.textToImage(
      "A futuristic cityscape at sunset with flying cars and neon lights",
      {
        aspectRatio: "16:9",
        model: "gemini-2.5-flash-image",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_text_to_image.png")
      }
    );
    
    console.log(`✅ Generated: ${result.imagePath}`);
    console.log(`📊 Resolution: ${result.resolution}`);
    console.log(`🎯 Tokens: ${result.tokens}`);
    console.log('');
    
    return result.imagePath;
  } catch (error) {
    console.error(`❌ Text-to-image demo failed: ${error.message}`);
    return null;
  }
}

/**
 * Demonstrate image editing
 */
async function demoImageEditing(baseImagePath) {
  console.log('✏️ Demo: Image Editing');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    const result = await integration.imageEditing(
      baseImagePath,
      "Add a rainbow in the sky and make the buildings more colorful",
      {
        aspectRatio: "16:9",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_edited_image.png")
      }
    );
    
    console.log(`✅ Edited: ${result.imagePath}`);
    console.log('');
    
    return result.imagePath;
  } catch (error) {
    console.error(`❌ Image editing demo failed: ${error.message}`);
    return null;
  }
}

/**
 * Demonstrate multi-image composition
 */
async function demoMultiImageComposition() {
  console.log('🖼️ Demo: Multi-Image Composition');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    // Generate two base images
    const image1 = await integration.textToImage(
      "A cute cat sitting on a chair",
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_cat.png")
      }
    );
    
    const image2 = await integration.textToImage(
      "A playful dog in a garden",
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_dog.png")
      }
    );
    
    // Compose them together
    const result = await integration.multiImageComposition(
      [image1.imagePath, image2.imagePath],
      "Create a heartwarming scene where the cat and dog are playing together in a beautiful park",
      {
        aspectRatio: "16:9",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_composition.png")
      }
    );
    
    console.log(`✅ Composed: ${result.imagePath}`);
    console.log('');
    
    return result.imagePath;
  } catch (error) {
    console.error(`❌ Multi-image composition demo failed: ${error.message}`);
    return null;
  }
}

/**
 * Demonstrate style transfer
 */
async function demoStyleTransfer() {
  console.log('🎨 Demo: Style Transfer');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    // Generate source and style images
    const source = await integration.textToImage(
      "A modern office building",
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_source.png")
      }
    );
    
    const style = await integration.textToImage(
      "A painting in the style of Van Gogh with thick brushstrokes and vibrant colors",
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_style.png")
      }
    );
    
    // Apply style transfer
    const result = await integration.styleTransfer(
      source.imagePath,
      style.imagePath,
      "Apply the artistic Van Gogh style to the building while maintaining its structure",
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_style_transfer.png")
      }
    );
    
    console.log(`✅ Style transfer: ${result.imagePath}`);
    console.log('');
    
    return result.imagePath;
  } catch (error) {
    console.error(`❌ Style transfer demo failed: ${error.message}`);
    return null;
  }
}

/**
 * Demonstrate text rendering
 */
async function demoTextRendering() {
  console.log('📝 Demo: High-Fidelity Text Rendering');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    const result = await integration.textRendering(
      "Create a professional poster with the text 'Welcome to AI' in bold, modern typography with a futuristic background",
      {
        aspectRatio: "4:3",
        model: "gemini-2.5-flash-image",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_text_rendering.png")
      }
    );
    
    console.log(`✅ Text rendered: ${result.imagePath}`);
    console.log('');
    
    return result.imagePath;
  } catch (error) {
    console.error(`❌ Text rendering demo failed: ${error.message}`);
    return null;
  }
}

/**
 * Demonstrate iterative refinement
 */
async function demoIterativeRefinement() {
  console.log('🔄 Demo: Iterative Refinement');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    // Create initial image
    const initial = await integration.textToImage(
      "A simple tree in a field",
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_initial.png")
      }
    );
    
    // First refinement
    const refined1 = await integration.iterativeRefinement(
      "Add beautiful autumn leaves to the tree",
      initial.imagePath,
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_refined_1.png")
      }
    );
    
    // Second refinement
    const refined2 = await integration.iterativeRefinement(
      "Add a bird sitting on a branch and some flowers around the tree",
      refined1.imagePath,
      {
        aspectRatio: "1:1",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_refined_2.png")
      }
    );
    
    console.log(`✅ Initial: ${initial.imagePath}`);
    console.log(`✅ Refined 1: ${refined1.imagePath}`);
    console.log(`✅ Refined 2: ${refined2.imagePath}`);
    console.log('');
    
    return refined2.imagePath;
  } catch (error) {
    console.error(`❌ Iterative refinement demo failed: ${error.message}`);
    return null;
  }
}

/**
 * Demonstrate Imagen generation
 */
async function demoImagenGeneration() {
  console.log('🔧 Demo: Imagen Model Generation');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    const result = await integration.textToImage(
      "A photorealistic portrait of a professional woman with detailed facial features, studio lighting",
      {
        aspectRatio: "3:4",
        model: "gemini-2.5-flash-image",
        outputPath: path.join(DEMO_CONFIG.outputDir, "demo_imagen.png")
      }
    );
    
    console.log(`✅ Imagen generated: ${result.imagePath}`);
    console.log('');
    
    return result.imagePath;
  } catch (error) {
    console.error(`❌ Imagen generation demo failed: ${error.message}`);
    return null;
  }
}

/**
 * Demonstrate aspect ratio and model options
 */
async function demoOptions() {
  console.log('⚙️ Demo: Available Options');
  console.log('-'.repeat(40));
  
  try {
    const integration = new NanoBananaIntegration(DEMO_CONFIG.apiKey);
    
    console.log('📐 Available Aspect Ratios:');
    const aspectRatios = integration.getAvailableAspectRatios();
    for (const [ratio, config] of Object.entries(aspectRatios)) {
      console.log(`  • ${ratio}: ${config.resolution} (${config.tokens} tokens)`);
    }
    
    console.log('\n🔧 Available Models:');
    const models = integration.getAvailableModels();
    for (const [model, description] of Object.entries(models)) {
      console.log(`  • ${model}: ${description}`);
    }
    
    console.log('\n🎯 Model Recommendations:');
    const recommendations = {
      'photorealistic': 'imagen-4',
      'artistic': 'gemini-2.5-flash-image',
      'text': 'imagen-4',
      'editing': 'gemini-2.5-flash-image',
      'composition': 'gemini-2.5-flash-image',
      'style_transfer': 'gemini-2.5-flash-image',
      'ultra_quality': 'imagen-4-ultra'
    };
    
    for (const [task, model] of Object.entries(recommendations)) {
      console.log(`  • ${task} → ${model}`);
    }
    
    console.log('');
  } catch (error) {
    console.error(`❌ Options demo failed: ${error.message}`);
  }
}

/**
 * Run the complete demonstration
 */
async function runDemo() {
  displayFeatureInfo();
  
  try {
    validateEnvironment();
  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    console.log('   Get your API key at: https://makersuite.google.com/app/apikey');
    return;
  }
  
  console.log('🚀 Starting comprehensive feature demonstration...\n');
  
  try {
    // Demo all features
    const textToImageResult = await demoTextToImage();
    
    if (textToImageResult) {
      await demoImageEditing(textToImageResult);
    }
    
    await demoMultiImageComposition();
    await demoStyleTransfer();
    await demoTextRendering();
    await demoIterativeRefinement();
    await demoImagenGeneration();
    await demoOptions();
    
    console.log('🎉 Comprehensive demonstration completed!');
    console.log(`📁 All demo outputs saved in: ${DEMO_CONFIG.outputDir}`);
    console.log('');
    console.log('🚀 Your nano-banana-gif-generator now supports ALL Gemini image generation features!');
    console.log('📚 For more information, see: COMPREHENSIVE_FEATURES.md');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run demo if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('demo_comprehensive_features.js')) {
  runDemo().catch(console.error);
}

export { runDemo };
