/**
 * nano Banana Integration using pure Node.js
 * Enhanced with Gemini Image Understanding capabilities
 * Supports comprehensive image generation, editing, and analysis features
 * Based on Gemini API documentation: https://ai.google.dev/gemini-api/docs/image-generation
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

export class NanoBananaIntegration {
    constructor(apiKey) {
        this.ai = new GoogleGenAI({
            apiKey: apiKey,
        });
        this.supportedImageFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
        
        // Supported aspect ratios from Gemini API documentation
        this.supportedAspectRatios = {
            '1:1': { resolution: '1024x1024', tokens: 1290 },
            '2:3': { resolution: '832x1248', tokens: 1290 },
            '3:2': { resolution: '1248x832', tokens: 1290 },
            '3:4': { resolution: '864x1184', tokens: 1290 },
            '4:3': { resolution: '1184x864', tokens: 1290 },
            '4:5': { resolution: '896x1152', tokens: 1290 },
            '5:4': { resolution: '1152x896', tokens: 1290 },
            '9:16': { resolution: '768x1344', tokens: 1290 },
            '16:9': { resolution: '1344x768', tokens: 1290 },
            '21:9': { resolution: '1536x672', tokens: 1290 }
        };
        
        // Available models
        this.models = {
            'gemini-2.5-flash-image': 'Default recommendation for flexibility and contextual understanding',
            'imagen-4': 'Specialized for photorealistic images and advanced typography',
            'imagen-4-ultra': 'Best image quality for advanced use cases'
        };
    }

    /**
     * Generate an image using Gemini 2.5 Flash Image model with comprehensive features
     * Supports text-to-image, image editing, multi-image composition, and iterative refinement
     * @param {string} prompt - Text prompt for image generation
     * @param {Object} options - Generation options
     * @param {string} options.referenceImagePath - Optional reference image path for editing
     * @param {string[]} options.additionalImages - Array of additional image paths for composition
     * @param {string} options.outputPath - Optional output path for the generated image
     * @param {string} options.model - Model to use (gemini-2.5-flash-image, imagen-4, imagen-4-ultra)
     * @param {string} options.aspectRatio - Aspect ratio (1:1, 16:9, 4:3, etc.)
     * @param {string} options.responseModalities - Response modalities (Image, Text, or both)
     * @param {boolean} options.iterative - Enable iterative refinement
     * @param {string} options.previousImagePath - Path to previous image for iterative refinement
     * @returns {Promise<Object>} Generation result with image path and metadata
     */
    async generateImage(prompt, options = {}) {
        try {
            const {
                referenceImagePath = null,
                additionalImages = [],
                outputPath = null,
                model = "gemini-2.5-flash-image",
                aspectRatio = "1:1",
                responseModalities = ["Image"],
                iterative = false,
                previousImagePath = null
            } = options;

            console.log(`🍌 Generating image with ${model}...`);
            console.log(`📝 Prompt: ${prompt}`);
            console.log(`📐 Aspect Ratio: ${aspectRatio}`);
            console.log(`🔄 Iterative: ${iterative}`);

            // Validate aspect ratio
            if (!this.supportedAspectRatios[aspectRatio]) {
                throw new Error(`Unsupported aspect ratio: ${aspectRatio}. Supported: ${Object.keys(this.supportedAspectRatios).join(', ')}`);
            }

            let contents = [];
            
            // Add reference image if provided (for image editing)
            if (referenceImagePath && fs.existsSync(referenceImagePath)) {
                console.log(`🖼️ Using reference image: ${referenceImagePath}`);
                const base64Image = fs.readFileSync(referenceImagePath, { encoding: "base64" });
                const mimeType = this.getMimeType(referenceImagePath);
                
                contents.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image,
                    },
                });
            }

            // Add additional images for multi-image composition
            for (const imagePath of additionalImages) {
                if (fs.existsSync(imagePath)) {
                    console.log(`🖼️ Adding composition image: ${imagePath}`);
                    const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });
                    const mimeType = this.getMimeType(imagePath);
                    
                    contents.push({
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Image,
                        },
                    });
                }
            }

            // Add previous image for iterative refinement
            if (iterative && previousImagePath && fs.existsSync(previousImagePath)) {
                console.log(`🔄 Using previous image for iterative refinement: ${previousImagePath}`);
                const base64Image = fs.readFileSync(previousImagePath, { encoding: "base64" });
                const mimeType = this.getMimeType(previousImagePath);
                
                contents.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image,
                    },
                });
            }

            // Add text prompt
            contents.push({ text: prompt });

            // Configure generation parameters
            const config = {
                imageConfig: {
                    aspectRatio: aspectRatio
                },
                responseModalities: responseModalities
            };

            console.log(`🔧 Using model: ${model}`);
            console.log(`⚙️ Config:`, JSON.stringify(config, null, 2));

            // Generate content using the enhanced API
            const response = await this.ai.models.generateContent({
                model: model,
                contents: contents,
                config: config
            });

            // Process the response
            const parts = response?.candidates?.[0]?.content?.parts ?? [];
            let savedImagePath = null;
            let generatedText = null;
            
            for (const part of parts) {
                if (part.text) {
                    generatedText = part.text;
                    console.log(`📄 Generated description: ${part.text}`);
                } else if (part.inlineData?.data) {
                    const mime = part.inlineData.mimeType || "image/png";
                    const ext = mime.split("/")[1] || "png";
                    const finalOutputPath = outputPath || path.resolve(`output/images/generated_image_${Date.now()}.${ext}`);
                    
                    fs.writeFileSync(finalOutputPath, Buffer.from(part.inlineData.data, "base64"));
                    console.log(`✅ Image saved: ${finalOutputPath}`);
                    savedImagePath = finalOutputPath;
                }
            }

            if (!savedImagePath) {
                throw new Error("No image data found in response");
            }

            return {
                imagePath: savedImagePath,
                text: generatedText,
                model: model,
                aspectRatio: aspectRatio,
                resolution: this.supportedAspectRatios[aspectRatio].resolution,
                tokens: this.supportedAspectRatios[aspectRatio].tokens
            };
            
        } catch (error) {
            console.error(`❌ Error generating image: ${error.message}`);
            throw error;
        }
    }

    /**
     * Text-to-Image Generation
     * Generate high-quality images from simple or complex text descriptions
     * @param {string} prompt - Text description for image generation
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generation result
     */
    async textToImage(prompt, options = {}) {
        return await this.generateImage(prompt, {
            ...options,
            model: options.model || "gemini-2.5-flash-image"
        });
    }

    /**
     * Image + Text-to-Image (Editing)
     * Provide an image and use text prompts to add, remove, or modify elements
     * @param {string} imagePath - Path to the reference image
     * @param {string} editPrompt - Text prompt for editing instructions
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generation result
     */
    async imageEditing(imagePath, editPrompt, options = {}) {
        return await this.generateImage(editPrompt, {
            ...options,
            referenceImagePath: imagePath,
            model: options.model || "gemini-2.5-flash-image"
        });
    }

    /**
     * Multi-Image to Image (Composition & Style Transfer)
     * Use multiple input images to compose a new scene or transfer style
     * @param {string[]} imagePaths - Array of input image paths
     * @param {string} compositionPrompt - Prompt for composition instructions
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generation result
     */
    async multiImageComposition(imagePaths, compositionPrompt, options = {}) {
        return await this.generateImage(compositionPrompt, {
            ...options,
            additionalImages: imagePaths,
            model: options.model || "gemini-2.5-flash-image"
        });
    }

    /**
     * Iterative Refinement
     * Engage in a conversation to progressively refine your image over multiple turns
     * @param {string} prompt - Refinement prompt
     * @param {string} previousImagePath - Path to the previous image
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generation result
     */
    async iterativeRefinement(prompt, previousImagePath, options = {}) {
        return await this.generateImage(prompt, {
            ...options,
            iterative: true,
            previousImagePath: previousImagePath,
            model: options.model || "gemini-2.5-flash-image"
        });
    }

    /**
     * High-Fidelity Text Rendering
     * Generate images that contain legible and well-placed text
     * @param {string} textPrompt - Text to render in the image
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generation result
     */
    async textRendering(textPrompt, options = {}) {
        const enhancedPrompt = `${textPrompt}. Ensure the text is legible, well-placed, and high-quality. Perfect typography and readability.`;
        return await this.generateImage(enhancedPrompt, {
            ...options,
            model: options.model || "imagen-4" // Use Imagen for better text rendering
        });
    }

    /**
     * Style Transfer
     * Apply a specific design or texture from one image to another
     * @param {string} sourceImagePath - Path to the source image
     * @param {string} styleImagePath - Path to the style reference image
     * @param {string} stylePrompt - Description of the style transfer
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generation result
     */
    async styleTransfer(sourceImagePath, styleImagePath, stylePrompt, options = {}) {
        const enhancedPrompt = `Apply the style from the reference image to the main image. ${stylePrompt}. Maintain the main subject but apply the new style and design elements.`;
        return await this.generateImage(enhancedPrompt, {
            ...options,
            referenceImagePath: sourceImagePath,
            additionalImages: [styleImagePath],
            model: options.model || "gemini-2.5-flash-image"
        });
    }

    /**
     * Generate images with Imagen model for specialized tasks
     * @param {string} prompt - Text prompt for image generation
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generation result
     */
    async generateWithImagen(prompt, options = {}) {
        const model = options.imagenVersion === 'ultra' ? 'imagen-4-ultra' : 'imagen-4';
        return await this.generateImage(prompt, {
            ...options,
            model: model
        });
    }

    /**
     * Generate multiple images for animation frames
     * @param {string} basePrompt - Base prompt for the animation
     * @param {number} frameCount - Number of frames to generate
     * @param {string} outputDir - Directory to save frames
     * @returns {Promise<string[]>} Array of generated image paths
     */
    async generateAnimationFrames(basePrompt, frameCount, outputDir = './output/frames', options = {}) {
        const framePaths = [];
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        for (let i = 0; i < frameCount; i++) {
            const progress = i / (frameCount - 1);
            const framePrompt = this.createFramePrompt(basePrompt, i, frameCount, progress);
            const outputPath = path.join(outputDir, `frame_${String(i).padStart(3, '0')}_${Date.now()}.png`);
            
            try {
                const result = await this.generateImage(framePrompt, {
                    ...options,
                    outputPath: outputPath
                });
                framePaths.push(result.imagePath);
                console.log(`✅ Generated frame ${i + 1}/${frameCount}: ${result.imagePath}`);
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
     * Analyze an image using Gemini's image understanding capabilities
     * @param {string} imagePath - Path to the image to analyze
     * @param {string} prompt - Analysis prompt (e.g., "Caption this image", "What objects do you see?")
     * @returns {Promise<string>} Analysis result
     */
    async analyzeImage(imagePath, prompt = "Analyze this image and describe what you see") {
        try {
            console.log(`🔍 Analyzing image with Gemini image understanding...`);
            console.log(`📝 Prompt: ${prompt}`);
            console.log(`🖼️ Image: ${imagePath}`);

            if (!fs.existsSync(imagePath)) {
                throw new Error(`Image file not found: ${imagePath}`);
            }

            const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });
            const mimeType = this.getMimeType(imagePath);

            if (!this.supportedImageFormats.includes(mimeType)) {
                throw new Error(`Unsupported image format: ${mimeType}. Supported formats: ${this.supportedImageFormats.join(', ')}`);
            }

            const contents = [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image,
                    },
                },
                { text: prompt },
            ];

            const modelName = process.env.GOOGLE_MODEL || "gemini-2.5-flash";
            console.log(`🔧 Using model: ${modelName}`);

            const response = await this.ai.models.generateContent({
                model: modelName,
                contents: contents,
            });

            const analysisResult = response.text || "No analysis result found";
            console.log(`✅ Analysis completed: ${analysisResult}`);
            
            return analysisResult;

        } catch (error) {
            console.error(`❌ Error analyzing image: ${error.message}`);
            throw error;
        }
    }

    /**
     * Perform object detection on an image
     * @param {string} imagePath - Path to the image
     * @returns {Promise<Object>} Object detection results
     */
    async detectObjects(imagePath) {
        const prompt = "Identify and describe all objects in this image. Provide a detailed list with their locations and characteristics.";
        return await this.analyzeImage(imagePath, prompt);
    }

    /**
     * Generate image captions
     * @param {string} imagePath - Path to the image
     * @param {string} style - Caption style (detailed, brief, artistic, etc.)
     * @returns {Promise<string>} Generated caption
     */
    async generateCaption(imagePath, style = "detailed") {
        const prompts = {
            detailed: "Generate a detailed, descriptive caption for this image.",
            brief: "Generate a brief, concise caption for this image.",
            artistic: "Generate an artistic, creative caption for this image.",
            technical: "Generate a technical description of this image."
        };

        const prompt = prompts[style] || prompts.detailed;
        return await this.analyzeImage(imagePath, prompt);
    }

    /**
     * Answer questions about an image
     * @param {string} imagePath - Path to the image
     * @param {string} question - Question about the image
     * @returns {Promise<string>} Answer to the question
     */
    async answerQuestion(imagePath, question) {
        return await this.analyzeImage(imagePath, question);
    }

    /**
     * Perform image-to-image generation with style transfer
     * @param {string} referenceImagePath - Path to the reference image
     * @param {string} stylePrompt - Style description for the transformation
     * @param {string} outputPath - Output path for the generated image
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Generation result with image path and metadata
     */
    async imageToImageGeneration(referenceImagePath, stylePrompt, outputPath = null, options = {}) {
        try {
            console.log(`🎨 Performing image-to-image generation with style transfer...`);
            console.log(`📝 Style prompt: ${stylePrompt}`);
            console.log(`🖼️ Reference image: ${referenceImagePath}`);

            if (!fs.existsSync(referenceImagePath)) {
                throw new Error(`Reference image file not found: ${referenceImagePath}`);
            }

            const enhancedPrompt = `Transform this image with the following style: ${stylePrompt}. Maintain the main subject but apply the new style.`;
            
            return await this.imageEditing(referenceImagePath, enhancedPrompt, {
                ...options,
                outputPath: outputPath
            });

        } catch (error) {
            console.error(`❌ Error in image-to-image generation: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create animation frames from a reference image with different styles
     * @param {string} referenceImagePath - Path to the reference image
     * @param {string} animationPrompt - Animation description
     * @param {number} frameCount - Number of frames to generate
     * @param {string} outputDir - Directory to save frames
     * @returns {Promise<string[]>} Array of generated image paths
     */
    async generateStyleAnimationFrames(referenceImagePath, animationPrompt, frameCount, outputDir = './output/frames', options = {}) {
        const framePaths = [];
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        for (let i = 0; i < frameCount; i++) {
            const progress = i / (frameCount - 1);
            const frameStyle = this.createAnimationStylePrompt(animationPrompt, i, frameCount, progress);
            const outputPath = path.join(outputDir, `style_frame_${String(i).padStart(3, '0')}_${Date.now()}.png`);
            
            try {
                const result = await this.imageToImageGeneration(referenceImagePath, frameStyle, outputPath, options);
                framePaths.push(result.imagePath);
                console.log(`✅ Generated style frame ${i + 1}/${frameCount}: ${result.imagePath}`);
            } catch (error) {
                console.error(`❌ Error generating style frame ${i + 1}: ${error.message}`);
                throw error;
            }
        }

        return framePaths;
    }

    /**
     * Create animation style prompt for different frames
     * @param {string} baseAnimationPrompt - Base animation prompt
     * @param {number} frameIndex - Current frame index
     * @param {number} totalFrames - Total number of frames
     * @param {number} progress - Animation progress (0-1)
     * @returns {string} Frame-specific style prompt
     */
    createAnimationStylePrompt(baseAnimationPrompt, frameIndex, totalFrames, progress) {
        const progressPercent = Math.round(progress * 100);
        
        // Detect animation type
        const animationType = this.detectAnimationType(baseAnimationPrompt);
        
        switch (animationType) {
            case 'walking':
                const walkStyles = ['dynamic pose', 'mid-motion blur', 'dynamic pose', 'motion trail'];
                const walkStyle = walkStyles[frameIndex % walkStyles.length];
                return `${baseAnimationPrompt}, ${walkStyle}, step ${frameIndex + 1} of walking cycle, consistent character and background`;
                
            case 'flying':
                const flyStyles = ['wings extended up', 'motion blur', 'wings extended down', 'motion trail'];
                const flyStyle = flyStyles[frameIndex % flyStyles.length];
                return `${baseAnimationPrompt}, ${flyStyle}, flight position ${frameIndex + 1}, same character and environment`;
                
            case 'dancing':
                const danceStyles = ['elegant pose', 'motion blur', 'dynamic movement', 'graceful flow'];
                const danceStyle = danceStyles[frameIndex % danceStyles.length];
                return `${baseAnimationPrompt}, ${danceStyle}, dance pose ${frameIndex + 1}, same dancer and setting`;
                
            case 'transformation':
                if (frameIndex === 0) {
                    return `${baseAnimationPrompt}, initial state, beginning of transformation, original style`;
                } else if (frameIndex === totalFrames - 1) {
                    return `${baseAnimationPrompt}, final state, transformation complete, new style fully applied`;
                } else {
                    return `${baseAnimationPrompt}, ${progressPercent}% transformed, mid-transformation stage ${frameIndex}, mixed styles`;
                }
                
            default:
                const generalStyles = ['static pose', 'subtle motion', 'dynamic pose', 'flowing movement'];
                const generalStyle = generalStyles[frameIndex % generalStyles.length];
                return `${baseAnimationPrompt}, ${generalStyle}, frame ${frameIndex + 1} of ${totalFrames}, consistent scene and lighting`;
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
            '.webp': 'image/webp',
            '.heic': 'image/heic',
            '.heif': 'image/heif'
        };
        return mimeTypes[ext] || 'image/png';
    }

    /**
     * Get available aspect ratios
     * @returns {Object} Available aspect ratios with their properties
     */
    getAvailableAspectRatios() {
        return this.supportedAspectRatios;
    }

    /**
     * Get available models
     * @returns {Object} Available models with their descriptions
     */
    getAvailableModels() {
        return this.models;
    }

    /**
     * Validate aspect ratio
     * @param {string} aspectRatio - Aspect ratio to validate
     * @returns {boolean} True if valid
     */
    isValidAspectRatio(aspectRatio) {
        return this.supportedAspectRatios.hasOwnProperty(aspectRatio);
    }

    /**
     * Get model recommendation based on task type
     * @param {string} taskType - Type of task (photorealistic, artistic, text, etc.)
     * @returns {string} Recommended model
     */
    getRecommendedModel(taskType) {
        const recommendations = {
            'photorealistic': 'imagen-4',
            'artistic': 'gemini-2.5-flash-image',
            'text': 'imagen-4',
            'editing': 'gemini-2.5-flash-image',
            'composition': 'gemini-2.5-flash-image',
            'style_transfer': 'gemini-2.5-flash-image',
            'ultra_quality': 'imagen-4-ultra'
        };
        return recommendations[taskType] || 'gemini-2.5-flash-image';
    }

    /**
     * Create a conversation session for iterative refinement
     * @param {string} initialPrompt - Initial prompt
     * @param {Object} options - Initial options
     * @returns {Object} Session object for iterative refinement
     */
    createIterativeSession(initialPrompt, options = {}) {
        const self = this;
        return {
            prompt: initialPrompt,
            options: options,
            iterations: [],
            currentImage: null,
            
            async refine(refinementPrompt) {
                const result = await self.iterativeRefinement(
                    refinementPrompt, 
                    this.currentImage, 
                    this.options
                );
                this.iterations.push({
                    prompt: refinementPrompt,
                    result: result
                });
                this.currentImage = result.imagePath;
                return result;
            },
            
            async reset() {
                this.iterations = [];
                this.currentImage = null;
                const result = await self.textToImage(this.prompt, this.options);
                this.currentImage = result.imagePath;
                return result;
            }
        };
    }
}

export default NanoBananaIntegration;
