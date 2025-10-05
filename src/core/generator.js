/**
 * Main generator for nano Banana GIF Generator
 * Orchestrates the entire GIF generation process
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { CONFIG } from './config.js';
import { logger } from './logger.js';
import { FileUtils } from '../utils/fileUtils.js';
import { AnimationUtils } from '../utils/animationUtils.js';
import { NanoBananaIntegration } from '../integrations/gemini_integration.js';

export class GifGenerator {
  constructor() {
    this.nanoBanana = null;
    this.initializeIntegrations();
  }

  async initializeIntegrations() {
    try {
      const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
      if (apiKey) {
        this.nanoBanana = new NanoBananaIntegration(apiKey);
        logger.debug('nano Banana integration initialized');
      }
    } catch (error) {
      logger.warning('Failed to initialize nano Banana integration:', error.message);
    }
  }

  /**
   * Generate an animated GIF
   * @param {string} prompt - Text prompt for generation
   * @param {Object} options - Generation options
   * @returns {Promise<string>} Path to generated GIF
   */
  async generateAnimatedGif(prompt, options = {}) {
    try {
      await this.ensureDirectories();
      
      const frames = options.frames || CONFIG.defaultFrames;
      const delay = options.delay || CONFIG.defaultDelay;
      const output = options.output || path.join(CONFIG.outputDir, `animation_${Date.now()}.gif`);
      
      logger.info('Starting animation generation...');
      logger.info(`Prompt: "${prompt}"`);
      logger.info(`Frames: ${frames}`);
      logger.info(`Delay: ${delay}ms`);
      
      // Generate frame prompts
      const framePrompts = AnimationUtils.generateFramePrompts(prompt, frames);
      const imagePaths = [];
      
      // Generate images for each frame
      for (let i = 0; i < frames; i++) {
        logger.info(`Generating frame ${i + 1}/${frames}...`);
        
        const imageBuffer = await this.generateImage(framePrompts[i], i, frames);
        const imagePath = path.join(CONFIG.tempDir, `frame_${String(i).padStart(3, '0')}.png`);
        
        await FileUtils.writeFile(imagePath, imageBuffer);
        imagePaths.push(imagePath);
        
        logger.success(`Frame ${i + 1} generated`);
      }
      
      // Create GIF
      const gifPath = await this.createGif(imagePaths, output, delay);
      
      logger.success('Animation generation complete!');
      logger.success(`Output: ${output}`);
      
      return gifPath;
      
    } catch (error) {
      logger.error('Animation generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Generate a single image
   * @param {string} prompt - Image prompt
   * @param {number} frameIndex - Frame index
   * @param {number} totalFrames - Total frames
   * @returns {Promise<Buffer>} Image buffer
   */
  async generateImage(prompt, frameIndex, totalFrames) {
    try {
      // Try nano Banana first
      if (this.nanoBanana) {
        try {
          logger.info(`Using nano Banana for frame ${frameIndex + 1}...`);
          const imagePath = await this.nanoBanana.generateImage(prompt);
          const imageBuffer = await FileUtils.readFile(imagePath);
          await FileUtils.deleteFile(imagePath); // Clean up temp file
          return imageBuffer;
        } catch (error) {
          logger.warning(`nano Banana failed for frame ${frameIndex + 1}:`, error.message);
        }
      }
      
      // Fallback to other AI services
      const fallbackBuffer = await this.generateWithFallback(prompt, frameIndex, totalFrames);
      return fallbackBuffer;
      
    } catch (error) {
      logger.error(`Image generation failed for frame ${frameIndex + 1}:`, error.message);
      throw error;
    }
  }

  /**
   * Generate image with fallback services
   * @param {string} prompt - Image prompt
   * @param {number} frameIndex - Frame index
   * @param {number} totalFrames - Total frames
   * @returns {Promise<Buffer>} Image buffer
   */
  async generateWithFallback(prompt, frameIndex, totalFrames) {
    // Try OpenAI DALL-E
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        logger.info(`Using OpenAI DALL-E for frame ${frameIndex + 1}...`);
        return await this.generateWithOpenAI(prompt, frameIndex, totalFrames, openaiKey);
      } catch (error) {
        logger.warning(`OpenAI failed for frame ${frameIndex + 1}:`, error.message);
      }
    }
    
    // Try Stability AI
    const stabilityKey = process.env.STABILITY_API_KEY;
    if (stabilityKey) {
      try {
        logger.info(`Using Stability AI for frame ${frameIndex + 1}...`);
        return await this.generateWithStability(prompt, frameIndex, totalFrames, stabilityKey);
      } catch (error) {
        logger.warning(`Stability AI failed for frame ${frameIndex + 1}:`, error.message);
      }
    }
    
    // Fallback to placeholder
    logger.warning(`Using placeholder for frame ${frameIndex + 1}...`);
    return await this.generatePlaceholderImage(prompt, frameIndex, totalFrames);
  }

  /**
   * Generate image with OpenAI DALL-E
   * @param {string} prompt - Image prompt
   * @param {number} frameIndex - Frame index
   * @param {number} totalFrames - Total frames
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<Buffer>} Image buffer
   */
  async generateWithOpenAI(prompt, frameIndex, totalFrames, apiKey) {
    const axios = (await import('axios')).default;
    const sharp = (await import('sharp')).default;
    
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      model: "dall-e-3",
      prompt: `${prompt} - frame ${frameIndex + 1} of ${totalFrames}, high quality, detailed`,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const imageUrl = response.data.data[0].url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    const resizedBuffer = await sharp(Buffer.from(imageResponse.data))
      .resize(CONFIG.imageWidth, CONFIG.imageHeight)
      .png()
      .toBuffer();
    
    return resizedBuffer;
  }

  /**
   * Generate image with Stability AI
   * @param {string} prompt - Image prompt
   * @param {number} frameIndex - Frame index
   * @param {number} totalFrames - Total frames
   * @param {string} apiKey - Stability AI API key
   * @returns {Promise<Buffer>} Image buffer
   */
  async generateWithStability(prompt, frameIndex, totalFrames, apiKey) {
    const axios = (await import('axios')).default;
    const sharp = (await import('sharp')).default;
    
    const response = await axios.post('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      text_prompts: [{
        text: `${prompt} - frame ${frameIndex + 1} of ${totalFrames}`,
        weight: 1
      }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const imageBase64 = response.data.artifacts[0].base64;
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    const resizedBuffer = await sharp(imageBuffer)
      .resize(CONFIG.imageWidth, CONFIG.imageHeight)
      .png()
      .toBuffer();
    
    return resizedBuffer;
  }

  /**
   * Generate placeholder image
   * @param {string} prompt - Image prompt
   * @param {number} frameIndex - Frame index
   * @param {number} totalFrames - Total frames
   * @returns {Promise<Buffer>} Image buffer
   */
  async generatePlaceholderImage(prompt, frameIndex, totalFrames) {
    const { createCanvas } = await import('canvas');
    
    const canvas = createCanvas(CONFIG.imageWidth, CONFIG.imageHeight);
    const ctx = canvas.getContext('2d');
    
    // Simple placeholder with prompt text
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CONFIG.imageWidth, CONFIG.imageHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = prompt.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > CONFIG.imageWidth - 40 && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    
    const startY = (CONFIG.imageHeight - (lines.length * 25)) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, CONFIG.imageWidth / 2, startY + index * 25);
    });
    
    ctx.font = '16px Arial';
    ctx.fillText(`Frame ${frameIndex + 1}/${totalFrames}`, CONFIG.imageWidth / 2, CONFIG.imageHeight - 50);
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Create GIF from images
   * @param {string[]} imagePaths - Array of image paths
   * @param {string} outputPath - Output GIF path
   * @param {number} delay - Delay between frames
   * @returns {Promise<string>} Path to created GIF
   */
  async createGif(imagePaths, outputPath, delay) {
    try {
      const GifEncoder = (await import('gif-encoder-2')).default;
      
      const encoder = new GifEncoder(CONFIG.imageWidth, CONFIG.imageHeight, 'neuquant');
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(delay);
      encoder.setQuality(10);
      
      logger.info(`Creating GIF from ${imagePaths.length} frames...`);
      
      for (let i = 0; i < imagePaths.length; i++) {
        const imageBuffer = await FileUtils.readFile(imagePaths[i]);
        const { loadImage } = await import('canvas');
        const image = await loadImage(imageBuffer);
        
        const canvas = createCanvas(CONFIG.imageWidth, CONFIG.imageHeight);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, CONFIG.imageWidth, CONFIG.imageHeight);
        
        encoder.addFrame(ctx);
        logger.debug(`Added frame ${i + 1}/${imagePaths.length}`);
      }
      
      encoder.finish();
      
      const buffer = encoder.out.getData();
      await FileUtils.writeFile(outputPath, buffer);
      
      logger.success(`GIF created: ${outputPath}`);
      return outputPath;
      
    } catch (error) {
      logger.error('GIF creation failed:', error.message);
      throw error;
    }
  }

  /**
   * Ensure required directories exist
   */
  async ensureDirectories() {
    await FileUtils.ensureDirectory(CONFIG.outputDir);
    await FileUtils.ensureDirectory(CONFIG.tempDir);
  }
}

// Create singleton instance
const generator = new GifGenerator();

// Export main function
export async function generateAnimatedGif(prompt, options) {
  return await generator.generateAnimatedGif(prompt, options);
}

export default generator;
