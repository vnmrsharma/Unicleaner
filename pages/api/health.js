export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    status: 'ok', 
    message: 'UniCleaner API by Unineed is running',
    serverless: true,
    timestamp: new Date().toISOString()
  });
} 