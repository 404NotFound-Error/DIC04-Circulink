import React, { useState } from 'react';
import { Search, Plus, MessageCircle, User, Menu, X, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth';
import AuthModal from './AuthModal';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNewItem: () => void;
  onShowFavorites: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAbout: () => void;
  onNavigateToCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNewItem, onShowFavorites, onNavigateToProfile, onNavigateToAbout, onNavigateToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();
  const { user, profile, isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  

  return (
    <>
      <header className="bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-white">Circulink</h1>
          </div>

          {/* Search Bar - Desktop (center) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border-2 border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </form>

          {/* Desktop Navigation: language, profile, About, icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language switch */}
            <div>
              <button
                onClick={toggleLang}
                className="px-3 py-1 bg-gray-800 text-gray-200 rounded-md border border-gray-700 hover:bg-gray-700"
                aria-label="Toggle language"
              >
                {lang === 'en' ? 'EN' : '中'}
              </button>
            </div>

            {/* Profile button */}
            <button
              onClick={onNavigateToProfile}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
              aria-label={t('profile')}
            >
              <User className="h-5 w-5 inline-block mr-2" />
              {t('profile')}
            </button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white"
                    >
                      <img
                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=F97316&color=fff`}
                        alt={profile?.full_name}
                        className="w-8 h-8 rounded-full border-2 border-orange-500"
                      />
                      <span className="text-sm font-medium">{profile?.full_name}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                          <p className="text-xs text-gray-500">{profile?.university}</p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t('signOut')}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button onClick={onNavigateToAbout} className="text-sm text-gray-300 hover:text-white">{t('about')}</button>
                  
                </div>
              </>
            ) : (
                <div className="flex items-center space-x-3">
              <button onClick={onNavigateToAbout} className="text-sm text-gray-300 hover:text-white">{t('about')}</button>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                    {t('signIn')}
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    {t('signUp')}
                </button>
              </div>
            )}

            {/* Right-side icons visible to all desktop users */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onShowFavorites}
                className="p-2 text-gray-300 hover:text-orange-400 hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-110"
                aria-label={t('favorites')}
              >
                <Heart className="h-6 w-6" />
              </button>

              <button onClick={onNavigateToCart} className="p-2 text-gray-300 hover:text-orange-400 hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-110" aria-label={t('cart')}>
                <ShoppingBag className="h-6 w-6" />
              </button>

              <button className="p-2 text-gray-300 hover:text-orange-400 hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-110 relative" aria-label={t('messages')}>
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">3</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border-2 border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onNewItem}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('sellItem')}</span>
                  </button>
                  <button 
                    onClick={onShowFavorites}
                    className="flex items-center justify-center space-x-2 text-gray-600"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{t('favorites')}</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 text-gray-600">
                    <MessageCircle className="h-5 w-5" />
                    <span>{t('messages')}</span>
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center space-x-2 text-gray-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('signOut')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-gray-600 px-4 py-2 rounded-lg"
                  >
                    {t('signIn')}
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                  >
                    {t('signUp')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      </header>

      {/* Sub-top bar with three action buttons */}
      <div className="bg-emerald-100 border-t border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-stretch">
            <button className="flex-1 text-center py-4 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium text-lg shadow-inner">
              Start Buying
            </button>
            <div className="w-px bg-emerald-200" />
            <button className="flex-1 text-center py-4 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium text-lg shadow-inner">
              Sell Now
            </button>
            <div className="w-px bg-emerald-200" />
            <button className="flex-1 text-center py-4 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium text-lg shadow-inner">
              Donation
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Header;
