#!/usr/bin/env node

/**
 * Test GIF Assembly from existing frames
 */

import { SimpleGifAssembler } from './src/core/simpleGifAssembler.js';
import * as path from 'node:path';

async function testGifAssembly() {
    console.log('🎬 Testing GIF Assembly');
    console.log('======================');
    
    try {
        const assembler = new SimpleGifAssembler();
        
        // Get existing frame files
        const framesDir = './output/frames';
        const frameFiles = [
            'frame_00_1759617329852.png',
            'frame_01_1759617329852.png', 
            'frame_02_1759617329852.png',
            'frame_03_1759617329852.png',
            'frame_04_1759617329852.png'
        ];
        
        const framePaths = frameFiles.map(file => path.join(framesDir, file));
        const outputPath = './output/gifs/test_assembly.gif';
        
        console.log(`📁 Found ${framePaths.length} frames`);
        console.log(`🎯 Output: ${outputPath}`);
        
        // Create GIF
        const result = await assembler.createGif(framePaths, outputPath, {
            width: 512,
            height: 512,
            delay: 500,
            quality: 80
        });
        
        console.log('✅ GIF assembly test completed successfully!');
        console.log(`📁 GIF created: ${result}`);
        
    } catch (error) {
        console.error('❌ GIF assembly test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testGifAssembly();
