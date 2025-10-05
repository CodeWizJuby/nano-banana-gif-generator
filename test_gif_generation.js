#!/usr/bin/env node

/**
 * Test GIF Generation with nano Banana
 * Demonstrates the complete GIF generation workflow
 */

import * as dotenv from 'dotenv';
import { GifCommands } from './src/cli/gifCommands.js';

// Load environment variables
dotenv.config();

async function testGifGeneration() {
    console.log('🍌 Testing nano Banana GIF Generation');
    console.log('=====================================');
    
    try {
        const gifCommands = new GifCommands();
        
        // Test 1: Simple GIF generation
        console.log('\n🎬 Test 1: Simple GIF Generation');
        console.log('--------------------------------');
        
        const result1 = await gifCommands.generateGif(
            "a cute cat playing with a ball",
            {
                frameCount: 3,
                animationType: 'general',
                width: 256,
                height: 256,
                delay: 500,
                keepFrames: true
            }
        );
        
        console.log('✅ Test 1 completed successfully!');
        console.log(`📁 GIF: ${result1.gifPath}`);
        console.log(`📊 Frames: ${result1.frameCount}`);
        
        // Test 2: Multiple animation types
        console.log('\n🎬 Test 2: Multiple Animation Types');
        console.log('------------------------------------');
        
        const result2 = await gifCommands.generateMultipleGifs(
            "a robot dancing in a futuristic city",
            ['walking', 'dancing', 'flying'],
            {
                frameCount: 4,
                width: 400,
                height: 400
            }
        );
        
        console.log('✅ Test 2 completed successfully!');
        console.log(`📊 Generated ${result2.filter(r => r.success).length}/${result2.length} GIFs`);
        
        // Test 3: Show available animation types
        console.log('\n🎬 Test 3: Available Animation Types');
        console.log('-------------------------------------');
        gifCommands.showAnimationTypes();
        
        // Test 4: Show recommended settings
        console.log('\n⚙️ Test 4: Recommended Settings');
        console.log('-------------------------------');
        gifCommands.showRecommendedSettings();
        
        console.log('\n🎉 All tests completed successfully!');
        console.log('🚀 Your nano Banana GIF generator is ready to use!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testGifGeneration();
