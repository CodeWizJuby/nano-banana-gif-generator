/**
 * Comprehensive tests for all Gemini image generation features
 * Tests all the new capabilities implemented based on the Gemini API documentation
 */

import { NanoBananaIntegration } from '../src/integrations/gemini_integration.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Test configuration
const TEST_CONFIG = {
  apiKey: process.env.GOOGLE_API_KEY,
  testDir: './test_output',
  timeout: 30000
};

// Ensure test directory exists
if (!fs.existsSync(TEST_CONFIG.testDir)) {
  fs.mkdirSync(TEST_CONFIG.testDir, { recursive: true });
}

/**
 * Test text-to-image generation
 */
async function testTextToImage() {
  console.log('🧪 Testing Text-to-Image Generation...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    const result = await integration.textToImage(
      "A beautiful sunset over a mountain landscape with a lake in the foreground",
      {
        aspectRatio: "16:9",
        model: "gemini-2.5-flash-image",
        outputPath: path.join(TEST_CONFIG.testDir, "text_to_image_test.png")
      }
    );
    
    console.log('✅ Text-to-image test passed');
    console.log(`📁 Image saved: ${result.imagePath}`);
    console.log(`📊 Resolution: ${result.resolution}`);
    console.log(`🎯 Tokens: ${result.tokens}`);
    
    return true;
  } catch (error) {
    console.error('❌ Text-to-image test failed:', error.message);
    return false;
  }
}

/**
 * Test image editing capabilities
 */
async function testImageEditing() {
  console.log('🧪 Testing Image Editing...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    // First generate a base image
    const baseResult = await integration.textToImage(
      "A simple house in a field",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "base_house.png")
      }
    );
    
    // Then edit it
    const editResult = await integration.imageEditing(
      baseResult.imagePath,
      "Add a rainbow in the sky and make the house more colorful",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "edited_house.png")
      }
    );
    
    console.log('✅ Image editing test passed');
    console.log(`📁 Edited image saved: ${editResult.imagePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Image editing test failed:', error.message);
    return false;
  }
}

/**
 * Test multi-image composition
 */
async function testMultiImageComposition() {
  console.log('🧪 Testing Multi-Image Composition...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    // Generate two base images
    const image1Result = await integration.textToImage(
      "A cat sitting on a chair",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "cat.png")
      }
    );
    
    const image2Result = await integration.textToImage(
      "A dog in a garden",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "dog.png")
      }
    );
    
    // Compose them together
    const compositionResult = await integration.multiImageComposition(
      [image1Result.imagePath, image2Result.imagePath],
      "Create a scene where the cat and dog are playing together in a park",
      {
        aspectRatio: "16:9",
        outputPath: path.join(TEST_CONFIG.testDir, "composition.png")
      }
    );
    
    console.log('✅ Multi-image composition test passed');
    console.log(`📁 Composed image saved: ${compositionResult.imagePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Multi-image composition test failed:', error.message);
    return false;
  }
}

/**
 * Test style transfer
 */
async function testStyleTransfer() {
  console.log('🧪 Testing Style Transfer...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    // Generate source and style images
    const sourceResult = await integration.textToImage(
      "A modern building",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "source_building.png")
      }
    );
    
    const styleResult = await integration.textToImage(
      "A painting in the style of Van Gogh with thick brushstrokes",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "style_painting.png")
      }
    );
    
    // Apply style transfer
    const transferResult = await integration.styleTransfer(
      sourceResult.imagePath,
      styleResult.imagePath,
      "Apply the artistic style to the building",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "style_transfer.png")
      }
    );
    
    console.log('✅ Style transfer test passed');
    console.log(`📁 Style transfer image saved: ${transferResult.imagePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Style transfer test failed:', error.message);
    return false;
  }
}

/**
 * Test high-fidelity text rendering
 */
async function testTextRendering() {
  console.log('🧪 Testing High-Fidelity Text Rendering...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    const result = await integration.textRendering(
      "Create a poster with the text 'Welcome to AI' in bold, colorful letters",
      {
        aspectRatio: "4:3",
        model: "imagen-4",
        outputPath: path.join(TEST_CONFIG.testDir, "text_rendering.png")
      }
    );
    
    console.log('✅ Text rendering test passed');
    console.log(`📁 Text image saved: ${result.imagePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Text rendering test failed:', error.message);
    return false;
  }
}

/**
 * Test iterative refinement
 */
async function testIterativeRefinement() {
  console.log('🧪 Testing Iterative Refinement...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    // Create initial image
    const initialResult = await integration.textToImage(
      "A simple tree",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "initial_tree.png")
      }
    );
    
    // First refinement
    const refinement1Result = await integration.iterativeRefinement(
      "Add leaves to the tree",
      initialResult.imagePath,
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "refined_tree_1.png")
      }
    );
    
    // Second refinement
    const refinement2Result = await integration.iterativeRefinement(
      "Add a bird sitting on a branch",
      refinement1Result.imagePath,
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "refined_tree_2.png")
      }
    );
    
    console.log('✅ Iterative refinement test passed');
    console.log(`📁 Initial image: ${initialResult.imagePath}`);
    console.log(`📁 First refinement: ${refinement1Result.imagePath}`);
    console.log(`📁 Second refinement: ${refinement2Result.imagePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Iterative refinement test failed:', error.message);
    return false;
  }
}

/**
 * Test Imagen model generation
 */
async function testImagenGeneration() {
  console.log('🧪 Testing Imagen Generation...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    const result = await integration.generateWithImagen(
      "A photorealistic portrait of a person with detailed facial features",
      {
        imagenVersion: "4",
        aspectRatio: "3:4",
        outputPath: path.join(TEST_CONFIG.testDir, "imagen_portrait.png")
      }
    );
    
    console.log('✅ Imagen generation test passed');
    console.log(`📁 Imagen image saved: ${result.imagePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Imagen generation test failed:', error.message);
    return false;
  }
}

