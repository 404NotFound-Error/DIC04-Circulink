import React, { useEffect, useMemo, useState } from 'react';
import { getCategories, getItems } from '../lib/backend';
import { resolveAssetUrl } from '../lib/api';
import type { Category, Item } from '../lib/api';

const FALLBACK_IMAGE = new URL('../public/pic/school.png', import.meta.url).href;

interface Product {
  id: string;
  title: string;
  price: number | string;
  image: string;
  condition?: string;
  location?: string;
  seller?: string;
  rating?: number;
  reviewCount?: number;
}

interface CategoryRow {
  id: string;
  title: string;
  products: Product[];
}

interface ProductsPageProps {
  searchQuery?: string;
  onNavigateToCategory: (categoryName: string, products: Product[]) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigateToCategory, searchQuery }) => {
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: categories, error: categoriesError } = await getCategories();
      if (!active) return;
      if (categoriesError || !categories) {
        setError(categoriesError?.message || 'Failed to load categories');
        setLoading(false);
        return;
      }

      const normalizedQuery = (searchQuery || '').trim();
      if (normalizedQuery) {
        const { data: items, error: itemsError } = await getItems({ search: normalizedQuery });
        if (!active) return;
        if (itemsError || !items) {
          setError(itemsError?.message || 'Failed to load items');
          setLoading(false);
          return;
        }
        const products = (items || []).map((item: Item) => ({
          id: item.id,
          title: item.title,
          price: Number(item.price || 0),
          image: resolveAssetUrl(item.images?.[0]) || FALLBACK_IMAGE,
          condition: item.condition
        }));
        setCategoryRows([
          {
            id: 'search',
            title: `Search results for "${normalizedQuery}"`,
            products
          }
        ]);
        setLoading(false);
        return;
      }

      const rows = await Promise.all(
        categories.map(async (category: Category) => {
          const { data: items } = await getItems({ category: category.id });
          const products = (items || []).map((item: Item) => ({
            id: item.id,
            title: item.title,
            price: Number(item.price || 0),
            image: resolveAssetUrl(item.images?.[0]) || FALLBACK_IMAGE,
            condition: item.condition
          }));
          return {
            id: category.id,
            title: category.name,
            products
          } as CategoryRow;
        })
      );

      if (!active) return;
      setCategoryRows(rows);
      setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  const hasResults = useMemo(() => categoryRows.some((row) => row.products.length > 0), [categoryRows]);

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
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <section
                key={`loading-${index}`}
                className="relative rounded-xl border border-[#9ec6a0] bg-[#dcead9] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_0_rgba(120,160,120,0.35)]"
              >
                <div className="px-6 pt-4">
                  <div className="h-3 w-36 rounded-full bg-[#c4d7c2] animate-pulse" />
                </div>
                <div className="flex items-center justify-between px-6 pb-10 pt-4 min-h-[180px]">
                  {Array.from({ length: 5 }).map((__, i) => (
                    <div key={`loading-${index}-${i}`} className="flex flex-col items-center">
                      <div className="h-20 w-20 rounded-lg border border-[#b6cbb4] bg-[#cdddc9] animate-pulse" />
                      <div className="mt-2 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8fba5a]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d7f08f]" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            <div className="text-sm font-semibold">Failed to load items</div>
            <div className="mt-2 text-xs opacity-80">{error}</div>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                setCategoryRows([]);
              }}
              className="mt-4 rounded-full border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && !hasResults && (
          <div className="rounded-xl border border-[#9ec6a0] bg-[#eaf4e4] px-6 py-8 text-center text-[#2e5235]">
            <div className="text-sm font-semibold">No items found</div>
            <div className="mt-2 text-xs opacity-80">Try another search or check back later.</div>
          </div>
        )}

        {!loading && !error && categoryRows.map((category) => (
          <section
            key={category.id}
            className="relative rounded-xl border border-[#9ec6a0] bg-[#dcead9] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_0_rgba(120,160,120,0.35)]"
          >
            <div className="flex items-start justify-between px-6 pt-4">
              <h3 className="text-sm sm:text-base font-semibold text-[#2e5235] font-[&quot;Cormorant_Garamond&quot;,serif]">
                {category.title}
              </h3>
            </div>
            <div className="flex items-center justify-between px-6 pb-10 pt-4 min-h-[180px]">
              {(category.products || []).slice(0, 5).map((product) => (
                <div key={product.id} className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-lg border border-[#b6cbb4] bg-[#d6e3d7] shadow-[inset_0_2px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
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
