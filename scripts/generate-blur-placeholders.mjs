#!/usr/bin/env node
/**
 * Generate blur placeholders for images
 * Creates low-quality placeholders for better perceived performance
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const IMAGE_DIRS = ['photos', 'images']
const OUTPUT_FILE = path.join(process.cwd(), 'content/blur-placeholders.json')

/**
 * Generate a simple blur placeholder data URL
 * In production, you'd use sharp or similar to generate actual blurred images
 */
function generateBlurPlaceholder(imagePath) {
  // For now, return a simple gray placeholder
  // In a real implementation, you'd use sharp to create a tiny blurred version
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c+bMfwAGhAKD+6Hs7AAAAABJRU5ErkJggg=='
  return `data:image/png;base64,${base64}`
}

async function findImages(dir) {
  const images = []
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        images.push(...await findImages(fullPath))
      } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        const relativePath = path.relative(PUBLIC_DIR, fullPath)
        images.push('/' + relativePath.replace(/\\/g, '/'))
      }
    }
  } catch (error) {
    // Directory doesn't exist, skip
  }
  
  return images
}

async function main() {
  console.log('🖼️  Generating blur placeholders...')
  
  const allImages = []
  
  for (const dir of IMAGE_DIRS) {
    const dirPath = path.join(PUBLIC_DIR, dir)
    const images = await findImages(dirPath)
    allImages.push(...images)
  }
  
  console.log(`Found ${allImages.length} images`)
  
  const placeholders = {}
  
  for (const imagePath of allImages) {
    placeholders[imagePath] = generateBlurPlaceholder(imagePath)
  }
  
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(placeholders, null, 2))
  
  console.log(`✅ Generated ${Object.keys(placeholders).length} placeholders`)
  console.log(`📄 Saved to ${OUTPUT_FILE}`)
}

main().catch(console.error)
