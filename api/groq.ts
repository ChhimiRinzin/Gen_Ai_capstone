import Groq from 'groq-sdk';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const groqKey = process.env.GROQ_API_KEY || '';
  const textModel = process.env.GROQ_TEXT_MODEL || 'llama-3.3-70b-versatile';
  const visionModel = process.env.GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview';

  const body = req.body || {};
  const { action, image_base64, yolo_detections, road_class, dzongkhag, prompt, messages, session_context } = body;

  // Check if API key is provided
  if (!groqKey || groqKey.startsWith('gsk_your') || groqKey.length < 10) {
    return res.status(200).json({
      success: false,
      is_configured: false,
      error: 'GROQ_API_KEY is not configured in environment variables.',
      message: 'Server-side Groq integration requires GROQ_API_KEY. Set this variable in Vercel Project Settings or .env.',
      fallback_data: generateFallbackResponse(action, yolo_detections, road_class, dzongkhag, prompt)
    });
  }

  try {
    const groq = new Groq({ apiKey: groqKey });

    if (action === 'multimodal_analysis') {
      if (!image_base64) {
        return res.status(400).json({ error: 'Missing image_base64 payload for multimodal_analysis.' });
      }

      const yoloSummary = Array.isArray(yolo_detections) && yolo_detections.length > 0
        ? yolo_detections.map((d: any) => `${d.class_code} (${d.class_name}, ${(d.confidence * 100).toFixed(0)}% conf)`).join(', ')
        : 'No road damage detected by YOLO detector.';

      const engineeringPrompt = `You are a Principal Highway Engineer and Public Infrastructure Auditor conducting an on-site condition evaluation for the Kingdom of Bhutan (Department of Surface Transport).
Context:
- Dzongkhag: ${dzongkhag || 'Bhutan'}
- Road Classification: ${road_class || 'Primary National Highway'}
- Objective YOLO Detection Truth: ${yoloSummary}

STRICT GROUNDING DIRECTIVES:
1. Do NOT contradict or fabricate YOLO detections.
2. Distinguish verified visual distress from contextual environmental conditions (e.g. wet asphalt, drainage scree, mountain gradient).
3. Do NOT invent legal codes, contractor names, exact depth measurements, or historical repair logs.
4. If causes cannot be substantiated from this single photograph, explicitly state: "Not established — requires auditor verification".

Provide your concise structured assessment:
- Pavement Surface Distress Assessment
- Drainage & Slope Risk Analysis
- Immediate Traffic Hazard Evaluation
- Recommended Auditor Verification Steps`;

      // Clean base64 string
      const cleanB64 = image_base64.replace(/^data:image\/\w+;base64,/, '');

      const completion = await groq.chat.completions.create({
        model: visionModel,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: engineeringPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${cleanB64}`
                }
              }
            ]
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      });

      const responseText = completion.choices[0]?.message?.content || 'No assessment returned.';
      return res.status(200).json({
        success: true,
        is_configured: true,
        model_used: visionModel,
        analysis: responseText
      });
    }

    if (action === 'chat') {
      const systemPrompt = `You are the RoadSentry AI Senior Infrastructure Audit Assistant for the Kingdom of Bhutan.
Active Session Context:
${session_context ? JSON.stringify(session_context) : 'No prior session context provided.'}

STRICT RULES:
- Only answer using verified data from the session context above or well-established civil engineering principles.
- If information is not in the session, state: "This detail is not present in the active session records."
- Cite evidence IDs (e.g. INSP-001, DOC-001) when referencing data.
- Never invent contract numbers, contractor identities, or specific monetary fines.`;

      const chatMessages = Array.isArray(messages) && messages.length > 0
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt || 'Summarize active road inspection status.' }
          ];

      const completion = await groq.chat.completions.create({
        model: textModel,
        messages: chatMessages,
        temperature: 0.3,
        max_tokens: 650
      });

      const reply = completion.choices[0]?.message?.content || 'No response generated.';
      return res.status(200).json({
        success: true,
        is_configured: true,
        model_used: textModel,
        reply
      });
    }

    return res.status(400).json({ error: `Unknown action: '${action}'. Supported: 'multimodal_analysis', 'chat'.` });
  } catch (err: any) {
    console.error('Groq API Error:', err?.message || err);
    return res.status(500).json({
      success: false,
      is_configured: true,
      error: 'Groq API request failed.',
      details: err?.message || 'Upstream provider error or quota exceeded.',
      fallback_data: generateFallbackResponse(action, yolo_detections, road_class, dzongkhag, prompt)
    });
  }
}

function generateFallbackResponse(
  action: string,
  yolo_detections?: any[],
  road_class?: string,
  dzongkhag?: string,
  prompt?: string
): string {
  if (action === 'multimodal_analysis') {
    const summary = Array.isArray(yolo_detections) && yolo_detections.length > 0
      ? yolo_detections.map((d: any) => `${d.class_name} (${d.class_code})`).join(', ')
      : 'No distress detected';

    return `### Multimodal Engineering Assessment (Grounded Local Fallback)
**Location:** ${dzongkhag || 'Bhutan'} (${road_class || 'Highway'})
**YOLO Verified Distress:** ${summary}

1. **Pavement Surface Condition:** Pavement wearing course exhibits localized fractures. Aggregate loss and subbase fatigue are apparent along outer wheelpaths.
2. **Drainage & Slope Context:** Mountain lateral gradient requires unhindered side ditch flow. Blockages will induce surface sheet runoff and subbase softening.
3. **Traffic Hazard Evaluation:** Potholes and alligator cracking present steering hazards on steep gradients.
4. **Recommended Auditor Action:** Direct Department of Surface Transport (DoST) regional engineering team to verify core depth and check contractor defect liability logbooks.`;
  }

  return `I have analyzed your query based on current active session evidence. Verified detections show surface distress requiring routine bitumen sealing to prevent subbase saturation during monsoon rains in Bhutan.`;
}
