import React, { useState, useRef } from 'react';

interface DonationFormPageProps {
  onNavigateBack?: () => void;
  onConfirm?: () => void;
}

const DonationFormPage: React.FC<DonationFormPageProps> = ({ onNavigateBack, onConfirm }) => {
  const [agreeBring, setAgreeBring] = useState(true);
  const [agreeClean, setAgreeClean] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-sky-50 py-12">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-6 flex items-center">
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Back
            </button>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-200 rounded-full px-12 py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-800">
              Give Your Items a Second Life
            </h1>
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-emerald-100/60 rounded-full px-8 py-3 shadow-inner text-emerald-800">
            Basic Information
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 items-start mb-8">
          <div className="md:col-span-1">
            <div className="bg-emerald-100/60 rounded-xl p-8 h-72 flex flex-col items-center justify-center shadow-lg border border-emerald-200">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 text-emerald-900 text-lg"
              >
                <span className="text-xl">+</span>
                <span>Add your images</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-emerald-50 rounded-xl p-10 h-72 flex items-center justify-center border-2 border-emerald-200 shadow-[8px_8px_0_rgba(16,185,129,0.06)]">
              <textarea
                placeholder="Describe your goods..."
                className="w-full h-full bg-transparent resize-none outline-none text-emerald-800 placeholder:opacity-80"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-8 py-3 shadow-inner text-emerald-800">
            Donation Agreement
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <label className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={agreeBring}
              onChange={() => setAgreeBring(!agreeBring)}
              className="mt-1"
            />
            <span className="text-emerald-800">
              I agree to bring the donated item to the designated campus collection area at the end of the semester.
            </span>
          </label>

          <label className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={agreeClean}
              onChange={() => setAgreeClean(!agreeClean)}
              className="mt-1"
            />
            <span className="text-emerald-800">
              I confirm that all donated items are in clean and usable condition.
            </span>
          </label>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => (typeof onConfirm === 'function' ? onConfirm() : null)}
            className="bg-emerald-50 border-2 border-emerald-200 rounded-full px-12 py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)] text-emerald-800 font-semibold text-lg"
          >
            Confirm Donation
          </button>
        </div>

      </div>
    </div>
  );
};

export default DonationFormPage;
