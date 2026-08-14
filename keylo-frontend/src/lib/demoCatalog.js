// Demo inventory used when Supabase is unconfigured (or as a fallback for the
// property details page). Kept in one place so the listing, details and booking
// pages always agree on names and pricing.
//
// Images, descriptions and addresses mirror the published rows in the remote
// Supabase `properties` table (see supabase/migrations/20260814120000_*).

export const demoProperties = [
  {
    id: 'adamas-pg', university: 'Adamas University', area: 'Barasat', name: 'Adamas Green PG', type: 'PG', distance: '0.8 km', rating: '4.8', price: '₹8,500', deposit: '₹10,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.708, lng: 88.489,
    address: 'Plot X/7, Adamas Knowledge City Road, Barasat, North 24 Parganas, West Bengal 700126',
    description: 'A calm, garden-facing PG for Adamas University students, a 9-minute walk from the main gate. Rooms open onto a shared balcony with tree cover, and the on-site mess serves home-style Bengali and North Indian meals three times a day. The ground floor has a quiet study hall that stays open till 11 PM, and a 24/7 warden handles late-night arrivals.',
    amenities: ['Wi-Fi', 'Meals available', '24/7 Security', 'Laundry', 'Study hall', 'Power backup', 'RO water', 'Housekeeping'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
    ],
    featured: true,
  },
  {
    id: 'adamas-flat', university: 'Adamas University', area: 'Madhyamgram', name: 'North Kolkata Student Flat', type: 'Flat', distance: '1.4 km', rating: '4.6', price: '₹14,000', deposit: '₹20,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white', lat: 22.703, lng: 88.447,
    address: 'B/5, Madhyamgram Station Road, Madhyamgram, Kolkata, West Bengal 700129',
    description: 'A bright 2BHK on a quiet lane off Madhyamgram station, 12 minutes by auto from Adamas University. Both bedrooms have study desks and wardrobes; the living room doubles as a shared study zone with a 6-seater table. Kitchen is modular with a water purifier, and the gated society has covered parking and 24/7 security.',
    amenities: ['2 bedrooms', 'Study-ready', 'Gated community', 'High-speed Wi-Fi', 'Power backup', 'Car parking', 'Balcony', '24/7 Security'],
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85',
    ],
    featured: false,
  },
  {
    id: 'jadavpur-pg', university: 'Jadavpur University', area: 'Jadavpur', name: 'Lake View Student PG', type: 'PG', distance: '0.6 km', rating: '4.9', price: '₹9,500', deposit: '₹12,000', status: 'Fast Filling', badge: '🔥 Fast Filling', badgeClass: 'bg-hot-pink text-white', lat: 22.495, lng: 88.392,
    address: '45 Lake View Road, near Jadavpur University Gate 4, Jadavpur, Kolkata, West Bengal 700032',
    description: 'Right opposite the Jadavpur lake, this PG is a 5-minute walk to Jadavpur University gate 4 and even closer to the canteen lane. Double-sharing rooms have individual study desks, and the rooftop lounge gets the evening breeze. Rent includes fibre Wi-Fi, daily housekeeping, laundry, and a power backup that keeps study hours uninterrupted.',
    amenities: ['High-speed Wi-Fi', 'Laundry', 'Power backup', 'Lake-facing rooms', 'Study desk', 'Daily housekeeping', 'Common lounge', 'CCTV'],
    image: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=85',
    ],
    virtualTourUrl: 'https://pannol.com/360/jadavpur-pg-tour/',
    featured: true,
  },
  {
    id: 'jadavpur-flat', university: 'Jadavpur University', area: 'Gariahat', name: 'South Kolkata 2BHK Flat', type: 'Flat', distance: '1.1 km', rating: '4.7', price: '₹18,000', deposit: '₹25,000', status: 'Available', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.514, lng: 88.362,
    address: '7/1, Golpark Lane, Gariahat, Kolkata, West Bengal 700029',
    description: 'A sunlit 2BHK three lanes off Gariahat market, popular with Jadavpur University and Presidency students. Wooden floors, a modular kitchen with chimney, and two balconies with morning sun. The metro at Ballygunge Phari is 7 minutes away. Furnished fully — just bring your books.',
    amenities: ['2 bedrooms', 'Furnished', 'Metro nearby', 'AC in bedrooms', 'Modular kitchen', 'High-speed Wi-Fi', 'Lift access', 'Parking'],
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=85',
    ],
    featured: false,
  },
  {
    id: 'calcutta-pg', university: 'University of Calcutta', area: 'Ballygunge', name: 'College Street Co-Living', type: 'PG', distance: '1.3 km', rating: '4.7', price: '₹7,800', deposit: '₹8,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.529, lng: 88.369,
    address: '22B, Ballygunge Circular Road, Kolkata, West Bengal 700019',
    description: 'A characterful co-living PG on Ballygunge Circular Road for Calcutta University, Presidency, and Scottish Church students. Rooms share a warm common kitchen, a courtyard perfect for late-night adda, and a small library. Weekly community dinners are on the house. Wi-Fi, housekeeping, and laundry are included in the rent.',
    amenities: ['Wi-Fi', 'Housekeeping', 'Common kitchen', 'Community dinners', 'Laundry', 'Study corner', '24/7 Security', 'Power backup'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
    ],
    featured: false,
  },
  {
    id: 'calcutta-flat', university: 'University of Calcutta', area: 'Bhowanipore', name: 'Central Kolkata Student Flat', type: 'Flat', distance: '1.8 km', rating: '4.5', price: '₹16,500', deposit: '₹22,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white', lat: 22.539, lng: 88.349,
    address: '14, Sarat Bose Road, Bhowanipore, Kolkata, West Bengal 700020',
    description: 'A modern 1BHK in Bhowanipore, 8 minutes from the Kalighat metro and an easy commute to College Street campuses. The bedroom fits a double bed plus a work station; the balcony overlooks a tree-lined avenue. Fully furnished with AC, geyser, modular kitchen, and a 200 Mbps connection included.',
    amenities: ['1 bedroom', 'Fully furnished', 'Bus access', 'Wi-Fi', 'Power backup', 'Modular kitchen', 'Balcony', 'Housekeeping'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85',
    ],
    featured: false,
  },
  {
    id: 'xaviers-pg', university: "St. Xavier's University Kolkata", area: 'New Town', name: 'New Town Scholars PG', type: 'PG', distance: '0.9 km', rating: '4.8', price: '₹10,500', deposit: '₹12,000', status: 'Verified', badge: '✓ Verified', badgeClass: 'bg-acid-lime text-primary', lat: 22.577, lng: 88.468,
    address: 'Action Area III, New Town, Kolkata, West Bengal 700160',
    description: "Purpose-built student PG in New Town, 900 m from St. Xavier's University and a short ride to Techno India and IEM Salt Lake. Every floor has a study lounge and filtered water; the ground floor has a small gym and a mess serving weekday lunches. CCTV, biometric entry, and a resident caretaker keep it secure.",
    amenities: ['Wi-Fi', 'Gym', '24/7 Security', 'Study hall', 'Laundry', 'Mess on site', 'Power backup', 'CCTV'],
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    ],
    featured: true,
  },
  {
    id: 'xaviers-flat', university: "St. Xavier's University Kolkata", area: 'Rajarhat', name: 'Rajarhat Campus Flat', type: 'Flat', distance: '1.6 km', rating: '4.6', price: '₹19,500', deposit: '₹28,000', status: 'Available', badge: 'AI Inspected', badgeClass: 'bg-electric-purple text-white', lat: 22.564, lng: 88.453,
    address: 'Plot Y/9, Street 21, Rajarhat, Kolkata, West Bengal 700156',
    description: "A spacious 2BHK on the 4th floor of a new Rajarhat society, 1.6 km from St. Xavier's University New Town. Floor-to-ceiling windows, a west-facing balcony, and one reserved car park. The building has a gym, a pool, and 24/7 doorman. Fully furnished, ready to move into this semester.",
    amenities: ['2 bedrooms', 'Balcony', 'Parking', 'Gym', 'Power backup', 'Wi-Fi', 'Furnished', '24/7 Security'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=85',
    ],
    featured: false,
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
  { id: 'presidency', name: 'Presidency University', area: 'College Street, Kolkata', lat: 22.5729, lng: 88.3630 },
  { id: 'xaviers-college', name: "St. Xavier's College Kolkata", area: 'Park Street, Kolkata', lat: 22.5508, lng: 88.3578 },
  { id: 'iim-calcutta', name: 'IIM Calcutta', area: 'Joka, Kolkata', lat: 22.4640, lng: 88.2790 },
  { id: 'isi', name: 'Indian Statistical Institute', area: 'Baranagar, Kolkata', lat: 22.6450, lng: 88.3650 },
  { id: 'iem', name: 'IEM Salt Lake', area: 'Sector V, Salt Lake', lat: 22.5688, lng: 88.4123 },
  { id: 'snu', name: 'Sister Nivedita University', area: 'Action Area I, New Town', lat: 22.5914, lng: 88.4721 },
  { id: 'medical-college', name: 'Medical College & Hospital Kolkata', area: 'College Street, Kolkata', lat: 22.5755, lng: 88.3650 },
  { id: 'bethune', name: 'Bethune College', area: 'Bidhan Sarani, Kolkata', lat: 22.5770, lng: 88.3665 },
  { id: 'scottish-church', name: 'Scottish Church College', area: 'Ballygunge Circular Road, Kolkata', lat: 22.5340, lng: 88.3610 },
  { id: 'heritage', name: 'Heritage Institute of Technology', area: 'Anandapur, East Kolkata', lat: 22.5179, lng: 88.4238 },
  { id: 'techno-india', name: 'Techno India University', area: 'Sector V, Salt Lake', lat: 22.5584, lng: 88.4119 },
];
