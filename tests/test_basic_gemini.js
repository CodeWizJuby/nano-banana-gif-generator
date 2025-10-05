#!/usr/bin/env node

/**
 * Test with the most basic Gemini model
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

async function testBasicGemini() {
    const apiKey = "AIzaSyBxOL-Lvrw8gboNxb1xMwC1QbF-sW_049o";
    
    console.log('🧪 Testing with basic Gemini model...');
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try the model from environment or default
        const modelName = process.env.GOOGLE_MODEL || "gemini-2.5-flash-image-preview";
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ SUCCESS! API key is working!');
        console.log('Response:', text);
        
    } catch (error) {
        console.log('❌ Test failed:');
        console.log('Error:', error.message);
        
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('\n🔧 Your API key needs billing setup:');
            console.log('1. Go to: https://makersuite.google.com/app/apikey');
            console.log('2. Click "Set up billing" next to your API key');
            console.log('3. Add a payment method (even for free usage)');
            console.log('4. Wait a few minutes for activation');
        }
    }
}

testBasicGemini();
