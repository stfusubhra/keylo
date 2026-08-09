import { useState } from 'react';

const rentalCategories = [
  { id: 'all', label: 'All Rentals' },
  { id: 'scooters', label: 'Scooters' },
  { id: 'bikes', label: 'Bikes' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'appliances', label: 'Appliances' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'tablets', label: 'Tablets' },
  { id: 'projectors', label: 'Projectors' },
];

const rentalItems = [
  {
    id: 1,
    name: 'Ather 450X',
    category: 'scooters',
    categoryLabel: 'Electric Scooter',
    price: '₹150',
    period: '/ Day',
    badges: [
      { label: 'Inspected', bg: 'bg-[#7C3AED]', textColor: 'text-white' },
      { label: 'Trending', bg: 'bg-[#00E5FF]', textColor: 'text-primary' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn5PGfZaGNX4Y1059KyVEBWyusuiowTyRx1hmfnQh_Fu9_rFbrlG6dM1Sn9-xx4giHR5thnLC5bWbOnvOpJOOT8faLtHBktAg8_eETWkCNlJ-ad3oQSkEQjKIMLMgoYn_qvoTVDFSkm41b7fZ9so3uxFfJqpx4bFfiSLmNUHX-XkZz6a51INZPJ1bk5_A2vy3DZzXC_L3X7EsUSTMTNQiyR5vUTcWxMJxf8ZpbZyFRZY1Lhl5mKVbT',
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    category: 'laptops',
    categoryLabel: 'Laptops',
    price: '₹800',
    period: '/ Month',
    badges: [
      { label: 'Verified', bg: 'bg-[#00E5FF]', textColor: 'text-primary' },
      { label: 'Fast Filling', bg: 'bg-[#FF5C5C]', textColor: 'text-white' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-5VkKPI_HhRuQZOd7JNKug3y2iabkPvjm0DGIDVsNL-1ykAU_6wjNaJpj4VFCQRqJWIEptTyYmN6BvvY6aSzvTpabcery6A1-_A_ECkYhGy2SM801ejo5_dhtUnHwnFCb181WfEFawrJFs7trtX4VqOyt2eMclVpBtMXbh2lzTknLTxELWl54BlKiCmrq6jOyZaHaATOG3pB6Z2WE_uiO-gstzYIdLeAN0uCq2c2A2TjjZ3gdyj8C',
  },
  {
    id: 3,
    name: 'Ergo Study Desk',
    category: 'furniture',
    categoryLabel: 'Furniture',
    price: '₹300',
    period: '/ Month',
    badges: [{ label: 'Flexible', bg: 'bg-[#C7F000]', textColor: 'text-primary' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcYV0S6Qvu2oY1HrIBYYak31oLFAg9--g2A_zqRydeE-4tKt7cv3YpMwDJAynXj03Al2U7MkQ6z-weg8C_Eg3BqLKlRXFHZLohjE_qlToltWt5dVucmbocHKjXf3HCpbwe8joVsq-mN9tAY8ikLY8HPjRiKpXLFjT0e2gJfd5xvSCabe1hJJMWME4Ed1uC3SCA9fwdTut2qy8LzHWDorzmWFqBTHMuVQg2w-Ydt0mTQx_dJ6zM4VcY',
  },
  {
    id: 4,
    name: 'Yamaha FZ-S',
    category: 'bikes',
    categoryLabel: 'Motorcycle',
    price: '₹200',
    period: '/ Day',
    badges: [
      { label: 'Verified', bg: 'bg-[#00E5FF]', textColor: 'text-primary' },
      { label: 'Popular', bg: 'bg-[#FF4F9A]', textColor: 'text-white' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtkAui5Tn5GYWsuQ7uqQkvi6YTr-Wbx6-S7HxV7U1Rfy2TbVZGN7u3DA-0Mp8x40-oCMHGydHDVRhuf2Qd9SpGiR0FqleY1qLWm4sMAdZ3yy-XTxYAhvsO8DoassNrelePcQjVY93Ldj4KTkIPPGFz4PbiWk2JCVqrTutRpYCrwANZ7YIXzzYpFboahHceoHj0gIyTHVdyWwouNcszGh99szqHRdpen_octQ-GYpNaD_2HBDoV0qiS',
  },
  {
    id: 5,
    name: 'Dell XPS 15',
    category: 'laptops',
    categoryLabel: 'Laptops',
    price: '₹1,200',
    period: '/ Month',
    badges: [{ label: 'Inspected', bg: 'bg-[#7C3AED]', textColor: 'text-white' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc4-R4SQhrI1Gl7NarbnIcQfeO18ZgTs4ngebY_h6w2QPAfpY9u4hg_0Ab_ezybQTdnSwkK_EM_eZ3Fq48GvhxLXfPFTsNeY6tGWUNEysavTRJf1aAMRLaOZDmOjXZ32OT0FS6MMTD1KzUKGx9UfOQlehKO98GV7kSOZM08LFTA0Jwqas0LPTH5gkO0G2LLKxOm74mJvvXPw1DIl_q3QpMlJTRzs3Mo4LoW59Zzo2RVsGzJEVEkLs_',
  },
  {
    id: 6,
    name: 'Ergonomic Chair',
    category: 'furniture',
    categoryLabel: 'Furniture',
    price: '₹250',
    period: '/ Month',
    badges: [{ label: 'New', bg: 'bg-[#C7F000]', textColor: 'text-primary' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4tUh4ePZJ67IqiyoRpI4X8KHzkeYRGDNxiIuWuDSIrjRFlzD2CbQb7gc7SlllT_B8ybl3qJiF576uR-15OSrvVsw-FMYj5q5gkq9f1rK0Rj3ITcCNrTlc5qITTo2NcY_7NsZdQTC5yrmoWjK1ffCYAkuSiNSew8Ez3PUyft3-eU4XMtAx-tcT3jBe2B4SkdEq54cp1dUJ2RtXXU8w81-_enndMYAi_AXh-KAD49RxFPKRpbrAj8Rx',
  },
  {
    id: 7,
    name: 'Microwave Oven',
    category: 'appliances',
    categoryLabel: 'Appliances',
    price: '₹180',
    period: '/ Month',
    badges: [{ label: 'Verified', bg: 'bg-[#00E5FF]', textColor: 'text-primary' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi5Rs4vUeMB1lDN7kY8VnazifBL1QS-WoJMuGveIV2FS1SUTcYxUxGhGQ6fRPvGGoD6JAtEHw2xlW6LHNEOKg4xuMEofr3r0yLgJnWXgGd9ZgPtJJpu_0IT3eOZIyjZIRvmFK4Ef3qFGNSNswn20NGj8zDgawNdYUsnEL7-M88I5nrRpO9iAhnKiUQ8Q8iZUYIOefyJ8_FuvBwMb1qsNWNeZ9Pu4TNBdZVrHVMl-L3RSZ01GnoluNR',
  },
  {
    id: 8,
    name: 'PlayStation 5',
    category: 'gaming',
    categoryLabel: 'Gaming Console',
    price: '₹500',
    period: '/ Month',
    badges: [
      { label: 'Trending', bg: 'bg-[#FF4F9A]', textColor: 'text-white' },
      { label: 'Fast Filling', bg: 'bg-[#FF5C5C]', textColor: 'text-white' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcCdYud3Dn3RGSpguq4MWbAuaEUUpnq-ntdunFJsj3wfWyGBR5boMQiD5Rkf_6dtvZbxKYhULPnYzr5tNDNOM7qVCmoFzfP-SttO42dOjvugkCIbdQb4lfxCfrVHXOftvv7yHEpfNsqcGkUlqxGYw3zAKyIoZQrbkxWECy3CccjPfFT6EJAA78LpRmWSoP0BiT-Qb7cEfJZ7K4SuIJl8A33PMnJLy3dxVsYDvzBa7eMHnxgK-jY7ib',
  },
  {
    id: 9,
    name: 'Samsung 32" Monitor',
    category: 'electronics',
    categoryLabel: 'Electronics',
    price: '₹350',
    period: '/ Month',
    badges: [{ label: 'Inspected', bg: 'bg-[#7C3AED]', textColor: 'text-white' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk66WyrS7ZLawk1xnXKTSuu-1kiW3tYTSEJQ0nyp9vgfvqSRUcAgrZT1YedUm2AOCUzriZ1LMFNrckV28sKm49BV3_D-8K1ms8aopm7SZLK_CWZ8km8llH-QxnUDxugcYXRwhDYFm-hnt0AYsuZJ4wmJIvVbIhHQt08YXNCnqLUHhyYvr-h5cvUZ17CIeksF27etqZCIsLGBIv4zvIj2itpBAXk7Qmq0YdjAtQK9MJCA3Tk2c7vBNX',
  },
  {
    id: 10,
    name: 'Mini Fridge',
    category: 'appliances',
    categoryLabel: 'Appliances',
    price: '₹220',
    period: '/ Month',
    badges: [{ label: 'Flexible', bg: 'bg-[#C7F000]', textColor: 'text-primary' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC84I3JhnOumYvKu8FWOrwVlY6CMYzhZ5ogxsmGCThJ9o61sS813DqV4XzL58NBuNblRoGpSM-nxtE76VcHEF6E7DTGvCz43onvW--6hL9TBQZtkuiSmJXHyz3uhmsAqH-ppnvzZZhNxP1OBtEkYATDkivPTq5-8G-SpNvjKAERlEcna6HHO3-WzCFGi93G7jRy1BV_4MYsk5vu9hhrYm3JtMBUzsGbCgeqCc9xBlNjOWBn9YSRGlYk',
  },
  {
    id: 11,
    name: 'Xbox Series X',
    category: 'gaming',
    categoryLabel: 'Gaming Console',
    price: '₹450',
    period: '/ Month',
    badges: [{ label: 'New', bg: 'bg-[#C7F000]', textColor: 'text-primary' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpdL7vWvL_O-xc18tzYWi629aE-h1jY9yzcqbWYnBWZXmo2dubOK745kuei6KLvKmt4UWczT6j7qH3faU51oLf-wdjNQB77a_E7iy6CWe24-GmeGrTBVoi1cK9Ef-LyNt0MceHlYWt3PwVdZR9beaj_URGIxwt1pKGwc32Jm-TZv8-IfW6xw6sr7aJf6VioF8sZD8hLJOUwcWaPPtJsnorw_wz8AtvVCMgEkmmi0UYnlUr-zw-eUQ-',
  },
  {
    id: 12,
    name: 'Washing Machine',
    category: 'appliances',
    categoryLabel: 'Appliances',
    price: '₹300',
    period: '/ Month',
    badges: [{ label: 'Verified', bg: 'bg-[#00E5FF]', textColor: 'text-primary' }],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcyzW8WzQT8ZGRAd-D1Z-s2D8uCUxVZNm1wgVERXwUV1-O8BWnGq65nF-jlb2M2YnQeqF3-F0t0j8QtPqNolagLjA1-M2KWon9M42wBab2LFJEfRvGnWkc6g5Ox5pvWWoZjPf_dmJU8P9C5ZiV8AhnviyvgLGaVkGz2GXDpFgqgZB2Ge0brjBctIEYaWktoOwYVjdVsBFuOCsaAkuRQQ-K0KmqdUNBNqI2TcVO6FzbbzyPAh22tPAv',
  },
  {
    id: 13,
    name: 'iPad Air',
    category: 'tablets',
    categoryLabel: 'Tablet',
    price: '₹650',
    period: '/ Month',
    badges: [{ label: 'Study Ready', bg: 'bg-[#00E5FF]', textColor: 'text-primary' }],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=85',
    useImage: true,
  },
  {
    id: 14,
    name: 'Epson Study Projector',
    category: 'projectors',
    categoryLabel: 'Projector',
    price: '₹400',
    period: '/ Month',
    badges: [{ label: 'Presentation Ready', bg: 'bg-[#C7F000]', textColor: 'text-primary' }],
    image: 'https://images.unsplash.com/photo-1528395874238-34b748a7e7e1?auto=format&fit=crop&w=1000&q=85',
    useImage: true,
  },
  {
    id: 15,
    name: 'Single Bed Frame',
    category: 'furniture',
    categoryLabel: 'Furniture',
    price: '₹450',
    period: '/ Month',
    badges: [{ label: 'Move-in Essential', bg: 'bg-[#C7F000]', textColor: 'text-primary' }],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
    useImage: true,
  },
  {
    id: 16,
    name: 'Bajaj Air Cooler',
    category: 'appliances',
    categoryLabel: 'Appliances',
    price: '₹280',
    period: '/ Month',
    badges: [{ label: 'Summer Ready', bg: 'bg-[#00E5FF]', textColor: 'text-primary' }],
    image: 'https://images.unsplash.com/photo-1631545806609-4b5f7e0b1e4b?auto=format&fit=crop&w=1000&q=85',
    useImage: true,
  },
  {
    id: 17,
    name: 'Honda Activa 6G',
    category: 'scooters',
    categoryLabel: 'Scooter',
    price: '₹180',
    period: '/ Day',
    badges: [{ label: 'Campus Favorite', bg: 'bg-[#FF4F9A]', textColor: 'text-white' }],
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
    useImage: true,
  },
  {
    id: 18,
    name: 'Canon Student Camera',
    category: 'electronics',
    categoryLabel: 'Electronics',
    price: '₹550',
    period: '/ Month',
    badges: [{ label: 'Creator Pick', bg: 'bg-[#7C3AED]', textColor: 'text-white' }],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85',
    useImage: true,
  },
];

const categoryImages = {
  scooters: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
  bikes: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=1000&q=85',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
  appliances: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1000&q=85',
  electronics: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=85',
  gaming: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1000&q=85',
  tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=85',
  projectors: 'https://images.unsplash.com/photo-1528395874238-34b748a7e7e1?auto=format&fit=crop&w=1000&q=85',
};

export default function RentEssentialsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems =
    activeCategory === 'all'
      ? rentalItems
      : rentalItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">
      {/* Hero Section */}
      <section className="w-full bg-surface py-xl px-margin-mobile lg:px-margin-desktop min-h-[400px] lg:min-h-[614px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path className="text-primary" d="M0,100 L100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-sm mb-lg px-md py-sm bg-primary text-on-primary rounded-full border-2 border-primary shadow-[4px_4px_0px_0px_#000000]">
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span className="font-label-caps text-label-caps tracking-widest uppercase">Student Marketplace</span>
          </div>
          <h1 className="font-heading text-h1-mobile lg:text-h1 text-primary mb-lg leading-none tracking-tighter font-bold">
            Rent the things that make <br className="hidden lg:block" />
            <span className="relative inline-block">
              college easier.
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#C7F000] -z-10 rotate-1" />
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-balance leading-relaxed" style={{ maxWidth: '672px' }}>
            Skip the heavy lifting. Get high-quality tech, transport, and furniture on flexible terms built for student life. No long-term commitments.
          </p>
        </div>
      </section>

      {/* Rental Categories & Grid */}
      <section className="w-full bg-surface-container-low px-margin-mobile lg:px-margin-desktop py-xl border-t-2 border-primary">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-md mb-xl overflow-x-auto pb-sm scrollbar-hide">
          {rentalCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-lg py-md font-label-caps text-label-caps rounded-full border-2 border-primary transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-primary text-on-primary shadow-[4px_4px_0px_0px_#000000]'
                  : 'bg-surface text-primary hover:bg-[#C7F000]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between pb-lg border-b-2 border-primary mb-xl">
          <span className="font-label-caps text-label-caps text-primary">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {activeCategory !== 'all' && ` in ${rentalCategories.find((c) => c.id === activeCategory)?.label}`}
          </span>
          <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary flex items-center gap-xs">
            <span>Sort by: Popular</span>
            <span className="material-symbols-outlined text-[16px]">sort</span>
          </button>
        </div>

        {/* Rental Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-surface flex flex-col border-2 border-primary shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_#000000] transition-all duration-300"
            >
              <div className="relative w-full aspect-square border-b-2 border-primary overflow-hidden bg-surface-container-high">
                <div className="absolute top-md left-md z-10 flex gap-sm flex-wrap">
                  {item.badges.map((badge) => (
                    <span
                      key={badge.label}
                      className={`px-sm py-xs ${badge.bg} ${badge.textColor} font-label-caps text-[10px] uppercase border-2 border-primary`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  src={item.useImage ? item.image : categoryImages[item.category] || item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-lg flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <h3 className="font-h3 text-h3 text-primary mb-xs">{item.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{item.categoryLabel}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-price-display text-price-display text-primary block">{item.price}</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{item.period}</span>
                  </div>
                </div>
                <div className="mt-auto pt-lg">
                  <button className="w-full py-md bg-primary text-on-primary font-label-caps text-label-caps border-2 border-primary hover:bg-[#C7F000] hover:text-primary transition-colors flex items-center justify-center gap-sm">
                    RENT NOW <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-xl">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-md">inventory_2</span>
            <h3 className="font-h3 text-h3 text-primary mb-xs">No items found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Try selecting a different category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
