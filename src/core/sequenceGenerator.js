/**
 * Image Sequence Generator for GIF Creation
 * Generates multiple frames using nano Banana (Gemini) AI
 */

import { NanoBananaIntegration } from '../integrations/gemini_integration.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Logger } from './logger.js';

export class SequenceGenerator {
    constructor(apiKey) {
        this.nanoBanana = new NanoBananaIntegration(apiKey);
        this.logger = new Logger();
    }

    /**
     * Generate a sequence of images for GIF animation
     * @param {string} basePrompt - The base prompt for the animation
     * @param {number} frameCount - Number of frames to generate
     * @param {string} animationType - Type of animation (walking, flying, dancing, etc.)
     * @param {string} outputDir - Output directory for frames
     * @returns {Promise<string[]>} Array of generated image paths
     */
    async generateSequence(basePrompt, frameCount = 5, animationType = 'general', outputDir = './output/frames') {
        this.logger.info(`🎬 Generating ${frameCount} frames for animation: ${animationType}`);
        
        // Ensure output directory exists
        try {
            await fs.mkdir(outputDir, { recursive: true });
        } catch (error) {
            // Directory might already exist, ignore error
        }
        
        const framePaths = [];
        const timestamp = Date.now();
        
        for (let i = 0; i < frameCount; i++) {
            try {
                this.logger.info(`🎨 Generating frame ${i + 1}/${frameCount}...`);
                
                // Create enhanced prompt for this frame
                const framePrompt = this.createFramePrompt(basePrompt, i, frameCount, animationType);
                
                // Generate image
                const framePath = path.join(outputDir, `frame_${i.toString().padStart(2, '0')}_${timestamp}.png`);
                const generatedPath = await this.nanoBanana.generateImage(framePrompt, null, framePath);
                
                framePaths.push(generatedPath);
                this.logger.success(`✅ Frame ${i + 1} generated: ${path.basename(generatedPath)}`);
                
                // Add small delay to avoid rate limiting
                if (i < frameCount - 1) {
                    await this.delay(1000); // 1 second delay between requests
                }
                
            } catch (error) {
                this.logger.error(`❌ Failed to generate frame ${i + 1}: ${error.message}`);
                throw error;
            }
        }
        
        this.logger.success(`🎉 Generated ${framePaths.length} frames successfully!`);
        return framePaths;
    }

    /**
     * Create an enhanced prompt for a specific frame
     * @param {string} basePrompt - Base prompt
     * @param {number} frameIndex - Current frame index (0-based)
     * @param {number} totalFrames - Total number of frames
     * @param {string} animationType - Type of animation
     * @returns {string} Enhanced prompt for the frame
     */
    createFramePrompt(basePrompt, frameIndex, totalFrames, animationType) {
        const progress = (frameIndex / (totalFrames - 1)) * 100;
        const frameNumber = frameIndex + 1;
        
        let motionPrompt = '';
        
        switch (animationType.toLowerCase()) {
            case 'walking':
                motionPrompt = this.getWalkingMotionPrompt(progress);
                break;
            case 'flying':
                motionPrompt = this.getFlyingMotionPrompt(progress);
                break;
            case 'dancing':
                motionPrompt = this.getDancingMotionPrompt(progress);
                break;
            case 'transformation':
                motionPrompt = this.getTransformationPrompt(progress);
                break;
            case 'rotating':
                motionPrompt = this.getRotatingPrompt(progress);
                break;
            case 'flowing':
                motionPrompt = this.getFlowingPrompt(progress);
                break;
            default:
                motionPrompt = this.getGeneralMotionPrompt(progress);
        }
        
        return `${basePrompt}, ${motionPrompt}, frame ${frameNumber} of ${totalFrames}, consistent character and background, smooth animation sequence, cinematic quality`;
    }

    /**
     * Get walking motion prompt based on progress
     */
    getWalkingMotionPrompt(progress) {
        const phases = [
            'left foot forward, right foot back',
            'mid-step, both feet off ground',
            'right foot forward, left foot back',
            'mid-step, both feet off ground',
            'left foot forward, right foot back'
        ];
        const phaseIndex = Math.floor((progress / 100) * phases.length);
        return `walking motion: ${phases[phaseIndex]}, natural gait, dynamic pose`;
    }

    /**
     * Get flying motion prompt based on progress
     */
    getFlyingMotionPrompt(progress) {
        const phases = [
            'wings up, ascending motion',
            'wings mid-beat, soaring',
            'wings down, gliding',
            'wings mid-beat, soaring',
            'wings up, ascending motion'
        ];
        const phaseIndex = Math.floor((progress / 100) * phases.length);
        return `flying motion: ${phases[phaseIndex]}, graceful flight, dynamic wing movement`;
    }

    /**
     * Get dancing motion prompt based on progress
     */
    getDancingMotionPrompt(progress) {
        const phases = [
            'arms up, left foot forward',
            'twisting motion, arms flowing',
            'arms down, right foot forward',
            'spinning motion, arms flowing',
            'arms up, left foot forward'
        ];
        const phaseIndex = Math.floor((progress / 100) * phases.length);
        return `dancing motion: ${phases[phaseIndex]}, rhythmic movement, expressive pose`;
    }

    /**
     * Get transformation motion prompt based on progress
     */
    getTransformationPrompt(progress) {
        const phases = [
            'beginning transformation, subtle changes',
            'mid-transformation, morphing shape',
            'peak transformation, dramatic change',
            'mid-transformation, morphing shape',
            'completing transformation, final form'
        ];
        const phaseIndex = Math.floor((progress / 100) * phases.length);
        return `transformation: ${phases[phaseIndex]}, magical morphing, fluid change`;
    }

    /**
     * Get rotating motion prompt based on progress
     */
    getRotatingPrompt(progress) {
        const angle = (progress / 100) * 360;
        return `rotating motion: ${Math.round(angle)} degrees, spinning movement, dynamic rotation`;
    }

    /**
     * Get flowing motion prompt based on progress
     */
    getFlowingPrompt(progress) {
        const phases = [
            'gentle wave motion, calm flow',
            'building wave, increasing energy',
            'peak wave, maximum flow',
            'building wave, increasing energy',
            'gentle wave motion, calm flow'
        ];
        const phaseIndex = Math.floor((progress / 100) * phases.length);
        return `flowing motion: ${phases[phaseIndex]}, fluid movement, natural flow`;
    }

    /**
     * Get general motion prompt based on progress
     */
    getGeneralMotionPrompt(progress) {
        const phases = [
            'starting position, initial movement',
            'building momentum, mid-motion',
            'peak action, maximum movement',
            'building momentum, mid-motion',
            'completing action, final position'
        ];
        const phaseIndex = Math.floor((progress / 100) * phases.length);
        return `motion: ${phases[phaseIndex]}, dynamic movement, natural progression`;
    }

    /**
     * Utility function to add delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
