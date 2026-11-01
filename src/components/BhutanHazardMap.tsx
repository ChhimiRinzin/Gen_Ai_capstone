import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Filter, Layers, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { Inspection } from '../types';
import { BHUTAN_DZONGKHAGS } from '../data/bhutanData';

interface BhutanHazardMapProps {
  inspections: Inspection[];
  onSelectInspection?: (id: string) => void;
}

export const BhutanHazardMap: React.FC<BhutanHazardMapProps> = ({
  inspections,
  onSelectInspection
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filters
  const [selectedDzongkhag, setSelectedDzongkhag] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedHazard, setSelectedHazard] = useState<string>('All');
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Bhutan
    const map = L.map(mapContainerRef.current, {
      center: [27.5142, 90.4336],
      zoom: 8,
      minZoom: 7,
      maxZoom: 16
    });

    // Dark styled OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Click handler for coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      setClickedCoords({
        lat: Math.round(e.latlng.lat * 10000) / 10000,
        lon: Math.round(e.latlng.lng * 10000) / 10000
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when inspections or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Color definitions
    const colorMap: Record<string, string> = {
      CRITICAL: '#ef4444',
      HIGH: '#f97316',
      MEDIUM: '#eab308',
      LOW: '#10b981'
    };

    let plottedCount = 0;

    inspections.forEach((insp) => {
      const coords = insp.coordinates;
      if (!coords || !coords.lat || !coords.lon) return;

      // Filter: Dzongkhag
      if (selectedDzongkhag !== 'All' && insp.dzongkhag !== selectedDzongkhag) return;

      // Filter: Risk
      if (selectedRisk !== 'All' && insp.risk_assessment.level !== selectedRisk) return;

      // Filter: Hazard
      if (
        selectedHazard !== 'All' &&
        !insp.detections.some((d) => d.class_code === selectedHazard)
      ) {
        return;
      }

      const color = colorMap[insp.risk_assessment.level] || '#06b6d4';
      const defectSummary = insp.detections.map((d) => d.class_name).join(', ') || 'No distress';

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid #0f172a;
            box-shadow: 0 0 12px ${color}80;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 11px;
            font-weight: bold;
          ">
            ${insp.detections.length}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const popupContent = `
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; min-width: 200px;">
          <div style="font-weight: bold; font-size: 13px; color: #0284c7; margin-bottom: 4px;">
            ${insp.id} (${insp.filename})
          </div>
          <div style="margin-bottom: 2px;"><b>Dzongkhag:</b> ${insp.dzongkhag}</div>
          <div style="margin-bottom: 2px;"><b>Road Class:</b> ${insp.road_class}</div>
          <div style="margin-bottom: 2px;">
            <b>Assessed Risk:</b> <span style="font-weight:bold; color:${color};">${insp.risk_assessment.level} (${insp.risk_assessment.score} pts)</span>
          </div>
          <div style="margin-bottom: 4px;"><b>Distress:</b> ${defectSummary}</div>
          <div style="font-size: 10px; color: #64748b; font-family: monospace;">
            GPS: ${coords.lat.toFixed(4)}°N, ${coords.lon.toFixed(4)}°E
          </div>
        </div>
      `;

      const marker = L.marker([coords.lat, coords.lon], { icon: customIcon });
      marker.bindPopup(popupContent);
      if (markersLayerRef.current) {
        marker.addTo(markersLayerRef.current);
      }
      plottedCount++;
    });

    // Fly to filtered Dzongkhag if specific
    if (selectedDzongkhag !== 'All' && BHUTAN_DZONGKHAGS[selectedDzongkhag]) {
      const dz = BHUTAN_DZONGKHAGS[selectedDzongkhag];
      mapInstanceRef.current.flyTo([dz.center_lat, dz.center_lon], 11, { duration: 1.2 });
    }
  }, [inspections, selectedDzongkhag, selectedRisk, selectedHazard]);

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Kingdom of Bhutan — Interactive Road Hazard GIS Map
          </h2>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Plotting verified session inspection markers. Click anywhere on Bhutan to probe coordinates.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Dzongkhag:</span>
            <select
              value={selectedDzongkhag}
              onChange={(e) => setSelectedDzongkhag(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">All 20 Dzongkhags</option>
              {Object.keys(BHUTAN_DZONGKHAGS).map((dz) => (
                <option key={dz} value={dz}>
                  {dz}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">All Risks</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Hazard:</span>
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">All Classes</option>
              <option value="D00">D00 Longitudinal</option>
              <option value="D10">D10 Transverse</option>
              <option value="D20">D20 Alligator</option>
              <option value="D40">D40 Pothole</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-[520px] z-10" />

        {/* Floating Legend */}
        <div className="absolute bottom-4 right-4 z-20 p-3 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] space-y-1.5 shadow-lg">
          <div className="font-bold text-slate-200 uppercase tracking-wider mb-1">Risk Severity</div>
          <div className="flex items-center gap-2 text-rose-400">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span> Critical Priority (75–100)
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> High Priority (50–74)
          </div>
          <div className="flex items-center gap-2 text-yellow-400">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Medium Priority (25–49)
          </div>
          <div className="flex items-center gap-2 text-teal-400">
            <span className="w-3 h-3 rounded-full bg-teal-500"></span> Low Priority (0–24)
          </div>
        </div>

        {/* Coordinate probe chip */}
        {clickedCoords && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-xs text-cyan-300 font-mono flex items-center gap-2 shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            Selected: {clickedCoords.lat}°N, {clickedCoords.lon}°E
          </div>
        )}
      </div>

      {/* Empty notice if no inspections */}
      {inspections.length === 0 && (
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Active session contains 0 inspections. Save an inspection with coordinates in{' '}
            <strong className="text-slate-200">AI Road Inspector</strong> to display GPS incident markers on the Bhutan map.
          </span>
        </div>
      )}
    </div>
  );
};
