/**
 * Simple GIF Assembler - Alternative approach using sharp and gif-encoder-2
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';
import GIFEncoder from 'gif-encoder-2';
import { Logger } from './logger.js';

export class SimpleGifAssembler {
    constructor() {
        this.logger = new Logger();
    }

    /**
     * Create an animated GIF from a sequence of images using a simpler approach
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

        this.logger.info(`🎬 Creating simple GIF from ${imagePaths.length} frames...`);
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
                    // Read image file synchronously to avoid callback issues
                    const imageBuffer = fs.readFileSync(imagePath);
                    
                    // Resize image with sharp
                    const resizedBuffer = await sharp(imageBuffer)
                        .resize(width, height, { fit: 'cover' })
                        .raw()
                        .toBuffer();

                    // Convert buffer to proper format for GIF encoder
                    const imageData = this.bufferToImageData(resizedBuffer, width, height);
                    
                    // Add frame to GIF
                    encoder.addFrame(imageData);
                    
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
     * Convert buffer to ImageData format
     * @param {Buffer} buffer - Image buffer
     * @param {number} width - Image width
     * @param {number} height - Image height
     * @returns {Object} ImageData object
     */
    bufferToImageData(buffer, width, height) {
        // Convert raw buffer to proper ImageData format
        const data = new Uint8ClampedArray(buffer);
        
        // Create ImageData object with proper format
        return {
            data: data,
            width: width,
            height: height
        };
    }

    /**
     * Create GIF using sharp (alternative method)
     * @param {string[]} imagePaths - Array of image file paths
     * @param {string} outputPath - Output path for the GIF
     * @param {Object} options - GIF creation options
     * @returns {Promise<string>} Path to the created GIF
     */
    async createGifWithSharp(imagePaths, outputPath, options = {}) {
        const {
            width = 512,
            height = 512,
            delay = 500
        } = options;

        this.logger.info(`🎬 Creating GIF with Sharp from ${imagePaths.length} frames...`);

        try {
            // Process all images
            const processedImages = [];
            
            for (let i = 0; i < imagePaths.length; i++) {
                const imagePath = imagePaths[i];
                
                if (!fs.existsSync(imagePath)) {
                    this.logger.warning(`⚠️ Frame ${i + 1} not found: ${imagePath}`);
                    continue;
                }

                this.logger.info(`🖼️ Processing frame ${i + 1}/${imagePaths.length}...`);

                const imageBuffer = fs.readFileSync(imagePath);
                const resizedBuffer = await sharp(imageBuffer)
                    .resize(width, height, { fit: 'cover' })
                    .png()
                    .toBuffer();

                processedImages.push(resizedBuffer);
                this.logger.success(`✅ Frame ${i + 1} processed`);
            }

            if (processedImages.length === 0) {
                throw new Error('No valid images found to create GIF');
            }

            // For now, fall back to the encoder method
            return await this.createGif(imagePaths, outputPath, options);

        } catch (error) {
            this.logger.error(`❌ Failed to create GIF with Sharp: ${error.message}`);
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
