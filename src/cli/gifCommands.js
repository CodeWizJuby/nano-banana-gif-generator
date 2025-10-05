/**
 * CLI Commands for GIF Generation
 */

import { GifGenerator } from '../core/gifGenerator.js';
import { Logger } from '../core/logger.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class GifCommands {
    constructor() {
        this.logger = new Logger();
        this.apiKey = process.env.GOOGLE_API_KEY;
        
        if (!this.apiKey) {
            this.logger.error('❌ GOOGLE_API_KEY not found in environment variables');
            this.logger.info('🔑 Please set GOOGLE_API_KEY in your .env file');
            process.exit(1);
        }
        
        this.gifGenerator = new GifGenerator(this.apiKey);
    }

    /**
     * Generate a single animated GIF
     * @param {string} prompt - Animation prompt
     * @param {Object} options - Generation options
     */
    async generateGif(prompt, options = {}) {
        this.logger.info(`🍌 nano Banana GIF Generator`);
        this.logger.info(`📝 Prompt: "${prompt}"`);
        
        try {
            const result = await this.gifGenerator.generateAnimatedGif(prompt, options);
            
            if (result.success) {
                this.logger.success(`🎉 GIF generated successfully!`);
                this.logger.info(`📁 Location: ${result.gifPath}`);
                this.logger.info(`📊 Frames: ${result.frameCount}, Animation: ${result.animationType}`);
                return result;
            } else {
                throw new Error('GIF generation failed');
            }
            
        } catch (error) {
            this.logger.error(`❌ Failed to generate GIF: ${error.message}`);
            throw error;
        }
    }

    /**
     * Generate multiple GIFs with different animation types
     * @param {string} prompt - Animation prompt
     * @param {string[]} animationTypes - Animation types to generate
     * @param {Object} options - Generation options
     */
    async generateMultipleGifs(prompt, animationTypes = ['walking', 'flying', 'dancing'], options = {}) {
        this.logger.info(`🍌 nano Banana Multiple GIF Generator`);
        this.logger.info(`📝 Prompt: "${prompt}"`);
        this.logger.info(`🎬 Animation Types: ${animationTypes.join(', ')}`);
        
        try {
            const results = await this.gifGenerator.generateMultipleGifs(prompt, animationTypes, options);
            
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);
            
            this.logger.success(`🎉 Generated ${successful.length}/${results.length} GIFs successfully!`);
            
            successful.forEach(result => {
                this.logger.info(`✅ ${result.animationType}: ${result.gifPath}`);
            });
            
            if (failed.length > 0) {
                this.logger.warning(`⚠️ ${failed.length} GIFs failed to generate`);
                failed.forEach(result => {
                    this.logger.error(`❌ ${result.animationType}: ${result.error}`);
                });
            }
            
            return results;
            
        } catch (error) {
            this.logger.error(`❌ Failed to generate multiple GIFs: ${error.message}`);
            throw error;
        }
    }

    /**
     * Show available animation types
     */
    showAnimationTypes() {
        const types = this.gifGenerator.getAvailableAnimationTypes();
        
        this.logger.info(`🎬 Available Animation Types:`);
        types.forEach((type, index) => {
            this.logger.info(`${index + 1}. ${type}`);
        });
    }

    /**
     * Show recommended settings for different use cases
     */
    showRecommendedSettings() {
        const useCases = ['social', 'presentation', 'website', 'general'];
        
        this.logger.info(`⚙️ Recommended Settings:`);
        useCases.forEach(useCase => {
            const settings = this.gifGenerator.getRecommendedSettings(useCase);
            this.logger.info(`📱 ${useCase.toUpperCase()}: ${settings.frameCount} frames, ${settings.width}x${settings.height}, ${settings.delay}ms delay`);
        });
    }

    /**
     * Generate GIF from existing frame files
     * @param {string[]} framePaths - Array of frame file paths
     * @param {Object} options - GIF generation options
     */
    async generateGifFromFrames(framePaths, options = {}) {
        this.logger.info(`🎬 Assembling GIF from ${framePaths.length} frames...`);
        
        try {
            const result = await this.gifGenerator.assembleGifFromFrames(framePaths, options);
            
            if (result.success) {
                this.logger.success(`🎉 GIF assembled successfully!`);
                this.logger.info(`📁 Location: ${result.gifPath}`);
                return result;
            } else {
                throw new Error('GIF assembly failed');
            }
            
        } catch (error) {
            this.logger.error(`❌ Failed to assemble GIF: ${error.message}`);
            throw error;
        }
    }

    /**
     * Test the GIF generation system
     * @param {string} testPrompt - Test prompt
     */
    async testGifGeneration(testPrompt = "a cute cat playing with a ball") {
        this.logger.info(`🧪 Testing GIF generation system...`);
        
        try {
            const result = await this.generateGif(testPrompt, {
                frameCount: 3,
                animationType: 'general',
                width: 256,
                height: 256,
                delay: 500,
                keepFrames: true
            });
            
            this.logger.success(`✅ Test completed successfully!`);
            this.logger.info(`📁 Test GIF: ${result.gifPath}`);
            this.logger.info(`📊 Frames: ${result.frameCount}`);
            
            return result;
            
        } catch (error) {
            this.logger.error(`❌ Test failed: ${error.message}`);
            throw error;
        }
    }
}
