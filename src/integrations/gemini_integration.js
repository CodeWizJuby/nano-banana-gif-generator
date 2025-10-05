/**
 * nano Banana Integration using pure Node.js
 * Based on the converted code from Python to Node.js
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

export class NanoBananaIntegration {
    constructor(apiKey) {
        this.ai = new GoogleGenAI({
            apiKey: apiKey,
        });
    }

    /**
     * Generate an image using nano Banana (Gemini 2.5 Flash)
     * @param {string} prompt - Text prompt for image generation
     * @param {string} referenceImagePath - Optional reference image path
     * @param {string} outputPath - Optional output path for the generated image
     * @returns {Promise<string>} Path to the generated image
     */
    async generateImage(prompt, referenceImagePath = null, outputPath = null) {
        try {
            console.log(`🍌 Generating image with nano Banana (Gemini 2.5 Flash)...`);
            console.log(`📝 Prompt: ${prompt}`);
            
            let contents;
            
            if (referenceImagePath && fs.existsSync(referenceImagePath)) {
                // Use reference image (nano Banana style editing)
                console.log(`🖼️ Using reference image: ${referenceImagePath}`);
                const base64Image = fs.readFileSync(referenceImagePath, { encoding: "base64" });
                const mimeType = this.getMimeType(referenceImagePath);
                
                contents = [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Image,
                        },
                    },
                    { text: prompt },
                ];
            } else {
                // Text-only generation
                contents = [{ text: prompt }];
            }
            
            const modelName = process.env.GOOGLE_MODEL || "gemini-2.5-flash-image";
            console.log(`🔧 Using model: ${modelName}`);
            if (!modelName) {
                throw new Error("GOOGLE_MODEL environment variable is not set");
            }
            
            // Use the new Google GenAI API structure
            const response = await this.ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            
            // Process the response using the new API format
            const parts = response?.candidates?.[0]?.content?.parts ?? [];
            let savedImagePath = null;
            
            for (const part of parts) {
                if (part.text) {
                    console.log(`📄 Generated description: ${part.text}`);
                } else if (part.inlineData?.data) {
                    const mime = part.inlineData.mimeType || "image/png";
                    const ext = mime.split("/")[1] || "png";
                    const finalOutputPath = outputPath || path.resolve(`generated_image_${Date.now()}.${ext}`);
                    
                    fs.writeFileSync(finalOutputPath, Buffer.from(part.inlineData.data, "base64"));
                    console.log(`✅ Image saved: ${finalOutputPath}`);
                    savedImagePath = finalOutputPath;
                }
            }
            
            if (!savedImagePath) {
                throw new Error("No image data found in response");
            }
            
            return savedImagePath;
            
        } catch (error) {
            console.error(`❌ Error generating image: ${error.message}`);
            throw error;
        }
    }

    /**
     * Generate multiple images for animation frames
     * @param {string} basePrompt - Base prompt for the animation
     * @param {number} frameCount - Number of frames to generate
     * @param {string} outputDir - Directory to save frames
     * @returns {Promise<string[]>} Array of generated image paths
     */
    async generateAnimationFrames(basePrompt, frameCount, outputDir = './temp') {
        const framePaths = [];
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        for (let i = 0; i < frameCount; i++) {
            const progress = i / (frameCount - 1);
            const framePrompt = this.createFramePrompt(basePrompt, i, frameCount, progress);
            const outputPath = path.join(outputDir, `frame_${String(i).padStart(3, '0')}.png`);
            
            try {
                const generatedPath = await this.generateImage(framePrompt, null, outputPath);
                framePaths.push(generatedPath);
                console.log(`✅ Generated frame ${i + 1}/${frameCount}: ${generatedPath}`);
            } catch (error) {
                console.error(`❌ Error generating frame ${i + 1}: ${error.message}`);
                throw error;
            }
        }
        
        return framePaths;
    }

    /**
     * Create a frame-specific prompt for animation
     * @param {string} basePrompt - Base prompt
     * @param {number} frameIndex - Current frame index
     * @param {number} totalFrames - Total number of frames
     * @param {number} progress - Animation progress (0-1)
     * @returns {string} Frame-specific prompt
     */
    createFramePrompt(basePrompt, frameIndex, totalFrames, progress) {
        const progressPercent = Math.round(progress * 100);
        
        // Detect animation type
        const animationType = this.detectAnimationType(basePrompt);
        
        switch (animationType) {
            case 'walking':
                const walkCycle = ['left foot forward', 'mid-stride', 'right foot forward', 'mid-stride'];
                const walkPhase = walkCycle[frameIndex % walkCycle.length];
                return `${basePrompt}, ${walkPhase}, step ${frameIndex + 1} of walking cycle, consistent character and background`;
                
            case 'flying':
                const flyPositions = ['wings up', 'wings mid-flap', 'wings down', 'wings mid-flap'];
                const flyPhase = flyPositions[frameIndex % flyPositions.length];
                return `${basePrompt}, ${flyPhase}, flight position ${frameIndex + 1}, same character and environment`;
                
            case 'dancing':
                const dancePositions = ['arms up', 'arms to side', 'arms down', 'arms crossed'];
                const dancePhase = dancePositions[frameIndex % dancePositions.length];
                return `${basePrompt}, ${dancePhase}, dance pose ${frameIndex + 1}, same dancer and setting`;
                
            case 'transformation':
                if (frameIndex === 0) {
                    return `${basePrompt}, initial state, beginning of transformation`;
                } else if (frameIndex === totalFrames - 1) {
                    return `${basePrompt}, final state, transformation complete`;
                } else {
                    return `${basePrompt}, ${progressPercent}% transformed, mid-transformation stage ${frameIndex}`;
                }
                
            default:
                const positions = ['center position', 'slightly left', 'slightly right', 'back to center'];
                const position = positions[frameIndex % positions.length];
                return `${basePrompt}, ${position}, frame ${frameIndex + 1} of ${totalFrames}, consistent scene and lighting`;
        }
    }

    /**
     * Detect animation type from prompt
     * @param {string} prompt - The prompt to analyze
     * @returns {string} Animation type
     */
    detectAnimationType(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.includes('walk') || lowerPrompt.includes('running') || lowerPrompt.includes('moving')) {
            return 'walking';
        } else if (lowerPrompt.includes('fly') || lowerPrompt.includes('flying') || lowerPrompt.includes('soar')) {
            return 'flying';
        } else if (lowerPrompt.includes('dance') || lowerPrompt.includes('dancing')) {
            return 'dancing';
        } else if (lowerPrompt.includes('grow') || lowerPrompt.includes('bloom') || lowerPrompt.includes('transform')) {
            return 'transformation';
        } else {
            return 'general';
        }
    }

    /**
     * Get MIME type from file extension
     * @param {string} filePath - Path to the file
     * @returns {string} MIME type
     */
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        };
        return mimeTypes[ext] || 'image/png';
    }
}

export default NanoBananaIntegration;
