import multer from 'multer';
import ImageCleaner from '../../lib/imageProcessor';

// Configure multer for serverless
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/bmp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, TIFF, WebP, and BMP are allowed.'));
    }
  }
});

// Helper to promisify multer
const uploadMiddleware = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Disable default Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse uploaded file
    await uploadMiddleware(req, res);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Analyze metadata without processing
    const metadata = await ImageCleaner.getImageMetadata(req.file.buffer);
    
    res.json({
      success: true,
      metadata: metadata
    });
    
  } catch (error) {
    console.error('Error analyzing metadata:', error);
    
    res.status(500).json({ 
      error: 'Failed to analyze metadata', 
      details: error.message 
    });
  }
} 