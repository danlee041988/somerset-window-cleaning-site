#!/bin/bash

# Image Compression Script for Somerset Window Cleaning
# Reduces image file sizes while maintaining professional quality

echo "🖼️  Starting image compression for Somerset Window Cleaning..."

# Create backup directory
mkdir -p /Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/originals

# Function to compress and backup image
compress_image() {
    local file="$1"
    local quality="$2"
    local backup_file="/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/originals/$(basename "$file")"
    
    # Create backup if it doesn't exist
    if [ ! -f "$backup_file" ]; then
        echo "📦 Backing up: $(basename "$file")"
        cp "$file" "$backup_file"
    fi
    
    # Get original size
    original_size=$(du -h "$file" | cut -f1)
    
    # Compress image using ImageMagick (if available) or sips (macOS native)
    if command -v magick &> /dev/null; then
        echo "🔧 Compressing with ImageMagick: $(basename "$file")"
        magick "$file" -quality "$quality" -strip -resize '1920x1920>' "$file"
    elif command -v sips &> /dev/null; then
        echo "🔧 Compressing with sips: $(basename "$file")"
        sips -s format jpeg -s formatOptions "$quality" --resampleHeightWidthMax 1920 "$file" --out "$file"
    else
        echo "⚠️  No compression tool available. Please install ImageMagick or use macOS sips"
        return 1
    fi
    
    # Get new size
    new_size=$(du -h "$file" | cut -f1)
    echo "✅ $(basename "$file"): $original_size → $new_size"
}

# Compress critical large images
echo ""
echo "🎯 Compressing critical large images..."

# Ultra-large images (8MB+) - aggressive compression
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/Window Clean.jpeg" 75
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/Solar Panel .jpeg" 75

# Large images (6MB) - moderate compression  
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/IMG_0880.jpeg" 80

# DJI drone photos (3.6-3.8MB) - light compression to maintain quality
echo ""
echo "🚁 Compressing DJI drone photos..."
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/Main Hero.JPG" 85
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/DJI_0024.JPG" 85
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/DJI_0045.JPG" 85
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/DJI_0047.JPG" 85
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/DJI_0052.JPG" 85
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/DJI_0064.JPG" 85
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/DJI_0070.JPG" 85
compress_image "/Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/DJI_0092.JPG" 85

echo ""
echo "📊 Compression Summary:"
echo "Original total: ~41.8MB"
du -ch /Users/danlee/CODEX_SWC_WEBSITE/public/images/photos/*.{JPG,jpeg} 2>/dev/null | tail -1

echo ""
echo "🎉 Image compression complete!"
echo "💡 Next steps:"
echo "   1. Test image quality on localhost:3000"
echo "   2. Run 'npm run build' to generate WebP/AVIF formats"
echo "   3. Deploy to see performance improvements"
echo ""
echo "📁 Original images backed up to: public/images/photos/originals/"