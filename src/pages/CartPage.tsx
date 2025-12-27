import React from 'react';
import { Trash } from 'lucide-react';

const sampleCart = [
  { id: '1', title: 'Item3', subtitle: 'electric', price: 10 },
  { id: '2', title: 'item2', subtitle: 'Extra', price: 25 },
  { id: '3', title: 'Item1', subtitle: 'T-Shirt', price: 5 },
];

const CartPage: React.FC<{ onNavigateBack: () => void }> = ({ onNavigateBack }) => {
  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(to bottom, #b4edc6, #bfe7e5)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <button onClick={onNavigateBack} className="mb-4 px-3 py-1 text-gray-700 hover:text-gray-900">← Back</button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Shopping cart</h2>
        <p className="text-sm text-gray-600 mb-6">You have {sampleCart.length} item in your cart</p>

        <div className="space-y-6">
          {sampleCart.map((item) => (
            <div key={item.id} className="relative rounded-lg bg-white/60 shadow-md p-6 border border-gray-100 flex items-center">
              <div className="w-28 h-20 bg-gray-200 rounded-md mr-6" />

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.subtitle}</p>
              </div>

              <div className="text-right mr-6">
                <div className="text-lg font-bold text-gray-900">${item.price}</div>
              </div>

              <button className="p-2 text-gray-600 hover:text-red-600" aria-label="remove">
                <Trash className="h-5 w-5" />
              </button>

              <div className="absolute right-[-72px] top-1/2 transform -translate-y-1/2">
                <button className="bg-green-100 text-green-800 px-5 py-4 rounded-lg shadow-md hover:bg-green-200">BUY</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
