/**
 * Canvas-based GIF Assembler - Uses canvas for proper image processing
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gif-encoder-2';
import { Logger } from './logger.js';

export class CanvasGifAssembler {
    constructor() {
        this.logger = new Logger();
    }

    /**
     * Create an animated GIF from a sequence of images using canvas
     * @param {string[]} imagePaths - Array of image file paths
     * @param {string} outputPath - Output path for the GIF
     * @param {Object} options - GIF creation options
     * @returns {Promise<string>} Path to the created GIF
     */
    async createGif(imagePaths, outputPath, options = {}) {
        const {
            width = 512,
            height = 512,
            delay = 500,
            quality = 80,
            loop = 0
        } = options;

        this.logger.info(`🎬 Creating canvas-based GIF from ${imagePaths.length} frames...`);
        this.logger.info(`📐 Size: ${width}x${height}, Delay: ${delay}ms, Quality: ${quality}%`);

        try {
            // Create GIF encoder
            const encoder = new GIFEncoder(width, height, 'neuquant', true);
            
            // Set GIF options
            encoder.setRepeat(loop);
            encoder.setDelay(delay);
            encoder.setQuality(quality);

            // Start encoding
            encoder.start();

            // Process each frame
            for (let i = 0; i < imagePaths.length; i++) {
                const imagePath = imagePaths[i];
                
                if (!fs.existsSync(imagePath)) {
                    this.logger.warning(`⚠️ Frame ${i + 1} not found: ${imagePath}`);
                    continue;
                }

                this.logger.info(`🖼️ Processing frame ${i + 1}/${imagePaths.length}...`);

                try {
                    // Read and resize image
                    const imageBuffer = fs.readFileSync(imagePath);
                    const resizedBuffer = await sharp(imageBuffer)
                        .resize(width, height, { fit: 'cover' })
                        .png()
                        .toBuffer();

                    // Create canvas and load image
                    const canvas = createCanvas(width, height);
                    const ctx = canvas.getContext('2d');
                    const image = await loadImage(resizedBuffer);
                    
                    // Draw image on canvas
                    ctx.drawImage(image, 0, 0, width, height);
                    
                    // Get image data from canvas
                    const imageData = ctx.getImageData(0, 0, width, height);
                    
                    // Add frame to GIF
                    encoder.addFrame(imageData.data);
                    
                    this.logger.success(`✅ Frame ${i + 1} added to GIF`);
                    
                } catch (error) {
                    this.logger.error(`❌ Failed to process frame ${i + 1}: ${error.message}`);
                    continue;
                }
            }

            // Finish encoding
            encoder.finish();

            // Write GIF to file
            const gifBuffer = encoder.out.getData();
            fs.writeFileSync(outputPath, gifBuffer);

            this.logger.success(`🎉 GIF created successfully: ${outputPath}`);
            this.logger.info(`📊 Final GIF: ${imagePaths.length} frames, ${(gifBuffer.length / 1024).toFixed(1)}KB`);

            return outputPath;

        } catch (error) {
            this.logger.error(`❌ Failed to create GIF: ${error.message}`);
            throw error;
        }
    }

    /**
     * Clean up temporary files
     * @param {string[]} filePaths - Array of file paths to clean up
     */
    async cleanup(filePaths) {
        this.logger.info(`🧹 Cleaning up ${filePaths.length} temporary files...`);
        
        for (const filePath of filePaths) {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    this.logger.success(`🗑️ Cleaned up: ${path.basename(filePath)}`);
                }
            } catch (error) {
                this.logger.warning(`⚠️ Failed to clean up ${filePath}: ${error.message}`);
            }
        }
    }
}
