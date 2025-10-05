# 🍌 nano Banana GIF Generator - Troubleshooting Guide

## API Key Issues

### ❌ "API key not valid" Error

If you're getting this error, follow these steps:

#### 1. Get a Fresh API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the new key (starts with "AIza...")

#### 2. Update Your .env File
```bash
# Replace the old key with the new one
GOOGLE_API_KEY=AIza...your_new_key_here
```

#### 3. Verify API Permissions
Make sure your API key has:
- ✅ Generative Language API enabled
- ✅ Proper billing account (if required)
- ✅ No usage restrictions

#### 4. Test the Key
```bash
node test_api_key.js
```

### 🔧 Alternative Solutions

#### Option 1: Use OpenAI Instead
If Google API continues to have issues, you can use OpenAI DALL-E:

```bash
# Add to .env file
OPENAI_API_KEY=sk-proj-your_openai_key_here
```

#### Option 2: Use Stability AI
```bash
# Add to .env file
STABILITY_API_KEY=your_stability_key_here
```

#### Option 3: Use Placeholder Mode
```bash
# Add to .env file
USE_API=false
```

## Common Issues

### 🐛 "Module not found" Errors
```bash
# Make sure you're using Node.js 18+
node --version

# Reinstall dependencies
npm install
```

### 🐛 ES Module Errors
Make sure your `package.json` has:
```json
{
  "type": "module"
}
```

### 🐛 Environment Variables Not Loading
1. Make sure you have a `.env` file (not `env`)
2. Check the file is in the project root
3. Restart your terminal/application

## Testing Your Setup

### 1. Test API Key
```bash
node test_api_key.js
```

### 2. Test nano Banana Integration
```bash
node test_gemini_integration.js
```

### 3. Test Full GIF Generation
```bash
node index.js generate "a cat walking"
```

## Getting Help

### 📚 Documentation
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Gemini API Docs](https://ai.google.dev/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

### 🔗 Useful Links
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Stability AI Keys](https://platform.stability.ai/account/keys)

## Quick Fixes

### Reset Everything
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Test again
npm test
```

### Update API Key
1. Get new key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `.env` file
3. Restart application

### Use Fallback Mode
```bash
# Set in .env file
USE_API=false
```

This will use placeholder animations instead of AI generation.
