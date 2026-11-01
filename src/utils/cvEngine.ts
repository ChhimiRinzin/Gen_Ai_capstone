import { Detection, CVMetrics, DamageClassCode } from '../types';

export const DAMAGE_COLORS: Record<DamageClassCode, string> = {
  D00: '#38bdf8', // Sky Blue - Longitudinal Crack
  D10: '#a855f7', // Purple - Transverse Crack
  D20: '#f97316', // Orange - Alligator Crack
  D40: '#ef4444', // Red - Pothole
};

export const DAMAGE_CLASS_NAMES: Record<DamageClassCode, string> = {
  D00: 'Longitudinal Crack',
  D10: 'Transverse Crack',
  D20: 'Alligator Crack',
  D40: 'Pothole',
};

/**
 * Perform authentic computer vision quality analysis on HTML5 Canvas ImageData:
 * - Variance of Laplacian convolution for blur detection
 * - Mean luminance for brightness (0-255)
 * - Standard deviation of luminance for contrast
 */
export function analyzeCanvasQuality(ctx: CanvasRenderingContext2D, width: number, height: number): CVMetrics {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;

  // Grayscale and luminance calculation
  const gray = new Float32Array(totalPixels);
  let sumLuminance = 0;

  for (let i = 0; i < totalPixels; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    gray[i] = luma;
    sumLuminance += luma;
  }

  const meanBrightness = sumLuminance / totalPixels;

  // Contrast (Standard Deviation)
  let sumSqDiff = 0;
  for (let i = 0; i < totalPixels; i++) {
    const diff = gray[i] - meanBrightness;
    sumSqDiff += diff * diff;
  }
  const contrast = Math.sqrt(sumSqDiff / totalPixels);

  // Discrete Laplacian 3x3 kernel:
  // [  0,  1,  0 ]
  // [  1, -4,  1 ]
  // [  0,  1,  0 ]
  let sumLap = 0;
  let sumLapSq = 0;
  let lapCount = 0;

  // Sample every 2nd pixel for CPU performance
  const step = 2;
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const idx = y * width + x;
      const top = (y - 1) * width + x;
      const bottom = (y + 1) * width + x;
      const left = y * width + (x - 1);
      const right = y * width + (x + 1);

      const lapVal = gray[top] + gray[bottom] + gray[left] + gray[right] - 4 * gray[idx];
      sumLap += lapVal;
      sumLapSq += lapVal * lapVal;
      lapCount++;
    }
  }

  const meanLap = sumLap / (lapCount || 1);
  const lapVar = sumLapSq / (lapCount || 1) - meanLap * meanLap;
  const blurMetric = Math.max(0, lapVar);

  const is_blurry = blurMetric < 100.0;
  let quality_status = 'Good — Suitable for AI damage audit';

  if (is_blurry) {
    quality_status = 'Blurry — Camera motion or defocus';
  } else if (meanBrightness < 45) {
    quality_status = 'Underexposed — Insufficient road lighting';
  } else if (meanBrightness > 215) {
    quality_status = 'Overexposed — Severe solar glare';
  } else if (contrast < 35) {
    quality_status = 'Low Contrast — Hazy surface';
  }

  return {
    blur_metric: Math.round(blurMetric * 10) / 10,
    is_blurry,
    brightness: Math.round(meanBrightness * 10) / 10,
    contrast: Math.round(contrast * 10) / 10,
    quality_status,
    dimensions: { width, height }
  };
}

/**
 * Apply Canny Edge / High-Pass Gradient filter onto destination canvas
 */
export function renderEdgesToCanvas(
  srcCtx: CanvasRenderingContext2D,
  dstCanvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  dstCanvas.width = width;
  dstCanvas.height = height;
  const dstCtx = dstCanvas.getContext('2d');
  if (!dstCtx) return;

  const srcData = srcCtx.getImageData(0, 0, width, height).data;
  const outImgData = dstCtx.createImageData(width, height);
  const outData = outImgData.data;

  // Sobel-type horizontal & vertical gradient
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const left = (y * width + (x - 1)) * 4;
      const right = (y * width + (x + 1)) * 4;
      const top = ((y - 1) * width + x) * 4;
      const bottom = ((y + 1) * width + x) * 4;

      const gx = srcData[right] - srcData[left];
      const gy = srcData[bottom] - srcData[top];
      const grad = Math.min(255, Math.abs(gx) + Math.abs(gy));

      const edgeVal = grad > 40 ? 240 : 15;
      outData[idx] = 14;      // dark slate-teal
      outData[idx + 1] = edgeVal > 40 ? 210 : 25; // cyan/teal highlight
      outData[idx + 2] = edgeVal > 40 ? 240 : 40;
      outData[idx + 3] = 255;
    }
  }

  dstCtx.putImageData(outImgData, 0, 0);
}

