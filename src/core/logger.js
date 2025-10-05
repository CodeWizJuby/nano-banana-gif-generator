/**
 * Logging utility for nano Banana GIF Generator
 * Provides consistent logging across the application
 */

export class Logger {
  constructor(prefix = '🍌') {
    this.prefix = prefix;
  }

  info(message, ...args) {
    console.log(`${this.prefix} ${message}`, ...args);
  }

  success(message, ...args) {
    console.log(`✅ ${message}`, ...args);
  }

  warning(message, ...args) {
    console.log(`⚠️  ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`❌ ${message}`, ...args);
  }

  debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 ${message}`, ...args);
    }
  }

  separator(char = '─', length = 60) {
    console.log(char.repeat(length));
  }

  header(title, char = '=') {
    console.log('');
    console.log(char.repeat(60));
    console.log(`${this.prefix} ${title}`);
    console.log(char.repeat(60));
    console.log('');
  }
}

// Create default logger instance
export const logger = new Logger();

export default Logger;
