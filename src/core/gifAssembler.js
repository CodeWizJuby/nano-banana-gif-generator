/**
 * GIF Assembler - Combines image frames into animated GIF
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gif-encoder-2';
import { Logger } from './logger.js';

export class GifAssembler {
    constructor() {
        this.logger = new Logger();
    }

    /**
     * Create an animated GIF from a sequence of images
     * @param {string[]} imagePaths - Array of image file paths
     * @param {string} outputPath - Output path for the GIF
     * @param {Object} options - GIF creation options
     * @returns {Promise<string>} Path to the created GIF
     */
    async createGif(imagePaths, outputPath, options = {}) {
        const {
            width = 512,
            height = 512,
            delay = 500, // milliseconds
            quality = 80,
            loop = 0 // 0 = infinite loop
        } = options;

        this.logger.info(`🎬 Creating GIF from ${imagePaths.length} frames...`);
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
                    // Load and resize image
                    const imageBuffer = await fs.readFile(imagePath);
                    const resizedBuffer = await sharp(imageBuffer)
                        .resize(width, height, { fit: 'cover' })
                        .png()
                        .toBuffer();

                    // Convert to canvas
                    const canvas = createCanvas(width, height);
                    const ctx = canvas.getContext('2d');
                    const image = await loadImage(resizedBuffer);
                    
                    // Draw image on canvas
                    ctx.drawImage(image, 0, 0, width, height);
                    
                    // Add frame to GIF
                    encoder.addFrame(ctx);
                    
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
            await fs.writeFile(outputPath, gifBuffer).catch(error => {
                throw new Error(`Failed to write GIF file: ${error.message}`);
            });

            this.logger.success(`🎉 GIF created successfully: ${outputPath}`);
            this.logger.info(`📊 Final GIF: ${imagePaths.length} frames, ${(gifBuffer.length / 1024).toFixed(1)}KB`);

            return outputPath;

        } catch (error) {
            this.logger.error(`❌ Failed to create GIF: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create a simple GIF using sharp (alternative method)
     * @param {string[]} imagePaths - Array of image file paths
     * @param {string} outputPath - Output path for the GIF
     * @param {Object} options - GIF creation options
     * @returns {Promise<string>} Path to the created GIF
     */
    async createGifSimple(imagePaths, outputPath, options = {}) {
        const {
            width = 512,
            height = 512,
            delay = 500
        } = options;

        this.logger.info(`🎬 Creating simple GIF from ${imagePaths.length} frames...`);

        try {
            // Process images with sharp
            const processedImages = [];
            
            for (let i = 0; i < imagePaths.length; i++) {
                const imagePath = imagePaths[i];
                
                if (!fs.existsSync(imagePath)) {
                    this.logger.warning(`⚠️ Frame ${i + 1} not found: ${imagePath}`);
                    continue;
                }

                const imageBuffer = await fs.readFile(imagePath);
                const resizedBuffer = await sharp(imageBuffer)
                    .resize(width, height, { fit: 'cover' })
                    .png()
                    .toBuffer();

                processedImages.push(resizedBuffer);
            }

            // Create GIF using sharp (if supported) or fallback to canvas method
            if (processedImages.length === 0) {
                throw new Error('No valid images found to create GIF');
            }

            // For now, use the canvas method as fallback
            return await this.createGif(imagePaths, outputPath, options);

        } catch (error) {
            this.logger.error(`❌ Failed to create simple GIF: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get optimal GIF settings based on frame count
     * @param {number} frameCount - Number of frames
     * @returns {Object} Optimized settings
     */
    getOptimalSettings(frameCount) {
        if (frameCount <= 3) {
            return { delay: 800, quality: 90 };
        } else if (frameCount <= 5) {
            return { delay: 600, quality: 85 };
        } else if (frameCount <= 8) {
            return { delay: 400, quality: 80 };
        } else {
            return { delay: 300, quality: 75 };
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
                    await fs.unlink(filePath);
                    this.logger.success(`🗑️ Cleaned up: ${path.basename(filePath)}`);
                }
            } catch (error) {
                this.logger.warning(`⚠️ Failed to clean up ${filePath}: ${error.message}`);
            }
        }
    }
}
