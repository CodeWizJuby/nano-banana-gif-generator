/**
 * Main GIF Generator - Orchestrates the entire GIF creation process
 */

import { SequenceGenerator } from './sequenceGenerator.js';
import { CanvasGifAssembler } from './canvasGifAssembler.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Logger } from './logger.js';

export class GifGenerator {
    constructor(apiKey) {
        this.sequenceGenerator = new SequenceGenerator(apiKey);
        this.gifAssembler = new CanvasGifAssembler();
        this.logger = new Logger();
    }

    /**
     * Generate a complete animated GIF
     * @param {string} prompt - Base prompt for the animation
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Result object with paths and metadata
     */
    async generateAnimatedGif(prompt, options = {}) {
        const {
            frameCount = 5,
            animationType = 'general',
            width = 512,
            height = 512,
            delay = 500,
            quality = 80,
            outputDir = './output',
            keepFrames = false
        } = options;

        this.logger.info(`🍌 Starting nano Banana GIF generation...`);
        this.logger.info(`📝 Prompt: ${prompt}`);
        this.logger.info(`🎬 Animation: ${animationType} (${frameCount} frames)`);

        try {
            // Create output directories
            const framesDir = path.join(outputDir, 'frames');
            const gifsDir = path.join(outputDir, 'gifs');
            
            try {
                await fs.mkdir(framesDir, { recursive: true });
            } catch (error) {
                // Directory might already exist, ignore error
            }
            try {
                await fs.mkdir(gifsDir, { recursive: true });
            } catch (error) {
                // Directory might already exist, ignore error
            }

            // Generate image sequence
            this.logger.info(`🎨 Generating ${frameCount} frames...`);
            const framePaths = await this.sequenceGenerator.generateSequence(
                prompt,
                frameCount,
                animationType,
                framesDir
            );

            if (framePaths.length === 0) {
                throw new Error('No frames were generated');
            }

            // Create GIF filename
            const timestamp = Date.now();
            const safePrompt = prompt.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
            const gifFilename = `${safePrompt}_${animationType}_${timestamp}.gif`;
            const gifPath = path.join(gifsDir, gifFilename);

            // Assemble GIF
            this.logger.info(`🎬 Assembling GIF...`);
            const gifSettings = this.getOptimalSettings(frameCount);
            const finalGifPath = await this.gifAssembler.createGif(framePaths, gifPath, {
                width,
                height,
                delay: delay || gifSettings.delay,
                quality: quality || gifSettings.quality
            });

            // Clean up frames if requested
            if (!keepFrames) {
                this.logger.info(`🧹 Cleaning up frame files...`);
                await this.gifAssembler.cleanup(framePaths);
            }

            // Return result
            const result = {
                success: true,
                gifPath: finalGifPath,
                framePaths: keepFrames ? framePaths : [],
                frameCount: framePaths.length,
                animationType,
                prompt,
                settings: {
                    width,
                    height,
                    delay: delay || gifSettings.delay,
                    quality: quality || gifSettings.quality
                },
                timestamp: new Date().toISOString()
            };

            this.logger.success(`🎉 GIF generation complete!`);
            this.logger.info(`📁 GIF saved: ${finalGifPath}`);
            this.logger.info(`📊 Frames: ${framePaths.length}, Size: ${width}x${height}`);

            return result;

        } catch (error) {
            this.logger.error(`❌ GIF generation failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Generate multiple GIFs with different animation types
     * @param {string} prompt - Base prompt
     * @param {string[]} animationTypes - Array of animation types
     * @param {Object} options - Generation options
     * @returns {Promise<Object[]>} Array of result objects
     */
    async generateMultipleGifs(prompt, animationTypes = ['walking', 'flying', 'dancing'], options = {}) {
        this.logger.info(`🎬 Generating multiple GIFs with ${animationTypes.length} animation types...`);
        
        const results = [];
        
        for (let i = 0; i < animationTypes.length; i++) {
            const animationType = animationTypes[i];
            this.logger.info(`🎨 Generating GIF ${i + 1}/${animationTypes.length}: ${animationType}`);
            
            try {
                const result = await this.generateAnimatedGif(prompt, {
                    ...options,
                    animationType,
                    keepFrames: false // Don't keep frames for multiple generations
                });
                
                results.push(result);
                this.logger.success(`✅ ${animationType} GIF completed`);
                
            } catch (error) {
                this.logger.error(`❌ Failed to generate ${animationType} GIF: ${error.message}`);
                results.push({
                    success: false,
                    animationType,
                    error: error.message
                });
            }
        }
        
        this.logger.success(`🎉 Multiple GIF generation complete! ${results.filter(r => r.success).length}/${results.length} successful`);
        return results;
    }

    /**
     * Get available animation types
     * @returns {string[]} Array of animation types
     */
    getAvailableAnimationTypes() {
        return [
            'walking',
            'flying', 
            'dancing',
            'transformation',
            'rotating',
            'flowing',
            'general'
        ];
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
     * Get recommended settings for different use cases
     * @param {string} useCase - Use case (social, presentation, etc.)
     * @returns {Object} Recommended settings
     */
    getRecommendedSettings(useCase = 'general') {
        const settings = {
            social: {
                frameCount: 8,
                width: 512,
                height: 512,
                delay: 300,
                quality: 75
            },
            presentation: {
                frameCount: 5,
                width: 800,
                height: 600,
                delay: 600,
                quality: 85
            },
            website: {
                frameCount: 6,
                width: 400,
                height: 400,
                delay: 400,
                quality: 80
            },
            general: {
                frameCount: 5,
                width: 512,
                height: 512,
                delay: 500,
                quality: 80
            }
        };
        
        return settings[useCase] || settings.general;
    }
}
