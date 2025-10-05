/**
 * Environment Configuration
 * Centralized environment variable management for the nano-banana-gif-generator
 */

import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Environment configuration object
 */
export const ENV_CONFIG = {
  // API Keys
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STABILITY_API_KEY: process.env.STABILITY_API_KEY,
  
  // Application settings
  NODE_ENV: process.env.NODE_ENV || 'development',
  USE_API: process.env.USE_API !== 'false',
  
  // Output directories
  OUTPUT_DIR: process.env.OUTPUT_DIR || './output',
  IMAGES_DIR: process.env.IMAGES_DIR || './output/images',
  FRAMES_DIR: process.env.FRAMES_DIR || './output/frames',
  GIFS_DIR: process.env.GIFS_DIR || './output/gifs',
  TEMP_DIR: process.env.TEMP_DIR || './temp',
  
  // Test and demo directories
  TEST_DIR: process.env.TEST_DIR || './test_output',
  DEMO_DIR: process.env.DEMO_DIR || './demo_output',
  
  // API settings
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 30000,
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES) || 3,
  
  // Default model settings
  DEFAULT_MODEL: process.env.DEFAULT_MODEL,
  DEFAULT_ASPECT_RATIO: process.env.DEFAULT_ASPECT_RATIO || '1:1',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  VERBOSE: process.env.VERBOSE === 'true'
};

/**
 * Validate required environment variables
 */
export function validateEnvironment() {
  const errors = [];
  
  if (!ENV_CONFIG.GOOGLE_API_KEY) {
    errors.push('GOOGLE_API_KEY is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
  
  return true;
}

/**
 * Get API key for a specific service
 */
export function getApiKey(service) {
  switch (service.toLowerCase()) {
    case 'google':
    case 'gemini':
      return ENV_CONFIG.GOOGLE_API_KEY;
    case 'openai':
    case 'dall-e':
      return ENV_CONFIG.OPENAI_API_KEY;
    case 'stability':
      return ENV_CONFIG.STABILITY_API_KEY;
    default:
      throw new Error(`Unknown service: ${service}`);
  }
}

/**
 * Check if a service is available
 */
export function isServiceAvailable(service) {
  try {
    const apiKey = getApiKey(service);
    return !!apiKey;
  } catch {
    return false;
  }
}

/**
 * Get available services
 */
export function getAvailableServices() {
  const services = [];
  
  if (isServiceAvailable('google')) services.push('google');
  if (isServiceAvailable('openai')) services.push('openai');
  if (isServiceAvailable('stability')) services.push('stability');
  
  return services;
}

/**
 * Display environment status
 */
export function displayEnvironmentStatus() {
  console.log('🔧 Environment Configuration:');
  console.log('='.repeat(40));
  console.log(`📁 Output Directory: ${ENV_CONFIG.OUTPUT_DIR}`);
  console.log(`📁 Images Directory: ${ENV_CONFIG.IMAGES_DIR}`);
  console.log(`📁 Frames Directory: ${ENV_CONFIG.FRAMES_DIR}`);
  console.log(`📁 GIFs Directory: ${ENV_CONFIG.GIFS_DIR}`);
  console.log(`📁 Test Directory: ${ENV_CONFIG.TEST_DIR}`);
  console.log(`📁 Demo Directory: ${ENV_CONFIG.DEMO_DIR}`);
  console.log('');
  console.log('🔑 API Keys Status:');
  console.log(`  • Google Gemini: ${ENV_CONFIG.GOOGLE_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  • OpenAI DALL-E: ${ENV_CONFIG.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  • Stability AI: ${ENV_CONFIG.STABILITY_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log('');
  console.log('⚙️ Settings:');
  console.log(`  • Environment: ${ENV_CONFIG.NODE_ENV}`);
  console.log(`  • API Timeout: ${ENV_CONFIG.API_TIMEOUT}ms`);
  console.log(`  • Max Retries: ${ENV_CONFIG.MAX_RETRIES}`);
  console.log(`  • Default Model: ${ENV_CONFIG.DEFAULT_MODEL}`);
  console.log(`  • Default Aspect Ratio: ${ENV_CONFIG.DEFAULT_ASPECT_RATIO}`);
  console.log(`  • Log Level: ${ENV_CONFIG.LOG_LEVEL}`);
  console.log(`  • Verbose: ${ENV_CONFIG.VERBOSE}`);
  console.log('');
  console.log('🚀 Available Services:');
  const services = getAvailableServices();
  if (services.length > 0) {
    services.forEach(service => console.log(`  • ${service}: ✅ Available`));
  } else {
    console.log('  • No services available - check your API keys');
  }
}

export default ENV_CONFIG;
