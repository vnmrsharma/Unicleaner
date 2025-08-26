# UniCleaner - Serverless Edition

**Professional metadata removal tool by Unineed - Ready for Vercel deployment**

## 🚀 One-Click Vercel Deployment

This serverless version of UniCleaner is specifically optimized for deployment with **zero configuration required**.

## ✨ What's Included

### 🎯 **Serverless Architecture**
- **Next.js 14** with App Router
- **Vercel API Routes** (no Express server needed)
- **Automatic scaling** and **edge deployment**
- **Zero-config deployment**

### 🛠️ **Features**
- **Complete Metadata Removal**: EXIF, GPS, timestamps, device info
- **AI Background Removal**: Client-side background removal using advanced ML models
- **Digital Signature Cleaning**: Watermarks and embedded signatures
- **Image Enhancement**: 900x900 output with contrast and saturation boost
- **Privacy-First**: All processing in serverless functions and client-side
- **Drag & Drop Upload**: Modern React interface
- **Real-time Processing**: Fast serverless image processing

### 🔧 **Tech Stack**
- **Frontend**: Next.js 14 + React 18 + Tailwind CSS
- **Backend**: Vercel API Routes (serverless functions)
- **Image Processing**: Sharp + ExifReader + PiexifJS
- **Background Removal**: @imgly/background-removal (client-side AI)
- **File Handling**: Multer with memory storage
- **Deployment**: Vercel (optimized)

## 📁 Project Structure

```
Serverless/
├── components/           # React components
│   ├── Header.js
│   ├── Footer.js
│   ├── ImageUploader.js
│   ├── BackgroundRemover.js
│   ├── MetadataDisplay.js
│   └── ProcessingStatus.js
├── lib/                 # Utilities
│   └── imageProcessor.js
├── pages/               # Next.js pages & API routes
│   ├── api/
│   │   ├── health.js
│   │   ├── process-image.js
│   │   └── download/[filename].js
│   ├── _app.js
│   └── index.js
├── styles/
│   └── globals.css
├── next.config.js
├── vercel.json          # Vercel configuration
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🚀 **API Endpoints**

### `POST /api/process-image`
- **Purpose**: Process uploaded image and remove metadata
- **Input**: Multipart form data with `image` field
- **Output**: Processed image info and metadata analysis
- **Timeout**: 30 seconds (optimized for large images)

### `GET /api/download/[filename]`
- **Purpose**: Download processed image
- **Input**: Filename in URL
- **Output**: Clean image file (JPEG, 400x400)
- **Auto-cleanup**: Files deleted after download

### `GET /api/health`
- **Purpose**: Health check for the API
- **Output**: Status and timestamp

## ⚡ **Performance Optimizations**

- **Serverless Functions**: Auto-scaling based on demand
- **Edge Deployment**: Global CDN distribution
- **Memory Storage**: No disk I/O for uploads
- **Sharp Processing**: Optimized image processing
- **Automatic Cleanup**: Temporary files auto-deleted

## 🔒 **Security Features**

- **File Type Validation**: Only image formats allowed
- **Size Limits**: 50MB maximum file size
- **Memory Processing**: No permanent file storage
- **Automatic Cleanup**: Temporary files removed after processing
- **Rate Limiting**: Built-in Vercel protection

## 🌐 **Environment Variables**
No environment variables required! The app works out of the box on selverless free servers like Vercel. 

**Optional customizations**:
```bash
NEXT_PUBLIC_APP_NAME=UniCleaner
NEXT_PUBLIC_DEVELOPER=Unineed
```


## 🛠️ **Local Development**

```bash
cd Serverless
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎯 **What Makes This Version Special**

1. **Zero Configuration**: No environment setup needed
2. **Vercel Optimized**: Built specifically for Vercel's platform
3. **Automatic Scaling**: Handles traffic spikes seamlessly
4. **Global Distribution**: Fast loading worldwide
5. **Cost Effective**: Pay only for actual usage
6. **Easy Updates**: Deploy updates with git push
