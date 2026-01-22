import React from 'react';

const sampleProducts = [
  {
    id: '1',
    title: 'Academic Building Poster',
    price: 9.5,
    image: '../src/public/pic/ab_building.jpg',
    condition: 'Like New',
    location: 'Stanford, CA',
    seller: 'John D.',
    rating: 4.2,
    reviewCount: 24
  },
  {
    id: '2',
    title: 'Campus Print',
    price: 0,
    image: '../src/public/pic/school.png',
    condition: 'Excellent',
    location: 'Suzhou',
    seller: 'Sarah M.',
    rating: 5.0,
    reviewCount: 18
  },
  {
    id: '3',
    title: 'Group Photo Print',
    price: 1,
    image: '../src/public/pic/group.jpg',
    condition: 'Excellent',
    location: 'DKU',
    seller: 'Max W.',
    rating: 5.0,
    reviewCount: 18
  },
];

interface ProductsPageProps {
  searchQuery?: string;
  onNavigateToCategory: (categoryName: string, products: any[]) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigateToCategory }) => {
  const categoryRows = [
    { title: 'Clothing', products: sampleProducts },
    { title: 'Furnitures', products: sampleProducts },
    { title: 'Electronics', products: sampleProducts },
    { title: 'Office & Study Supplies', products: sampleProducts },
    { title: 'Food & Snacks', products: sampleProducts },
    { title: 'Daily Essentials', products: sampleProducts },
    { title: 'Arts & Dec', products: sampleProducts }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7fb58a] via-[#a4c6a5] to-[#d3f0c7]" style={{ fontFamily: '"Cormorant Garamond", "Garamond", serif' }}>
      <section className="w-full overflow-hidden bg-gradient-to-b from-[#78b886] via-[#95c9a0] to-[#b5d9bb]">
        <div className="relative h-56 sm:h-72">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.35),transparent_50%)]" />
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(0deg,rgba(30,60,30,0.2),rgba(30,60,30,0))]" />
            <div className="relative z-10 flex h-full items-center justify-center gap-6 px-6">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl font-black tracking-[0.35em] text-[#1e3a28] drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]">
                  CIRCULINK
                </div>
                <div className="mt-2 text-[11px] sm:text-sm uppercase tracking-[0.4em] text-[#2f5a3a]">
                  reuse. relove. recirculate.
                </div>
              </div>
              <div className="hidden sm:block">
                <svg
                  viewBox="0 0 220 160"
                  className="h-32 w-44 text-[#1f5a33]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="62" cy="44" r="20" fill="#3b7a49" />
                  <circle cx="90" cy="36" r="16" fill="#2f6d3f" />
                  <circle cx="120" cy="50" r="18" fill="#4a8a56" />
                  <rect x="104" y="20" width="20" height="28" rx="4" fill="#2a5b39" />
                  <rect x="130" y="28" width="18" height="22" rx="3" fill="#2f6d3f" />
                  <path
                    d="M20 62h130l18 42H48L20 62Z"
                    fill="#cfe5cd"
                    stroke="#1f5a33"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  <path d="M40 62l-10-24" stroke="#1f5a33" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="70" cy="118" r="10" fill="#1f5a33" />
                  <circle cx="150" cy="118" r="10" fill="#1f5a33" />
                  <path
                    d="M10 32h34"
                    stroke="#1f5a33"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
      </section>

      <div className="w-full px-3 pb-14 pt-6 space-y-4">
        {categoryRows.map((category) => (
          <section
            key={category.title}
            className="relative rounded-xl border border-[#9ec6a0] bg-[#dcead9] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_0_rgba(120,160,120,0.35)]"
          >
            <div className="flex items-start justify-between px-6 pt-4">
              <h3 className="text-sm sm:text-base font-semibold text-[#2e5235] font-[&quot;Cormorant_Garamond&quot;,serif]">
                {category.title}
              </h3>
            </div>
            <div className="flex items-center justify-between px-6 pb-10 pt-4 min-h-[180px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`${category.title}-${index}`} className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-lg border border-[#b6cbb4] bg-[#d6e3d7] shadow-[inset_0_2px_3px_rgba(0,0,0,0.08)]" />
                  <div className="mt-2 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8fba5a]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d7f08f]" />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigateToCategory(category.title, category.products)}
              className="absolute bottom-2 right-5 rounded-full border border-[#8eb78c] bg-[#eaf4e4] px-4 py-1.5 text-[10px] font-semibold text-[#3b6b44] shadow-[0_2px_0_rgba(60,100,60,0.25)] transition hover:bg-[#e3f0dc] font-[&quot;Cormorant_Garamond&quot;,serif]"
            >
              View All
            </button>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
