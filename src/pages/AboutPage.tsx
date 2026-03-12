import React from 'react';
import { useNavigate } from 'react-router-dom';
import AboutSection from '../components/AboutSection';
import { useLanguage } from '../context/LanguageContext';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(to bottom, #B7D9B2, #5BC4B0, #289E8C)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← {lang === 'zh' ? '返回' : 'Back'}
        </button>

        <AboutSection />
      </div>
    </div>
  );
};

export default AboutPage;
