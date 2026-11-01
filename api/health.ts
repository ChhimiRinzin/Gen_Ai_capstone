import type { Request, Response } from 'express';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const groqKey = process.env.GROQ_API_KEY || '';
  const isGroqConfigured = Boolean(groqKey && !groqKey.startsWith('gsk_your') && groqKey.length > 10);

  return res.status(200).json({
    status: 'ok',
    app: 'RoadSentry AI',
    tagline: 'Intelligent Road Safety & Infrastructure Audit Intelligence',
    country: 'Kingdom of Bhutan',
    deployment_target: 'Vercel Production / AI Studio Full-Stack',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    groq: {
      configured: isGroqConfigured,
      text_model: process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile',
      vision_model: process.env.GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview',
      key_status: isGroqConfigured ? 'Valid Server-Side Secret Set' : 'Missing or Placeholder'
    },
    yolo_model: {
      architecture: 'Ultralytics YOLOv8 / ONNX Runtime Web',
      rdd_classes: ['D00 Longitudinal Crack', 'D10 Transverse Crack', 'D20 Alligator Crack', 'D40 Pothole'],
      engine_status: 'Ready (WASM/WebGL Web Baseline)'
    },
    database: {
      persistent_db: 'None (Strict Zero-Database Session Isolation)',
      storage_type: 'In-Memory Ephemeral React Session State'
    },
    report_engines: {
      pdf: 'Browser-Side Render & Print Engine',
      docx_markdown: 'Client-Side Blob Generator',
      csv_json: 'Structured Schema Exporter'
    }
  });
}
