/**
 * CLI commands for nano Banana GIF Generator
 * Handles command-line interface and user interactions
 */

import { Command } from 'commander';
import { logger } from '../core/logger.js';
import { CONFIG } from '../core/config.js';
import { FileUtils } from '../utils/fileUtils.js';
import { AnimationUtils } from '../utils/animationUtils.js';
import { GifCommands } from './gifCommands.js';

export class CLICommands {
  constructor() {
    this.program = new Command();
    this.gifCommands = new GifCommands();
    this.setupCommands();
  }

  setupCommands() {
    this.program
      .name('nano-banana-gif')
      .description('Generate animated GIFs using nano Banana-style image generation')
      .version('1.0.0');

    // Generate command
    this.program
      .command('generate')
      .description('Generate an animated GIF from a text prompt')
      .argument('<prompt>', 'text prompt for image generation')
      .option('-f, --frames <number>', 'number of frames to generate', '5')
      .option('-d, --delay <number>', 'delay between frames in milliseconds', '500')
      .option('-a, --animation <type>', 'animation type (walking, flying, dancing, etc.)', 'general')
      .option('-w, --width <number>', 'GIF width in pixels', '512')
      .option('-h, --height <number>', 'GIF height in pixels', '512')
      .option('-q, --quality <number>', 'GIF quality (1-100)', '80')
      .option('-k, --keep-frames', 'keep individual frame files', false)
      .action(this.handleGenerate.bind(this));

    // Generate multiple command
    this.program
      .command('generate-multiple')
      .description('Generate multiple GIFs with different animation types')
      .argument('<prompt>', 'text prompt for image generation')
      .option('-a, --animations <types>', 'comma-separated animation types', 'walking,flying,dancing')
      .option('-f, --frames <number>', 'number of frames to generate', '5')
      .option('-w, --width <number>', 'GIF width in pixels', '512')
      .option('-h, --height <number>', 'GIF height in pixels', '512')
      .action(this.handleGenerateMultiple.bind(this));

    // Test command
    this.program
      .command('test')
      .description('Test nano Banana integration')
      .argument('[prompt]', 'test prompt for Gemini API', 'a cat walking')
      .action(this.handleTest.bind(this));

    // Clean command
    this.program
      .command('clean')
      .description('Clean temporary files')
      .action(this.handleClean.bind(this));

    // Info command
    this.program
      .command('info')
      .description('Show information about the tool')
      .action(this.handleInfo.bind(this));
  }

  async handleGenerate(prompt, options) {
    try {
      // Validate and set default values
      const frameCount = parseInt(options.frames) || 5;
      const width = parseInt(options.width) || 512;
      const height = parseInt(options.height) || 512;
      const delay = parseInt(options.delay) || 500;
      const quality = parseInt(options.quality) || 80;
      const animationType = options.animation || 'general';
      const keepFrames = options.keepFrames || false;

      logger.header('nano Banana GIF Generation');
      logger.info(`Prompt: "${prompt}"`);
      logger.info(`Frames: ${frameCount}, Animation: ${animationType}`);
      logger.info(`Size: ${width}x${height}, Delay: ${delay}ms`);

      const result = await this.gifCommands.generateGif(prompt, {
        frameCount: frameCount,
        animationType: animationType,
        width: width,
        height: height,
        delay: delay,
        quality: quality,
        keepFrames: keepFrames
      });

      logger.success(`🎉 GIF generated successfully!`);
      logger.info(`📁 Location: ${result.gifPath}`);
      
    } catch (error) {
      logger.error('Generation failed:', error.message);
      process.exit(1);
    }
  }

  async handleGenerateMultiple(prompt, options) {
    try {
      // Validate and set default values
      const frameCount = parseInt(options.frames) || 5;
      const width = parseInt(options.width) || 512;
      const height = parseInt(options.height) || 512;
      const animationTypes = (options.animations || 'walking,flying,dancing').split(',').map(type => type.trim());

      logger.header('nano Banana Multiple GIF Generation');
      logger.info(`Prompt: "${prompt}"`);
      logger.info(`Animation Types: ${animationTypes.join(', ')}`);

      const results = await this.gifCommands.generateMultipleGifs(prompt, animationTypes, {
        frameCount: frameCount,
        width: width,
        height: height
      });

      logger.success(`🎉 Generated ${results.filter(r => r.success).length}/${results.length} GIFs successfully!`);
      
    } catch (error) {
      logger.error('Multiple generation failed:', error.message);
      process.exit(1);
    }
  }

  async handleTest(prompt) {
    try {
      logger.header('nano Banana Integration Test');
      
      // Import test function
      const { testNanoBananaIntegration } = await import('../../tests/test_gemini_integration.js');
      await testNanoBananaIntegration();
      
    } catch (error) {
      logger.error('Test failed:', error.message);
      process.exit(1);
    }
  }

  async handleClean() {
    try {
      logger.info('Cleaning temporary files...');
      await FileUtils.cleanDirectory(CONFIG.tempDir);
      logger.success('Temporary files cleaned');
    } catch (error) {
      logger.error('Clean failed:', error.message);
      process.exit(1);
    }
  }

  handleInfo() {
    logger.header('nano Banana GIF Generator');
    logger.info('What is nano Banana?');
    logger.info('• Google\'s premier image generation and editing AI from DeepMind');
    logger.info('• Available at: https://gemini.google/overview/image-generation/');
    logger.info('• Excels at photo editing, combining images, and style transfers');
    logger.info('• Can turn a single photo into countless new creations');
    logger.info('• Specializes in precise, localized image changes');
    logger.separator();
    logger.info('This CLI Tool Features:');
    logger.info('• 🍌 Google Gemini API integration (ready for nano Banana)');
    logger.info('• 🎨 Sequential motion animation (like nano Banana\'s consistency)');
    logger.info('• 🌅 Progressive background sequences');
    logger.info('• 🎞️ Multiple animation types (walking, flying, dancing, etc.)');
    logger.info('• 📱 Fallback to OpenAI DALL-E and Stability AI');
    logger.info('• 🎬 Actual GIF file generation');
    logger.separator();
    logger.info('Setup Instructions:');
    logger.info('1. Add GOOGLE_API_KEY to .env file (priority for nano Banana)');
    logger.info('2. Optional: Add OPENAI_API_KEY for current generation');
    logger.info('3. Optional: Add STABILITY_API_KEY as additional backup');
    logger.info('4. Run: npm test to test Gemini');
    logger.separator();
    logger.info('Available Commands:');
    logger.info('• generate "<prompt>" - Create animated GIF');
    logger.info('• test "<prompt>" - Test Gemini API connection');
    logger.info('• clean - Clean temporary files');
    logger.info('• info - Show this information');
    logger.separator();
    logger.info('Output Structure:');
    logger.info(`• Individual frames: ${CONFIG.tempDir}/`);
    logger.info(`• Final GIFs: ${CONFIG.outputDir}/`);
    logger.separator();
    logger.info('Important Links:');
    logger.info('• nano Banana: https://gemini.google/overview/image-generation/');
    logger.info('• Google API Keys: https://makersuite.google.com/app/apikey');
    logger.info('• OpenAI API: https://platform.openai.com/api-keys');
    logger.info('• Stability AI: https://platform.stability.ai/account/keys');
    logger.separator();
    logger.info('This tool will automatically use nano Banana API when available!');
  }

  parse() {
    this.program.parse();
  }
}

export default CLICommands;
