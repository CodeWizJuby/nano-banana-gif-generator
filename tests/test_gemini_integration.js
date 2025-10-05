#!/usr/bin/env node

/**
 * Test nano Banana integration using pure Node.js
 * Based on the converted code from Python to Node.js
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testNanoBananaIntegration() {
    console.log('🍌 Testing nano Banana Integration (Node.js)');
    console.log('=' * 50);
    
    // Check API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.log('❌ No Google API key found');
        console.log('🔑 Add GOOGLE_API_KEY to your .env file');
        console.log('📝 Get your key at: https://makersuite.google.com/app/apikey');
        return;
    }
    
    console.log(`✅ Google API key found: ${apiKey.substring(0, 10)}...`);
    
    try {
        // Initialize Gemini with the new API
        const ai = new GoogleGenAI({
            apiKey: apiKey,
        });
        
        console.log('🎨 Testing Gemini 2.5 Flash image generation...');
        
        const prompt = "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation";
        
        // For testing without a reference image, we'll use text-only generation first
        console.log('📝 Prompt:', prompt);
        
        // Try text generation first to test the connection
        const modelName = process.env.GOOGLE_MODEL || "gemini-2.5-flash-image";
        console.log(`🔧 Environment GOOGLE_MODEL: ${modelName}`);
        if (!modelName) {
            throw new Error("GOOGLE_MODEL environment variable is not set");
        }
        
        // Use the new Google GenAI API structure
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        
        const text = response.candidates[0].content.parts[0].text;
        
        console.log('✅ Gemini API connection successful!');
        console.log('🍌 Generated description:');
        console.log('');
        console.log('─'.repeat(60));
        console.log(text);
        console.log('─'.repeat(60));
        console.log('');
        
        // Now test image generation (if available)
        console.log('🎨 Testing image generation...');
        
        try {
            // Use the same response for image generation
            const parts = response.candidates[0].content.parts;
            let imageSaved = false;
            
            for (const part of parts) {
                if (part.text) {
                    console.log('📄 Text response:', part.text);
                } else if (part.inlineData?.data) {
                    const mime = part.inlineData.mimeType || "image/png";
                    const ext = mime.split("/")[1] || "png";
                    const outputPath = path.resolve(`generated_image.${ext}`);
                    fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, "base64"));
                    console.log('✅ Image saved:', outputPath);
                    imageSaved = true;
                }
            }
            
            if (!imageSaved) {
                console.log('⚠️  No image data returned - image generation may not be available yet');
                console.log('💡 Use the generated description at: https://gemini.google/overview/image-generation/');
            }
            
        } catch (imageError) {
            console.log('⚠️  Image generation not available yet:', imageError.message);
            console.log('💡 Use the generated description at: https://gemini.google/overview/image-generation/');
        }
        
        console.log('');
        console.log('🎉 nano Banana integration test complete!');
        console.log('🚀 You can now use the full GIF generator');
        
    } catch (error) {
        console.log('❌ Gemini API test failed:');
        console.log(`   ${error.message}`);
        console.log('');
        
        if (error.message.includes('404') || error.message.includes('not found')) {
            console.log('🔧 API Key Issue - Most likely causes:');
            console.log('1. ❌ No valid Google API key found');
            console.log('2. ❌ API key doesn\'t have Generative AI permissions');
            console.log('3. ❌ Wrong API key format');
            console.log('');
            console.log('✅ How to fix:');
            console.log('1. Go to: https://makersuite.google.com/app/apikey');
            console.log('2. Create a new API key');
            console.log('3. Copy the key (starts with "AIza...")');
            console.log('4. Add to .env file: GEMINI_API_KEY=AIza...');
            console.log('5. Make sure the key has Generative AI API access');
        } else if (error.message.includes('quota')) {
            console.log('🔧 Quota Issue:');
            console.log('• Your API key has exceeded its quota');
            console.log('• Check usage at: https://console.cloud.google.com/');
        } else {
            console.log('🔧 General Troubleshooting:');
            console.log('• Check your API key at: https://makersuite.google.com/app/apikey');
            console.log('• Verify your .env file has: GEMINI_API_KEY=your_actual_key');
            console.log('• Ensure your API key has proper permissions');
        }
    }
}

// Run the test
testNanoBananaIntegration().catch(console.error);
