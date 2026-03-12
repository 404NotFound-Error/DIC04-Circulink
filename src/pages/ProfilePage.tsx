import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Edit2, Save, X, Package, Heart, ShoppingBag } from 'lucide-react';
import { signOut, updateProfile as updateBackendProfile } from '../lib/backend';
import { apiClient } from '../lib/api';
import type { Item } from '../lib/api';
interface Favorite {
  id: string;
  itemId: string;
  item: Item;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile, isAuthenticated, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'items' | 'favorites'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    university: '',
  });

  // Items and favorites state
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [myFavorites, setMyFavorites] = useState<Favorite[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.full_name || '',
        phone: profile.phone || '',
        university: profile.university || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (activeTab === 'items' && myItems.length === 0) {
      loadMyItems();
    } else if (activeTab === 'favorites' && myFavorites.length === 0) {
      loadMyFavorites();
    }
  }, [activeTab, loadMyFavorites, loadMyItems, myFavorites.length, myItems.length]);

  const loadMyItems = useCallback(async () => {
    if (!profile) return;
    setItemsLoading(true);
    try {
      const response = await apiClient.getItems({
        sellerId: profile.id,
        page: 1,
        pageSize: 100
      });
      setMyItems(response.data || []);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setItemsLoading(false);
    }
  }, [profile]);

  const loadMyFavorites = useCallback(async () => {
    setFavoritesLoading(true);
    try {
      const response = await apiClient.getFavorites();
      setMyFavorites(response.data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset form
      setEditForm({
        name: profile?.full_name || '',
        phone: profile?.phone || '',
        university: profile?.university || '',
      });
      setError(null);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateBackendProfile(profile!.id, {
        full_name: editForm.name,
        phone: editForm.phone,
        university: editForm.university
      });
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom, #b4edc6, #bfe7e5)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('profile')}</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(to bottom, #b4edc6, #bfe7e5)' }}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=F97316&color=fff&size=128`}
                alt={profile?.full_name}
                className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border-4 border-white flex-shrink-0"
              />
              <div className="text-white text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">{profile?.full_name}</h1>
                <p className="text-orange-100 text-sm">{profile?.university || 'No university set'}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Edit2 className="h-4 w-4" />
                  <span>{t('accountInfo')}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'items'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>{t('myItems')}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'favorites'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{t('myFavorites')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {activeTab === 'info' && (
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{t('accountInfo')}</h2>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4" />
                        <span>{t('cancel')}</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4" />
                        <span>{t('edit')}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <p className="text-gray-900">{profile?.email || t('notProvided')}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('university')}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.university}
                        onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your university"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.university || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400"
                  >
                    <Save className="h-5 w-5" />
                    <span>{loading ? t('saving') : t('saveChanges')}</span>
                  </button>
                )}

                <hr className="border-gray-200" />

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('quickActions')}</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/orders')}
                      className="w-full flex items-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingBag className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-900">{t('myOrders')}</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t('signOut')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('myItems')}</h2>
                {itemsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <p className="mt-2 text-gray-600">Loading items...</p>
                  </div>
                ) : myItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">You haven't listed any items yet</p>
                    <button
                      onClick={() => navigate('/sell')}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      {t('listFirstItem')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myItems.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <img
                          src={item.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-orange-600 font-bold text-lg">${item.price}</p>
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                              item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              item.status === 'SOLD' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('myFavorites')}</h2>
                {favoritesLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <p className="mt-2 text-gray-600">Loading favorites...</p>
                  </div>
                ) : myFavorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">You haven't favorited any items yet</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      {t('browseFavorites')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myFavorites.map((favorite) => (
                      <div
                        key={favorite.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/product/${favorite.item.id}`)}
                      >
                        <img
                          src={favorite.item.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={favorite.item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{favorite.item.title}</h3>
                          <p className="text-orange-600 font-bold text-lg">${favorite.item.price}</p>
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                              favorite.item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                              favorite.item.status === 'SOLD' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {favorite.item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
