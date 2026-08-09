// Demo inventory used when Supabase is unconfigured (or as a fallback for the
// property details page). Kept in one place so the listing, details and booking
// pages always agree on names and pricing.

export const demoProperties = [
  {
    id: 'adamas-pg', university: 'Adamas University', area: 'Barasat', name: 'Adamas Green PG', type: 'PG', distance: '0.8 km', rating: '4.8', price: '₹8,500', deposit: '₹10,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.708, lng: 88.489,
    amenities: ['Wi-Fi', 'Meals available', '24/7 Security'], image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85', featured: true,
  },
  {
    id: 'adamas-flat', university: 'Adamas University', area: 'Madhyamgram', name: 'North Kolkata Student Flat', type: 'Flat', distance: '1.4 km', rating: '4.6', price: '₹14,000', deposit: '₹20,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white', lat: 22.703, lng: 88.447,
    amenities: ['2 bedrooms', 'Study-ready', 'Gated community'], image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
  {
    id: 'jadavpur-pg', university: 'Jadavpur University', area: 'Jadavpur', name: 'Lake View Student PG', type: 'PG', distance: '0.6 km', rating: '4.9', price: '₹9,500', deposit: '₹12,000', status: 'Fast Filling', badge: '🔥 Fast Filling', badgeClass: 'bg-hot-pink text-white', lat: 22.495, lng: 88.392,
    amenities: ['High-speed Wi-Fi', 'Laundry', 'Power backup'], image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=85', featured: true,
  },
  {
    id: 'jadavpur-flat', university: 'Jadavpur University', area: 'Gariahat', name: 'South Kolkata 2BHK Flat', type: 'Flat', distance: '1.1 km', rating: '4.7', price: '₹18,000', deposit: '₹25,000', status: 'Available', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.514, lng: 88.362,
    amenities: ['2 bedrooms', 'Furnished', 'Metro nearby'], image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
  {
    id: 'calcutta-pg', university: 'University of Calcutta', area: 'Ballygunge', name: 'College Street Co-Living', type: 'PG', distance: '1.3 km', rating: '4.7', price: '₹7,800', deposit: '₹8,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.529, lng: 88.369,
    amenities: ['Wi-Fi', 'Housekeeping', 'Common kitchen'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
  {
    id: 'calcutta-flat', university: 'University of Calcutta', area: 'Bhowanipore', name: 'Central Kolkata Student Flat', type: 'Flat', distance: '1.8 km', rating: '4.5', price: '₹16,500', deposit: '₹22,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white', lat: 22.539, lng: 88.349,
    amenities: ['1 bedroom', 'Fully furnished', 'Bus access'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc4-R4SQhrI1Gl7NarbnIcQfeO18ZgTs4ngebY_h6w2QPAfpY9u4hg_0Ab_ezybQTdnSwkK_EM_eZ3Fq48GvhxLXfPFTsNeY6tGWUNEysavTRJf1aAMRLaOZDmOjXZ32OT0FS6MMTD1KzUKGx9UfOQlehKO98GV7kSOZM08LFTA0Jwqas0LPTH5gkO0G2LLKxOm74mJvvXPw1DIl_q3QpMlJTRzs3Mo4LoW59Zzo2RVsGzJEVEkLs_', featured: false,
  },
  {
    id: 'xaviers-pg', university: "St. Xavier's University Kolkata", area: 'New Town', name: 'New Town Scholars PG', type: 'PG', distance: '0.9 km', rating: '4.8', price: '₹10,500', deposit: '₹12,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.577, lng: 88.468,
    amenities: ['Wi-Fi', 'Gym', '24/7 Security'], image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=85', featured: true,
  },
  {
    id: 'xaviers-flat', university: "St. Xavier's University Kolkata", area: 'Rajarhat', name: 'Rajarhat Campus Flat', type: 'Flat', distance: '1.6 km', rating: '4.6', price: '₹19,500', deposit: '₹28,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white', lat: 22.564, lng: 88.453,
    amenities: ['2 bedrooms', 'Balcony', 'Parking'], image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85', featured: false,
  },
];

export const universities = ['All Kolkata', 'Adamas University', 'Jadavpur University', 'University of Calcutta', "St. Xavier's University Kolkata"];

// Kolkata campuses the rental map highlights. Approximate lat/lng used for
// the demo — swap for exact campus coordinates when the schema has them.
export const colleges = [
  { id: 'adamas', name: 'Adamas University', area: 'Barasat, North 24 Parganas', lat: 22.7146, lng: 88.4956 },
  { id: 'jadavpur', name: 'Jadavpur University', area: 'Jadavpur, Kolkata', lat: 22.4993, lng: 88.3969 },
  { id: 'calcutta', name: 'University of Calcutta', area: 'College Street, Kolkata', lat: 22.5756, lng: 88.3626 },
  { id: 'xaviers', name: "St. Xavier's University Kolkata", area: 'Action Area III, New Town', lat: 22.5735, lng: 88.4722 },
];