/**
 * Draw bounding boxes and class tags on top of image canvas
 */
export function drawDetections(
  ctx: CanvasRenderingContext2D,
  detections: Detection[],
  showLabels = true,
  showConf = true
) {
  for (const det of detections) {
    const [x1, y1, x2, y2] = det.bbox;
    const w = x2 - x1;
    const h = y2 - y1;
    const color = DAMAGE_COLORS[det.class_code] || '#06b6d4';

    // Box stroke
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x1, y1, w, h);

    // Box corner accents
    ctx.fillStyle = color;
    const cornerSize = 8;
    ctx.fillRect(x1 - 1, y1 - 1, cornerSize, 3);
    ctx.fillRect(x1 - 1, y1 - 1, 3, cornerSize);
    ctx.fillRect(x2 - cornerSize + 1, y1 - 1, cornerSize, 3);
    ctx.fillRect(x2 - 2, y1 - 1, 3, cornerSize);

    // Tag background
    if (showLabels) {
      const confStr = showConf ? ` ${(det.confidence * 100).toFixed(0)}%` : '';
      const text = `${det.class_code} ${det.class_name}${confStr}`;

      ctx.font = 'bold 12px Inter, sans-serif';
      const textWidth = ctx.measureText(text).width;
      const tagH = 20;
      const tagY = Math.max(y1 - tagH - 2, 2);

      ctx.fillStyle = color;
      ctx.fillRect(x1, tagY, textWidth + 12, tagH);

      ctx.fillStyle = '#0f172a';
      ctx.fillText(text, x1 + 6, tagY + 14);
    }
  }
}

/**
 * Synthesizes a realistic asphalt road surface on HTML5 Canvas
 * with authentic crack fractures or pothole cavity matching the Bhutan scenario.
 */
export function renderRealisticRoadScene(
  canvas: HTMLCanvasElement,
  detections: Detection[],
  scenarioTitle: string
) {
  const width = canvas.width || 640;
  const height = canvas.height || 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Asphalt pavement background (dark granular texture)
  ctx.fillStyle = '#262d3d';
  ctx.fillRect(0, 0, width, height);

  // Granular asphalt noise
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const shade = Math.floor(Math.random() * 60) + 25;
    ctx.fillStyle = `rgba(${shade}, ${shade + 5}, ${shade + 10}, 0.25)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // 2. Road markings (white/yellow centerline and edge lines)
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 4;
  ctx.setLineDash([25, 20]);
  ctx.beginPath();
  ctx.moveTo(width * 0.5, 0);
  ctx.lineTo(width * 0.5, height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Solid outer edge line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.08, 0);
  ctx.lineTo(width * 0.08, height);
  ctx.stroke();

  // 3. Render specific defect geometries
  for (const det of detections) {
    const [x1, y1, x2, y2] = det.bbox;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const bw = x2 - x1;
    const bh = y2 - y1;

    if (det.class_code === 'D40') {
      // Pothole: dark depression crater with jagged perimeter and gravel texture
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.ellipse(cx, cy, bw * 0.45, bh * 0.38, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Deep shadow core
      ctx.fillStyle = '#030712';
      ctx.beginPath();
      ctx.ellipse(cx - 5, cy + 4, bw * 0.28, bh * 0.22, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Broken rim fragments
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (det.class_code === 'D20') {
      // Alligator Crack: interconnected polygonal fractures
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      const numLines = 9;
      for (let k = 0; k < numLines; k++) {
        ctx.beginPath();
        const startX = x1 + Math.random() * bw;
        const startY = y1 + Math.random() * bh;
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + (Math.random() - 0.5) * 45, startY + (Math.random() - 0.5) * 45);
        ctx.lineTo(startX + (Math.random() - 0.5) * 60, startY + (Math.random() - 0.5) * 60);
        ctx.stroke();
      }
    } else if (det.class_code === 'D00') {
      // Longitudinal Crack: wavy vertical fracture parallel to centerline
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, y1);
      ctx.bezierCurveTo(cx - 15, y1 + bh * 0.3, cx + 18, y1 + bh * 0.7, cx - 5, y2);
      ctx.stroke();
    } else if (det.class_code === 'D10') {
      // Transverse Crack: horizontal fracture across traffic lane
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x1, cy);
      ctx.bezierCurveTo(x1 + bw * 0.3, cy - 12, x1 + bw * 0.7, cy + 14, x2, cy);
      ctx.stroke();
    }
  }

  // 4. Subtle watermark header on raw image
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(0, height - 28, width, 28);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.fillText(`ROAD PHOTO FEED | ${scenarioTitle} | 640x480 RAW`, 12, height - 10);
}
