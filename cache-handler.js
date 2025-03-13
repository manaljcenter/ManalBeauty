/**
 * Custom cache handler for Next.js
 * This enables persistent caching between builds
 */

const fs = require('fs');
const path = require('path');

// Define cache directory
const CACHE_DIR = process.env.NEXT_CACHE_DIR || path.join(process.cwd(), '.next/cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
    this.cacheDirectory = CACHE_DIR;
    console.log(`Cache directory: ${this.cacheDirectory}`);
  }

  async get(key) {
    const cacheFilePath = path.join(this.cacheDirectory, key);
    
    try {
      if (fs.existsSync(cacheFilePath)) {
        const data = fs.readFileSync(cacheFilePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`Error reading cache for key ${key}:`, error);
    }
    
    return null;
  }

  async set(key, data) {
    const cacheFilePath = path.join(this.cacheDirectory, key);
    
    try {
      // Ensure directory exists
      const dir = path.dirname(cacheFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(cacheFilePath, JSON.stringify(data), 'utf8');
    } catch (error) {
      console.error(`Error writing cache for key ${key}:`, error);
    }
  }
}; 