#!/usr/bin/env node

/**
 * Simple API key test to verify the key format and validity
 */

import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

function testApiKey() {
    console.log('🔑 API Key Test');
    console.log('=' * 30);
    
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.log('❌ No API key found in environment variables');
        console.log('🔧 Make sure you have GOOGLE_API_KEY in your .env file');
        return;
    }
    
    console.log(`✅ API key found: ${apiKey.substring(0, 10)}...`);
    console.log(`📏 Key length: ${apiKey.length} characters`);
    
    // Check if it looks like a valid Google API key
    if (apiKey.startsWith('AIza')) {
        console.log('✅ Key format looks correct (starts with AIza)');
    } else {
        console.log('⚠️  Key format might be incorrect (should start with AIza)');
    }
    
    if (apiKey.length >= 35) {
        console.log('✅ Key length looks correct (35+ characters)');
    } else {
        console.log('⚠️  Key might be too short (should be 35+ characters)');
    }
    
    console.log('');
    console.log('🔧 If the key is still invalid, try:');
    console.log('1. Go to: https://makersuite.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Make sure to enable "Generative Language API"');
    console.log('4. Copy the new key to your .env file');
    console.log('5. Restart the application');
}

testApiKey();
