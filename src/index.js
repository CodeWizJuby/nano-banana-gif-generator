#!/usr/bin/env node

/**
 * Main entry point for nano Banana GIF Generator
 * Professional CLI application for generating animated GIFs
 */

import * as dotenv from 'dotenv';
import { CLICommands } from './cli/commands.js';
import { logger } from './core/logger.js';

// Load environment variables
dotenv.config();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Main application
async function main() {
  try {
    const cli = new CLICommands();
    cli.parse();
  } catch (error) {
    logger.error('Application failed:', error.message);
    process.exit(1);
  }
}

// Run the application
main();
