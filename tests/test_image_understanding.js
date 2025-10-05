/**
 * Test Image Understanding Features
 * Tests the new Gemini image understanding capabilities
 */

import { NanoBananaIntegration } from '../src/integrations/gemini_integration.js';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Load environment variables
dotenv.config();

async function testImageUnderstanding() {
    console.log('🧪 Testing Gemini Image Understanding Features...\n');

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('❌ GOOGLE_API_KEY not found in environment variables');
        console.log('Please set GOOGLE_API_KEY in your .env file');
        process.exit(1);
    }

    const integration = new NanoBananaIntegration(apiKey);

    // Test image path - you can replace this with any image you want to test
    const testImagePath = path.resolve('generated_image.png');
    
    if (!fs.existsSync(testImagePath)) {
        console.log('📝 Creating a test image first...');
        try {
            // Generate a simple test image using text-to-image
            const generatedImage = await integration.generateImage('a cute cat sitting on a wooden table');
            console.log(`✅ Test image created: ${generatedImage}`);
        } catch (error) {
            console.error('❌ Failed to create test image:', error.message);
            console.log('Please provide a test image at generated_image.png or any other image file');
            return;
        }
    }

    try {
        // Test 1: Image Analysis
        console.log('\n🔍 Test 1: Image Analysis');
        console.log('=' .repeat(50));
        const analysis = await integration.analyzeImage(testImagePath, 'Describe this image in detail');
        console.log('Analysis Result:', analysis);

        // Test 2: Object Detection
        console.log('\n🎯 Test 2: Object Detection');
        console.log('=' .repeat(50));
        const detection = await integration.detectObjects(testImagePath);
        console.log('Detection Result:', detection);

        // Test 3: Caption Generation
        console.log('\n📝 Test 3: Caption Generation');
        console.log('=' .repeat(50));
        const detailedCaption = await integration.generateCaption(testImagePath, 'detailed');
        console.log('Detailed Caption:', detailedCaption);

        const artisticCaption = await integration.generateCaption(testImagePath, 'artistic');
        console.log('Artistic Caption:', artisticCaption);

        // Test 4: Question Answering
        console.log('\n❓ Test 4: Question Answering');
        console.log('=' .repeat(50));
        const question = 'What colors are prominent in this image?';
        const answer = await integration.answerQuestion(testImagePath, question);
        console.log(`Q: ${question}`);
        console.log(`A: ${answer}`);

        // Test 5: Image-to-Image Style Transfer
        console.log('\n🎨 Test 5: Image-to-Image Style Transfer');
        console.log('=' .repeat(50));
        const stylePrompt = 'Transform this image into a watercolor painting style';
        const styledImage = await integration.imageToImageGeneration(testImagePath, stylePrompt);
        console.log('Styled image saved:', styledImage);

        console.log('\n✅ All image understanding tests completed successfully!');
        console.log('\n📋 Summary of tested features:');
        console.log('• ✅ Image analysis and description');
        console.log('• ✅ Object detection');
        console.log('• ✅ Caption generation (multiple styles)');
        console.log('• ✅ Visual question answering');
        console.log('• ✅ Image-to-image style transfer');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

async function testStyleAnimation() {
    console.log('\n🎬 Testing Style Animation Feature...\n');

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('❌ GOOGLE_API_KEY not found in environment variables');
        return;
    }

    const integration = new NanoBananaIntegration(apiKey);
    const testImagePath = path.resolve('generated_image.png');

    if (!fs.existsSync(testImagePath)) {
        console.log('❌ Test image not found. Please run the basic test first.');
        return;
    }

    try {
        console.log('🎨 Generating style animation frames...');
        const framePaths = await integration.generateStyleAnimationFrames(
            testImagePath, 
            'transform this image with different artistic styles', 
            3, 
            './temp_style_test'
        );

        console.log(`✅ Generated ${framePaths.length} style animation frames:`);
        framePaths.forEach((framePath, index) => {
            console.log(`  ${index + 1}. ${framePath}`);
        });

        console.log('\n✅ Style animation test completed successfully!');

    } catch (error) {
        console.error('❌ Style animation test failed:', error.message);
    }
}

// Run tests
async function runTests() {
    try {
        await testImageUnderstanding();
        await testStyleAnimation();
        
        console.log('\n🎉 All tests completed!');
        console.log('\n📚 Next steps:');
        console.log('• Try the new CLI commands: analyze, detect, transform, style-animation');
        console.log('• Check the generated images in the current directory');
        console.log('• Run: npm run info to see all available commands');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { testImageUnderstanding, testStyleAnimation };
