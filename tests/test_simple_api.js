#!/usr/bin/env node

/**
 * Simple API key test with minimal request
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

async function testSimpleAPI() {
    const apiKey = "AIzaSyBxOL-Lvrw8gboNxb1xMwC1QbF-sW_049o";
    
    console.log('🧪 Testing API key with minimal request...');
    console.log(`Key: ${apiKey.substring(0, 10)}...`);
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try the model from environment or default
        const modelName = process.env.GOOGLE_MODEL || "gemini-2.5-flash-image-preview";
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ API key is working!');
        console.log('Response:', text);
        
    } catch (error) {
        console.log('❌ API key test failed:');
        console.log('Error:', error.message);
        
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('\n🔧 Possible solutions:');
            console.log('1. Set up billing in Google AI Studio');
            console.log('2. Create a new API key');
            console.log('3. Check project permissions');
            console.log('4. Wait a few minutes for key activation');
        }
    }
}

testSimpleAPI();
