/**
 * Animation utilities for nano Banana GIF Generator
 * Handles animation logic, frame generation, and motion detection
 */

import { CONFIG } from '../core/config.js';
import { logger } from '../core/logger.js';

export class AnimationUtils {
  /**
   * Detect animation type from prompt
   * @param {string} prompt - Animation prompt
   * @returns {string} Animation type
   */
  static detectAnimationType(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('walk') || lowerPrompt.includes('running') || lowerPrompt.includes('moving')) {
      return CONFIG.animationTypes.WALKING;
    } else if (lowerPrompt.includes('fly') || lowerPrompt.includes('flying') || lowerPrompt.includes('soar')) {
      return CONFIG.animationTypes.FLYING;
    } else if (lowerPrompt.includes('dance') || lowerPrompt.includes('dancing')) {
      return CONFIG.animationTypes.DANCING;
    } else if (lowerPrompt.includes('grow') || lowerPrompt.includes('bloom') || lowerPrompt.includes('transform')) {
      return CONFIG.animationTypes.TRANSFORMATION;
    } else if (lowerPrompt.includes('wave') || lowerPrompt.includes('ocean') || lowerPrompt.includes('water')) {
      return CONFIG.animationTypes.FLOWING;
    } else if (lowerPrompt.includes('spin') || lowerPrompt.includes('rotate') || lowerPrompt.includes('turn')) {
      return CONFIG.animationTypes.ROTATING;
    } else {
      return CONFIG.animationTypes.GENERAL;
    }
  }

  /**
   * Create frame-specific prompt for animation
   * @param {string} basePrompt - Base prompt
   * @param {string} animationType - Animation type
   * @param {number} frameIndex - Current frame index
   * @param {number} totalFrames - Total number of frames
   * @param {number} progress - Animation progress (0-1)
   * @returns {string} Frame-specific prompt
   */
  static createFramePrompt(basePrompt, animationType, frameIndex, totalFrames, progress) {
    const progressPercent = Math.round(progress * 100);
    
    switch (animationType) {
      case CONFIG.animationTypes.WALKING:
        const walkCycle = ['left foot forward', 'mid-stride', 'right foot forward', 'mid-stride'];
        const walkPhase = walkCycle[frameIndex % walkCycle.length];
        return `${basePrompt}, ${walkPhase}, step ${frameIndex + 1} of walking cycle, consistent character and background`;
        
      case CONFIG.animationTypes.FLYING:
        const flyPositions = ['wings up', 'wings mid-flap', 'wings down', 'wings mid-flap'];
        const flyPhase = flyPositions[frameIndex % flyPositions.length];
        return `${basePrompt}, ${flyPhase}, flight position ${frameIndex + 1}, same character and environment`;
        
      case CONFIG.animationTypes.DANCING:
        const dancePositions = ['arms up', 'arms to side', 'arms down', 'arms crossed'];
        const dancePhase = dancePositions[frameIndex % dancePositions.length];
        return `${basePrompt}, ${dancePhase}, dance pose ${frameIndex + 1}, same dancer and setting`;
        
      case CONFIG.animationTypes.TRANSFORMATION:
        if (frameIndex === 0) {
          return `${basePrompt}, initial state, beginning of transformation`;
        } else if (frameIndex === totalFrames - 1) {
          return `${basePrompt}, final state, transformation complete`;
        } else {
          return `${basePrompt}, ${progressPercent}% transformed, mid-transformation stage ${frameIndex}`;
        }
        
      case CONFIG.animationTypes.FLOWING:
        const waveHeights = ['low wave', 'rising wave', 'high wave', 'falling wave'];
        const wavePhase = waveHeights[frameIndex % waveHeights.length];
        return `${basePrompt}, ${wavePhase}, wave motion frame ${frameIndex + 1}, consistent water and scene`;
        
      case CONFIG.animationTypes.ROTATING:
        const rotationAngle = (frameIndex * 360 / totalFrames);
        return `${basePrompt}, rotated ${Math.round(rotationAngle)} degrees, rotation frame ${frameIndex + 1}, same object and background`;
        
      default:
        const positions = ['center position', 'slightly left', 'slightly right', 'back to center'];
        const position = positions[frameIndex % positions.length];
        return `${basePrompt}, ${position}, frame ${frameIndex + 1} of ${totalFrames}, consistent scene and lighting`;
    }
  }

  /**
   * Generate animation frame prompts
   * @param {string} basePrompt - Base prompt
   * @param {number} frameCount - Number of frames
   * @returns {string[]} Array of frame prompts
   */
  static generateFramePrompts(basePrompt, frameCount) {
    const animationType = this.detectAnimationType(basePrompt);
    const prompts = [];
    
    for (let i = 0; i < frameCount; i++) {
      const progress = i / (frameCount - 1);
      const framePrompt = this.createFramePrompt(basePrompt, animationType, i, frameCount, progress);
      prompts.push(framePrompt);
    }
    
    logger.debug(`Generated ${frameCount} frame prompts for ${animationType} animation`);
    return prompts;
  }

  /**
   * Calculate animation timing
   * @param {number} frameCount - Number of frames
   * @param {number} duration - Total duration in seconds
   * @returns {number} Delay between frames in milliseconds
   */
  static calculateFrameDelay(frameCount, duration) {
    return Math.round((duration * 1000) / frameCount);
  }

  /**
   * Validate animation parameters
   * @param {Object} params - Animation parameters
   * @returns {Object} Validation result
   */
  static validateAnimationParams(params) {
    const errors = [];
    
    if (!params.prompt || typeof params.prompt !== 'string') {
      errors.push('Prompt is required and must be a string');
    }
    
    if (params.frames && (params.frames < 2 || params.frames > 20)) {
      errors.push('Frame count must be between 2 and 20');
    }
    
    if (params.delay && (params.delay < 100 || params.delay > 2000)) {
      errors.push('Delay must be between 100ms and 2000ms');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default AnimationUtils;
