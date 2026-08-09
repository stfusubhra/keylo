import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';

/**
 * Kolkata University Rental Map
 *
 * Interactive live Leaflet (OpenStreetMap) map used on /find-a-stay. Tiles are
 * fetched live from the OpenStreetMap tile servers on every load (standard
 * HTTP caching applies). Colleges are highlighted with pulsing purple pins,
 * stays with lime pins; dense areas cluster automatically. Popup actions stay
 * inside the SPA (filter by campus / open property).
 */
export default function KolkataUniversityMap({ properties = [], colleges = [], selectedUniversity = '', onSelectUniversity }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const collegeClusterRef = useRef(null);
  const propertyClusterRef = useRef(null);
  const onSelectUniversityRef = useRef(onSelectUniversity);
  const navigate = useNavigate();

  useEffect(() => {
    onSelectUniversityRef.current = onSelectUniversity;
  }, [onSelectUniversity]);

  // Initialise the map once. scrollWheelZoom is on so trackpad/wheel gestures
  // zoom while the cursor is over the map; the map consumes the wheel events
  // so the page below does not scroll while hovering it.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const map = L.map(containerRef.current, {
      center: [22.545, 88.42],
      zoom: 11,
      scrollWheelZoom: true,
      wheelPxPerZoomLevel: 90,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);
    collegeClusterRef.current = L.markerClusterGroup({ maxClusterRadius: 50, showCoverageOnHover: false, iconCreateFunction: (cluster) => clusterIcon(cluster, 'colleges') }).addTo(map);
    propertyClusterRef.current = L.markerClusterGroup({ maxClusterRadius: 50, showCoverageOnHover: false, iconCreateFunction: (cluster) => clusterIcon(cluster, 'stays') }).addTo(map);
    mapRef.current = map;
    if (import.meta.env.DEV) window.__keyloMap = map; // test hook, dev only
    return () => {
      map.remove();
      mapRef.current = null;
      collegeClusterRef.current = null;
      propertyClusterRef.current = null;
      if (import.meta.env.DEV) window.__keyloMap = null;
    };
  }, []);

  // Cluster icon: KeyLo-styled bubble sized by the number of pins it holds.
  const clusterIcon = (cluster, kind) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 40 : count < 25 ? 50 : 60;
    return L.divIcon({
      className: '',
      html: `<div class="keylo-cluster ${kind}" style="width:${size}px;height:${size}px"><span>${count}</span></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Render pins whenever the data or the selected campus changes.
  useEffect(() => {
    const collegeCluster = collegeClusterRef.current;
    const propertyCluster = propertyClusterRef.current;
    if (!collegeCluster || !propertyCluster) return undefined;

    collegeCluster.clearLayers();
    propertyCluster.clearLayers();

    const collegeIcon = (selected) => L.divIcon({
      className: `keylo-pin college${selected ? ' selected' : ''}`,
      html: '<span class="material-symbols-outlined">school</span>',
      iconSize: [38, 38],
      iconAnchor: [19, 19], // anchor dead-centre so the pin sits on its location
      popupAnchor: [0, -22],
    });

    const propertyIcon = L.divIcon({
      className: 'keylo-pin property',
      html: '<span class="material-symbols-outlined">home</span>',
      iconSize: [30, 30],
      iconAnchor: [15, 15], // anchor dead-centre so the pin sits on its location
      popupAnchor: [0, -17],
    });

    const staysNear = (collegeName) => (properties || []).filter((p) => p.university === collegeName).length;

    colleges.forEach((college) => {
      if (college.lat == null || college.lng == null) return;
      const selected = Boolean(selectedUniversity && selectedUniversity === college.name);
      const marker = L.marker([college.lat, college.lng], { icon: collegeIcon(selected) });
      const nearby = staysNear(college.name);
      const popup = document.createElement('div');
      popup.className = 'w-[220px] font-body-md text-on-surface';
      popup.innerHTML = `
        <p class="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Campus</p>
        <p class="font-h3 text-h3 text-primary leading-tight">${college.name}</p>
        <p class="text-body-md text-on-surface-variant mt-xs flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">location_on</span>${college.area}
        </p>
        <p class="font-label-caps text-label-caps text-primary mt-xs">${nearby} ${nearby === 1 ? 'stay' : 'stays'} listed nearby</p>
        <button data-keylo-map-action="filter" class="mt-md w-full px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Show stays near here</button>`;
      popup.querySelector('[data-keylo-map-action="filter"]').addEventListener('click', () => {
        onSelectUniversityRef.current(college.name);
      });
      marker.bindPopup(popup);
      marker.addTo(collegeCluster);
    });

    properties.forEach((property) => {
      if (property.lat == null || property.lng == null) return;
      const marker = L.marker([property.lat, property.lng], { icon: propertyIcon });
      const popup = document.createElement('div');
      popup.className = 'w-[220px] font-body-md text-on-surface';
      popup.innerHTML = `
        <p class="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Near ${property.university || 'Kolkata campus'}</p>
        <p class="font-h3 text-h3 text-primary leading-tight">${property.name}</p>
        <p class="text-body-md text-on-surface-variant mt-xs flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">location_on</span>${property.area || 'Kolkata'}${property.distance ? ` &middot; ${property.distance} from campus` : ''}
        </p>
        <p class="font-price-display text-price-display text-primary mt-xs">${property.price || ''}<span class="text-body-md text-on-surface-variant"> / mo</span></p>
        <button data-keylo-map-action="view" class="mt-md w-full px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">View stay</button>`;
      popup.querySelector('[data-keylo-map-action="view"]').addEventListener('click', () => {
        navigate(`/property/${property.id}`);
      });
      marker.bindPopup(popup);
      marker.addTo(propertyCluster);
    });

    return undefined;
  }, [properties, colleges, selectedUniversity, navigate]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[420px] md:h-[520px] w-full border-2 border-primary"
        aria-label="Live map of Kolkata with universities highlighted and KeyLo stays nearby"
        data-testid="keylo-university-map"
      />
      <div className="absolute top-3 right-3 z-[1100] bg-surface-container-lowest border-2 border-primary p-md shadow-[-3px_3px_0px_0px_#000000] pointer-events-none">
        <p className="font-label-caps text-label-caps text-primary uppercase mb-sm">Legend</p>
        <div className="flex flex-col gap-xs">
          <div className="flex items-center gap-sm">
            <span className="keylo-pin college static-legend" aria-hidden="true"><span className="material-symbols-outlined">school</span></span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">University campus</span>
          </div>
          <div className="flex items-center gap-sm">
            <span className="keylo-pin property static-legend" aria-hidden="true"><span className="material-symbols-outlined">home</span></span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">KeyLo stay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
