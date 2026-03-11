import React from 'react';

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

interface CategorySectionProps {
  title: string;
  products: Product[];
  bgColor?: string;
  onViewAll: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, products, onViewAll }) => {
  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-3xl p-8 relative">
          {/* Title */}
          <h2 className="text-3xl font-bold text-green-900 mb-8">{title}</h2>

          {/* Products Grid - Limited to 4 visible items with horizontal scroll */}
          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 min-w-max pr-4">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-48"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-full flex flex-col">
                      {/* Image Container */}
                      <div className="aspect-square bg-gray-100 relative overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Footer with icons */}
                      <div className="p-4 flex items-center justify-between flex-shrink-0">
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1.5 text-yellow-400 hover:bg-yellow-50 rounded-full transition-colors">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View All Button */}
          <button 
            onClick={onViewAll}
            className="absolute bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
