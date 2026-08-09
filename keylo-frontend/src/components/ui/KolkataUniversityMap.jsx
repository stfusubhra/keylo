import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Kolkata University Rental Map
 *
 * Interactive Leaflet (OpenStreetMap) map used on /find-a-stay. Colleges are
 * highlighted with pulsing purple pins; KeyLo stays use lime pins. Popup
 * actions stay inside the SPA (filter by campus / open property).
 */
export default function KolkataUniversityMap({ properties = [], colleges = [], selectedUniversity = '', onSelectUniversity }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const onSelectUniversityRef = useRef(onSelectUniversity);
  const navigate = useNavigate();

  useEffect(() => {
    onSelectUniversityRef.current = onSelectUniversity;
  }, [onSelectUniversity]);

  // Initialise the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const map = L.map(containerRef.current, {
      center: [22.545, 88.42],
      zoom: 11,
      scrollWheelZoom: false, // avoid hijacking page scroll; users can zoom via controls / double-click
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Render pins whenever the data or the selected campus changes.
  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group) return undefined;

    group.clearLayers();

    const collegeIcon = (selected) => L.divIcon({
      className: `keylo-pin college${selected ? ' selected' : ''}`,
      html: '<span class="material-symbols-outlined">school</span>',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    const propertyIcon = L.divIcon({
      className: 'keylo-pin property',
      html: '<span class="material-symbols-outlined">home</span>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    colleges.forEach((college) => {
      if (college.lat == null || college.lng == null) return;
      const selected = Boolean(selectedUniversity && selectedUniversity === college.name);
      const marker = L.marker([college.lat, college.lng], { icon: collegeIcon(selected) });
      const popup = document.createElement('div');
      popup.className = 'w-[220px] font-body-md text-on-surface';
      popup.innerHTML = `
        <p class="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Campus</p>
        <p class="font-h3 text-h3 text-primary leading-tight">${college.name}</p>
        <p class="text-body-md text-on-surface-variant mt-xs flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">location_on</span>${college.area}
        </p>
        <button data-keylo-map-action="filter" class="mt-md w-full px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">Show stays near here</button>`;
      popup.querySelector('[data-keylo-map-action="filter"]').addEventListener('click', () => {
        onSelectUniversityRef.current(college.name);
      });
      marker.bindPopup(popup);
      marker.addTo(group);
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
      marker.addTo(group);
    });

    return undefined;
  }, [properties, colleges, selectedUniversity, navigate]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[420px] md:h-[520px] w-full border-2 border-primary"
        aria-label="Map of Kolkata with universities highlighted and KeyLo stays nearby"
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