/**
 * Test aspect ratio validation
 */
async function testAspectRatioValidation() {
  console.log('🧪 Testing Aspect Ratio Validation...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    // Test valid aspect ratios
    const validRatios = ['1:1', '16:9', '4:3', '3:2', '9:16'];
    for (const ratio of validRatios) {
      const isValid = integration.isValidAspectRatio(ratio);
      if (!isValid) {
        throw new Error(`Aspect ratio ${ratio} should be valid`);
      }
    }
    
    // Test invalid aspect ratio
    const isInvalid = integration.isValidAspectRatio('invalid:ratio');
    if (isInvalid) {
      throw new Error('Invalid aspect ratio should return false');
    }
    
    console.log('✅ Aspect ratio validation test passed');
    return true;
  } catch (error) {
    console.error('❌ Aspect ratio validation test failed:', error.message);
    return false;
  }
}

/**
 * Test model recommendations
 */
async function testModelRecommendations() {
  console.log('🧪 Testing Model Recommendations...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    const recommendations = {
      'photorealistic': 'imagen-4',
      'artistic': 'gemini-2.5-flash-image',
      'text': 'imagen-4',
      'editing': 'gemini-2.5-flash-image',
      'composition': 'gemini-2.5-flash-image',
      'style_transfer': 'gemini-2.5-flash-image',
      'ultra_quality': 'imagen-4-ultra'
    };
    
    for (const [taskType, expectedModel] of Object.entries(recommendations)) {
      const recommendedModel = integration.getRecommendedModel(taskType);
      if (recommendedModel !== expectedModel) {
        throw new Error(`Expected ${expectedModel} for ${taskType}, got ${recommendedModel}`);
      }
    }
    
    console.log('✅ Model recommendations test passed');
    return true;
  } catch (error) {
    console.error('❌ Model recommendations test failed:', error.message);
    return false;
  }
}

/**
 * Test iterative session creation
 */
async function testIterativeSession() {
  console.log('🧪 Testing Iterative Session...');
  
  try {
    const integration = new NanoBananaIntegration(TEST_CONFIG.apiKey);
    
    const session = integration.createIterativeSession(
      "A simple flower",
      {
        aspectRatio: "1:1",
        outputPath: path.join(TEST_CONFIG.testDir, "session_flower.png")
      }
    );
    
    // Test initial generation
    const initialResult = await session.reset();
    console.log(`📁 Initial image: ${initialResult.imagePath}`);
    
    // Test refinement
    const refinementResult = await session.refine("Add more petals and make it colorful");
    console.log(`📁 Refined image: ${refinementResult.imagePath}`);
    
    console.log('✅ Iterative session test passed');
    return true;
  } catch (error) {
    console.error('❌ Iterative session test failed:', error.message);
    return false;
  }
}

/**
 * Run all comprehensive tests
 */
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Gemini Image Generation Tests...\n');
  
  if (!TEST_CONFIG.apiKey) {
    console.error('❌ GOOGLE_API_KEY not found. Please set it in your environment.');
    return;
  }
  
  const tests = [
    { name: 'Text-to-Image Generation', fn: testTextToImage },
    { name: 'Image Editing', fn: testImageEditing },
    { name: 'Multi-Image Composition', fn: testMultiImageComposition },
    { name: 'Style Transfer', fn: testStyleTransfer },
    { name: 'Text Rendering', fn: testTextRendering },
    { name: 'Iterative Refinement', fn: testIterativeRefinement },
    { name: 'Imagen Generation', fn: testImagenGeneration },
    { name: 'Aspect Ratio Validation', fn: testAspectRatioValidation },
    { name: 'Model Recommendations', fn: testModelRecommendations },
    { name: 'Iterative Session', fn: testIterativeSession }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🧪 Running: ${test.name}`);
    console.log(`${'='.repeat(50)}`);
    
    const startTime = Date.now();
    const success = await test.fn();
    const duration = Date.now() - startTime;
    
    results.push({
      name: test.name,
      success,
      duration: `${duration}ms`
    });
    
    if (success) {
      console.log(`✅ ${test.name} completed in ${duration}ms`);
    } else {
      console.log(`❌ ${test.name} failed after ${duration}ms`);
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 TEST SUMMARY');
  console.log(`${'='.repeat(50)}`);
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name} (${result.duration})`);
  });
  
  if (passed === total) {
    console.log('\n🎉 All comprehensive tests passed!');
    console.log('🚀 Your nano-banana-gif-generator now supports ALL Gemini image generation features!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the error messages above.');
  }
  
  console.log(`\n📁 Test outputs saved in: ${TEST_CONFIG.testDir}`);
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests().catch(console.error);
}

export {
  testTextToImage,
  testImageEditing,
  testMultiImageComposition,
  testStyleTransfer,
  testTextRendering,
  testIterativeRefinement,
  testImagenGeneration,
  testAspectRatioValidation,
  testModelRecommendations,
  testIterativeSession,
  runComprehensiveTests
};
