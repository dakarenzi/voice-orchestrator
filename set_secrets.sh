#!/bin/bash

PROJECT_NAME="ai-agents-multi-tenant-gem"

echo "Setting up secrets for Cloudflare Pages project: $PROJECT_NAME"
echo "You will be prompted to paste your secret values. Input is hidden for security."
echo "--------------------------------------------------------------------------------"

echo "1. Setting DEEPGRAM_API_KEY..."
npx wrangler pages secret put DEEPGRAM_API_KEY --project-name "$PROJECT_NAME"

echo "2. Setting INWORLD_API_KEY..."
npx wrangler pages secret put INWORLD_API_KEY --project-name "$PROJECT_NAME"

echo "3. Setting INWORLD_SCENE..."
npx wrangler pages secret put INWORLD_SCENE --project-name "$PROJECT_NAME"

echo "4. Setting GEMINI_API_KEY..."
npx wrangler pages secret put GEMINI_API_KEY --project-name "$PROJECT_NAME"

echo "5. Setting ELEVENLABS_API_KEY (Optional - Press Ctrl+C to skip if you don't have it, or Enter a dummy value)..."
npx wrangler pages secret put ELEVENLABS_API_KEY --project-name "$PROJECT_NAME"

echo "--------------------------------------------------------------------------------"
echo "All secrets setup attempts finished."
