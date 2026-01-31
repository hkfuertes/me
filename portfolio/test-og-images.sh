#!/bin/bash

# Script to test OG image generation locally
# Usage: ./test-og-images.sh

set -e

OUTPUT_DIR="./og-test-images"
BASE_URL="http://localhost:4321"

echo "🎨 Testing OG Image Generation..."
echo "=================================="
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Test different types
echo "📝 Generating BLOG example..."
curl -s "$BASE_URL/og-image.png?title=Building%20Embedded%20Linux%20Systems&type=blog" \
  -o "$OUTPUT_DIR/blog-example.png"

echo "🚀 Generating PROJECT example..."
curl -s "$BASE_URL/og-image.png?title=Virtual%20Screen%20Display&type=project" \
  -o "$OUTPUT_DIR/project-example.png"

echo "🔧 Generating CONTRIBUTION example..."
curl -s "$BASE_URL/og-image.png?title=Fix%20USB%20Detection%20Bug&type=contribution" \
  -o "$OUTPUT_DIR/contribution-example.png"

# Test different title lengths
echo "📏 Generating SHORT title example..."
curl -s "$BASE_URL/og-image.png?title=Short&type=blog" \
  -o "$OUTPUT_DIR/short-title.png"

echo "📏 Generating MEDIUM title example..."
curl -s "$BASE_URL/og-image.png?title=This%20is%20a%20Medium%20Length%20Title%20Example&type=blog" \
  -o "$OUTPUT_DIR/medium-title.png"

echo "📏 Generating LONG title example..."
curl -s "$BASE_URL/og-image.png?title=This%20is%20an%20extremely%20long%20title%20that%20contains%20many%20words%20and%20should%20be%20handled%20gracefully&type=blog" \
  -o "$OUTPUT_DIR/long-title.png"

echo ""
echo "✅ Done! Images saved to: $OUTPUT_DIR/"
echo ""
echo "Generated files:"
ls -lh "$OUTPUT_DIR/"
echo ""
echo "🖼️  View images with:"
echo "   xdg-open $OUTPUT_DIR/blog-example.png"
echo "   # or use your favorite image viewer"
