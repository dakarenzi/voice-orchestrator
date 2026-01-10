#!/bin/bash
# accessibility-test.sh - Quick accessibility verification

echo "🧪 VoiceOrchestrator Accessibility Test Suite"
echo "=============================================="

# 1. Build the project
echo "
📦 Building project..."
npm run build

# 2. Start dev server
echo "
🚀 Starting dev server..."
npm run dev &
DEV_PID=$!
sleep 5

# 3. Run Lighthouse audit
echo "
🔍 Running Lighthouse accessibility audit..."
npx lighthouse http://localhost:5173 \
  --only-categories=accessibility \
  --chrome-flags="--headless" \
  --output=html \
  --output-path=./accessibility-report.html

# 4. Open report
echo "
📊 Opening accessibility report..."
open ./accessibility-report.html

# 5. Cleanup
kill $DEV_PID

echo "
✅ Test complete! Check accessibility-report.html"
