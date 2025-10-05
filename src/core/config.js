/**
 * Configuration module for nano Banana GIF Generator
 * Centralized configuration management
 */

export const CONFIG = {
  // Output directories
  outputDir: './output',
  tempDir: './temp',
  
  // Animation settings
  defaultFrames: 5,
  defaultDelay: 500, // milliseconds between frames
  imageWidth: 512,
  imageHeight: 512,
  
  // API settings
  apiTimeout: 30000, // 30 seconds
  maxRetries: 3,
  
  // Animation types
  animationTypes: {
    WALKING: 'walking',
    FLYING: 'flying',
    DANCING: 'dancing',
    TRANSFORMATION: 'transformation',
    FLOWING: 'flowing',
    ROTATING: 'rotating',
    GENERAL: 'general'
  },
  
  // Supported image formats
  supportedFormats: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  
  // MIME types
  mimeTypes: {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  }
};

export default CONFIG;
