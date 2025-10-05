#!/usr/bin/env node

/**
 * Test Canvas-based GIF Assembly
 */

import { CanvasGifAssembler } from './src/core/canvasGifAssembler.js';
import * as path from 'node:path';

async function testCanvasGif() {
    console.log('🎬 Testing Canvas-based GIF Assembly');
    console.log('=====================================');
    
    try {
        const assembler = new CanvasGifAssembler();
        
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
        const outputPath = './output/gifs/canvas_test.gif';
        
        console.log(`📁 Found ${framePaths.length} frames`);
        console.log(`🎯 Output: ${outputPath}`);
        
        // Create GIF with canvas-based assembler
        const result = await assembler.createGif(framePaths, outputPath, {
            width: 512,
            height: 512,
            delay: 500,
            quality: 80
        });
        
        console.log('✅ Canvas-based GIF assembly completed successfully!');
        console.log(`📁 GIF created: ${result}`);
        
    } catch (error) {
        console.error('❌ Canvas GIF assembly test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testCanvasGif();
