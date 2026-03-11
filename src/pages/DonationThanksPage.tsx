import React from 'react';
import { useNavigate } from 'react-router-dom';

const DonationThanksPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-sky-50 flex flex-col">
      <div className="p-6">
        <button
          onClick={() => navigate('/')}
          className="text-3xl text-emerald-800"
          aria-label="Back"
        >
          ←
        </button>
      </div>

      <div className="flex-1 flex items-start justify-center pt-8">
        <div className="w-3/4 md:w-1/2 lg:w-1/3 bg-gradient-to-r from-emerald-100/60 via-emerald-50 to-sky-100/70 rounded-xl p-12 shadow-lg border border-emerald-200">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-emerald-800 drop-shadow">Thanks for your donation!</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationThanksPage;
