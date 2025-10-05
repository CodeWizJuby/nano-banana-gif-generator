/**
 * File utilities for nano Banana GIF Generator
 * Handles file operations, validation, and management
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { CONFIG } from '../core/config.js';
import { logger } from '../core/logger.js';

export class FileUtils {
  /**
   * Ensure directory exists
   * @param {string} dirPath - Directory path
   */
  static async ensureDirectory(dirPath) {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
      logger.debug(`Directory ensured: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to create directory ${dirPath}:`, error.message);
      throw error;
    }
  }

  /**
   * Get file extension
   * @param {string} filePath - File path
   * @returns {string} File extension
   */
  static getExtension(filePath) {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * Get MIME type from file extension
   * @param {string} filePath - File path
   * @returns {string} MIME type
   */
  static getMimeType(filePath) {
    const ext = this.getExtension(filePath);
    return CONFIG.mimeTypes[ext] || 'image/png';
  }

  /**
   * Check if file exists
   * @param {string} filePath - File path
   * @returns {boolean} True if file exists
   */
  static async exists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read file as buffer
   * @param {string} filePath - File path
   * @returns {Promise<Buffer>} File buffer
   */
  static async readFile(filePath) {
    try {
      return await fs.promises.readFile(filePath);
    } catch (error) {
      logger.error(`Failed to read file ${filePath}:`, error.message);
      throw error;
    }
  }

  /**
   * Write file from buffer
   * @param {string} filePath - File path
   * @param {Buffer} buffer - File buffer
   */
  static async writeFile(filePath, buffer) {
    try {
      await fs.promises.writeFile(filePath, buffer);
      logger.debug(`File written: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write file ${filePath}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete file
   * @param {string} filePath - File path
   */
  static async deleteFile(filePath) {
    try {
      await fs.promises.unlink(filePath);
      logger.debug(`File deleted: ${filePath}`);
    } catch (error) {
      logger.debug(`Failed to delete file ${filePath}:`, error.message);
      // Don't throw error for file deletion failures
    }
  }

  /**
   * Clean directory
   * @param {string} dirPath - Directory path
   */
  static async cleanDirectory(dirPath) {
    try {
      const files = await fs.promises.readdir(dirPath);
      for (const file of files) {
        await fs.promises.unlink(path.join(dirPath, file));
      }
      logger.debug(`Directory cleaned: ${dirPath}`);
    } catch (error) {
      logger.debug(`Failed to clean directory ${dirPath}:`, error.message);
    }
  }

  /**
   * Generate unique filename
   * @param {string} prefix - Filename prefix
   * @param {string} extension - File extension
   * @returns {string} Unique filename
   */
  static generateUniqueFilename(prefix = 'file', extension = '.png') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}${extension}`;
  }
}

export default FileUtils;
