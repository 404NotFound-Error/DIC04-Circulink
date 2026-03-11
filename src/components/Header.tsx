import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MessageCircle, Menu, X, LogOut, Sparkles, Star, Bell, ChevronDown, ShoppingCart, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/backend';
import AuthModal from './AuthModal';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNewItem: () => void;
  onShowFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNewItem, onShowFavorites }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allMenuOpen, setAllMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { lang, toggleLang, t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  

  return (
    <>
      <header className="bg-[#3f5e45] shadow-sm border-b border-[#2f4b32] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <h1 className="text-sm font-bold tracking-[0.35em] text-[#f2f8ee]">CIRCULINK</h1>
          </div>

          {/* Search Bar - Desktop (center) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center mx-6">
            <button
              type="button"
              onClick={() => navigate('/ai-recommendation')}
              className="flex items-center gap-2 rounded-lg bg-[#6a8d6d] px-3 py-1.5 text-[#e8f2e4] hover:bg-[#5a7d5d] transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#e8f2e4]" fill="currentColor" />
              <div className="text-[10px] leading-tight">
                <div className="font-semibold">AI Search</div>
                <div className="text-[9px] opacity-90">Assistant</div>
              </div>
            </button>
            <div className="ml-4 flex h-8 flex-1 items-stretch overflow-visible rounded-md border border-[#8db28d] bg-[#e6f0e1] relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAllMenuOpen((prev) => !prev)}
                  className="flex h-full items-center gap-1 border-r border-[#8db28d] bg-[#d9e8d2] px-3 text-xs font-semibold text-[#35513a]"
                >
                  All
                  <ChevronDown className="h-3 w-3" fill="currentColor" />
                </button>
                {allMenuOpen && (
                  <div className="absolute left-0 top-10 w-48 rounded-md bg-[#f3faf0] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.45)] border border-[#c8ddc3] text-[#2f4b32] text-[10px]">
                    <div className="px-3 py-2 space-y-1">
                      <button
                        onClick={() => {
                          navigate('/category/clothing');
                          setAllMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-[#e8f4e5] p-1.5 rounded transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#73b07b]" />
                        Clothing
                      </button>
                      <button
                        onClick={() => {
                          navigate('/category/furniture');
                          setAllMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-[#e8f4e5] p-1.5 rounded transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#73b07b]" />
                        Furniture
                      </button>
                      <button
                        onClick={() => {
                          navigate('/category/electronics');
                          setAllMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-[#e8f4e5] p-1.5 rounded transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#73b07b]" />
                        Electronics
                      </button>
                      <button
                        onClick={() => {
                          navigate('/category/office-supplies');
                          setAllMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-[#e8f4e5] p-1.5 rounded transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#73b07b]" />
                        Office &amp; Study Supplies
                      </button>
                      <button
                        onClick={() => {
                          navigate('/category/food-snacks');
                          setAllMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-[#e8f4e5] p-1.5 rounded transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#73b07b]" />
                        Food &amp; Snacks
                      </button>
                      <button
                        onClick={() => {
                          navigate('/category/daily-essentials');
                          setAllMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-[#e8f4e5] p-1.5 rounded transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#73b07b]" />
                        Daily Essentials
                      </button>
                      <button
                        onClick={() => {
                          navigate('/category/art-decor');
                          setAllMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-[#e8f4e5] p-1.5 rounded transition-colors"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#73b07b]" />
                        Art &amp; Decor
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-full w-full bg-transparent px-3 text-xs text-[#35513a] placeholder:text-[#6f8f6f] focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-full items-center justify-center border-l border-[#8db28d] bg-[#86b18a] px-3 text-[#2f4b32]"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5 text-xs text-[#e6f1e2]">
            <div className="relative">
              <button onClick={() => setLangMenuOpen((prev) => !prev)} className="flex items-center gap-1">
                {lang === 'en' ? 'EN' : 'ZH'}
                <ChevronDown className="h-3 w-3" fill="currentColor" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-8 w-40 rounded-md bg-[#f3faf0] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.45)] border border-[#c8ddc3] text-[#2f4b32] text-[10px]">
                  <div className="px-3 py-2 space-y-2">
                    <div className="text-[9px] uppercase tracking-wider text-[#4b6b4f]">Change Language</div>
                    <button
                      onClick={() => {
                        if (lang !== 'en') toggleLang();
                        setLangMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#56b06a]" />
                      English-EN
                    </button>
                    <button
                      onClick={() => {
                        if (lang !== 'zh') toggleLang();
                        setLangMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#c7d8c6]" />
                      Chinese-CN
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => navigate('/profile')} className="hover:text-white">
              Profile
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-white">
              About
            </button>
            <button
              onClick={onShowFavorites}
              className="p-1.5 text-[#e6f1e2] hover:text-white"
              aria-label={t('favorites')}
            >
              <Star className="h-4 w-4" fill="currentColor" />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="p-1.5 text-[#e6f1e2] hover:text-white relative"
              aria-label={t('cart')}
            >
              <ShoppingCart className="h-4 w-4" fill="currentColor" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#f0d27a]" />
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="p-1.5 text-[#e6f1e2] hover:text-white"
              aria-label="Orders"
            >
              <Package className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="p-1.5 text-[#e6f1e2] hover:text-white relative"
              aria-label={t('messages')}
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#f27b7b]" />
            </button>
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-4 py-1.5 text-[#e6f1e2] hover:text-white border border-[#e6f1e2] rounded-md hover:bg-[#4d6f50] transition-colors"
                >
                  {t('signIn')}
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-1.5 bg-[#6ea16f] text-white rounded-md hover:bg-[#5d8f5e] transition-colors"
                >
                  {t('signUp')}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#e6f1e2] hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6f8f6f]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-[#89a789] bg-[#edf6e7] rounded-lg focus:ring-2 focus:ring-[#7aa07a] focus:border-[#7aa07a] text-[#2f4b32] placeholder:text-[#7a997a]"
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
                    className="bg-[#6ea16f] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('sellItem')}</span>
                  </button>
                  <button 
                    onClick={onShowFavorites}
                    className="flex items-center justify-center space-x-2 text-[#e6f1e2]"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{t('favorites')}</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 text-[#e6f1e2]">
                    <MessageCircle className="h-5 w-5" />
                    <span>{t('messages')}</span>
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center space-x-2 text-[#e6f1e2]"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('signOut')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-[#e6f1e2] px-4 py-2 rounded-lg"
                  >
                    {t('signIn')}
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-[#6ea16f] text-white px-4 py-2 rounded-lg"
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
      <div className="bg-[#d7ecd0] border-t border-b border-[#b4d3b1]">
        <div className="w-full">
          <div className="flex items-stretch">
            <button onClick={() => navigate('/buy')} className="flex-1 text-center py-3 text-[#2f4b32] hover:bg-[#c6e1c1] transition-colors font-medium text-sm sm:text-base shadow-inner">
              Start Buying
            </button>
            <div className="w-px bg-[#b4d3b1]" />
            <button onClick={() => navigate('/sell')} className="flex-1 text-center py-3 text-[#2f4b32] hover:bg-[#c6e1c1] transition-colors font-medium text-sm sm:text-base shadow-inner">
              Sell Now
            </button>
            <div className="w-px bg-[#b4d3b1]" />
            <button onClick={() => navigate('/donation')} className="flex-1 text-center py-3 text-[#2f4b32] hover:bg-[#c6e1c1] transition-colors font-medium text-sm sm:text-base shadow-inner">
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
