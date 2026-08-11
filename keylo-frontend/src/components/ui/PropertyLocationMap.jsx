import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Property Location Map
 *
 * Live Leaflet (OpenStreetMap) map shown on a property's detail page
 * (/property/:id). Centered on the stay's coordinates with a lime KeyLo pin;
 * when the nearest campus is known a purple pin plus a dashed line shows the
 * commute. Tiles load live from OpenStreetMap like the main /find-a-stay map.
 */
export default function PropertyLocationMap({ lat, lng, name = '', area = '', distance = '', campus }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    if (lat == null || lng == null) return undefined;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      // Same scroll behaviour as the main map: wheel zooms while hovering,
      // 'center' keeps the zoom anchored to the viewport midpoint.
      scrollWheelZoom: 'center',
      wheelPxPerZoomLevel: 180,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Lime pin for the stay itself.
    const propertyIcon = L.divIcon({
      className: 'keylo-pin property',
      html: '<span class="material-symbols-outlined">home</span>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -17],
    });
    const popup = document.createElement('div');
    popup.className = 'font-body-md text-on-surface max-w-[280px] sm:max-w-none';
    popup.innerHTML = `
      <p class="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">${area || 'Kolkata'}</p>
      <p class="font-h3 text-h3 text-primary leading-tight">${name}</p>
      <p class="text-body-md text-on-surface-variant mt-xs flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">location_on</span>${area || 'Kolkata'}${distance ? ` &middot; ${distance} from campus` : ''}
      </p>`;
    L.marker([lat, lng], { icon: propertyIcon }).bindPopup(popup).addTo(map);

    // Purple pin for the campus plus a dashed commute line.
    if (campus && campus.lat != null && campus.lng != null) {
      const collegeIcon = L.divIcon({
        className: 'keylo-pin college',
        html: '<span class="material-symbols-outlined">school</span>',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -22],
      });
      L.marker([campus.lat, campus.lng], { icon: collegeIcon })
        .bindPopup(
          `<div class="font-body-md text-on-surface max-w-[280px] sm:max-w-none"><p class="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Campus</p><p class="font-h3 text-h3 text-primary leading-tight">${campus.name}</p></div>`
        )
        .addTo(map);
      L.polyline(
        [[lat, lng], [campus.lat, campus.lng]],
        { color: '#7c3aed', weight: 3, opacity: 0.9, dashArray: '6 8' }
      ).addTo(map);
      // Fit both pins when the campus is far enough to matter.
      map.fitBounds([[lat, lng], [campus.lat, campus.lng]], { padding: [40, 40], maxZoom: 15 });
    }

    mapRef.current = map;
    if (import.meta.env.DEV) window.__propertyMap = map; // test hook, dev only
    return () => {
      map.remove();
      mapRef.current = null;
      if (import.meta.env.DEV) window.__propertyMap = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  if (lat == null || lng == null) {
    return (
      <div className="w-full h-[260px] border-2 border-primary rounded-xl bg-surface-container-low flex items-center justify-center p-lg text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">Live map unavailable for this stay — coordinates are not set yet.</p>
      </div>
    );
  }

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      <div
        ref={containerRef}
        className="w-full h-[260px] border-2 border-primary rounded-xl overflow-hidden"
        aria-label={`Live map showing the location of ${name || 'this stay'} in ${area || 'Kolkata'}`}
        data-testid="property-location-map"
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        rel="noreferrer"
        className="mt-md inline-flex items-center gap-sm px-md py-sm bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_0px_#000000] transition-all"
      >
        <span className="material-symbols-outlined text-[16px]">directions</span>
        Open in Google Maps
      </a>
    </div>
  );
}
