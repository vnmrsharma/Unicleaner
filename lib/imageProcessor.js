const sharp = require('sharp');
const ExifReader = require('exifreader');
const piexif = require('piexifjs');

class ImageCleaner {
  static async removeAllMetadata(imageBuffer) {
    try {
      // Get original metadata for analysis
      const originalMetadata = await this.getImageMetadata(imageBuffer);
      
      // Process with Sharp to remove metadata and create clean image
      const cleanedBuffer = await sharp(imageBuffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .modulate({
          brightness: 0.05,  // Very slight brightness increase
          saturation: 1.02,  // Minimal saturation enhancement
          hue: 0             // Keep original hue
        })
        .linear(1.05, 0)     // Very subtle contrast enhancement (minimal change)
        .sharpen()           // Add subtle sharpening
        .withMetadata(false) // Remove all metadata
        .jpeg({ quality: 95, progressive: true }) // Convert to high-quality JPEG
        .toBuffer();
      
      // Additional EXIF cleaning using piexif
      const cleanedImage = this.removeExifData(cleanedBuffer);
      
      // Verify metadata removal
      const cleanedMetadata = await this.getImageMetadata(cleanedImage);
      
      return {
        success: true,
        cleanedBuffer: cleanedImage,
        originalMetadata,
        cleanedMetadata,
        removedItems: this.compareMetadata(originalMetadata, cleanedMetadata)
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }
  
  static async getImageMetadata(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      let exifData = {};
      
      try {
        exifData = ExifReader.load(imageBuffer);
      } catch (exifError) {
        console.log('No EXIF data found or error reading EXIF:', exifError.message);
      }
      
      return {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        density: metadata.density,
        hasProfile: !!metadata.icc,
        hasAlpha: metadata.hasAlpha,
        orientation: metadata.orientation,
        exif: exifData,
        size: imageBuffer.length
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  static removeExifData(imageBuffer) {
    try {
      // Convert buffer to binary string for piexif
      const imageString = imageBuffer.toString('binary');
      
      // Remove EXIF data
      const cleanedString = piexif.remove(imageString);
      
      // Convert back to buffer
      return Buffer.from(cleanedString, 'binary');
    } catch (error) {
      console.log('EXIF removal with piexif failed, using original:', error.message);
      return imageBuffer;
    }
  }
  
  static compareMetadata(original, cleaned) {
    const removed = [];
    
    if (original.exif && Object.keys(original.exif).length > 0) {
      removed.push('EXIF metadata');
    }
    
    if (original.hasProfile) {
      removed.push('Color profile');
    }
    
    if (original.orientation && original.orientation !== 1) {
      removed.push('Orientation data');
    }
    
    if (original.density) {
      removed.push('Density information');
    }
    
    // Check for common copyright-related EXIF tags
    if (original.exif) {
      const copyrightTags = ['Copyright', 'Artist', 'Software', 'Make', 'Model', 'DateTime'];
      copyrightTags.forEach(tag => {
        if (original.exif[tag]) {
          removed.push(`${tag} information`);
        }
      });
    }
    
    return removed;
  }
}

module.exports = ImageCleaner; 
