import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';
import { signOut } from '../lib/auth';

const ProfilePage: React.FC<{ onNavigateBack: () => void }> = ({ onNavigateBack }) => {
  const { t } = useLanguage();
  const { profile, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigateBack();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom, #b4edc6, #bfe7e5)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('profile')}</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <button
            onClick={onNavigateBack}
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
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onNavigateBack}
          className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <img
                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=F97316&color=fff&size=128`}
                alt={profile?.full_name}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div className="text-white">
                <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
                <p className="text-orange-100">{profile?.university}</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 py-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{profile?.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{profile?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <p className="text-gray-900">{profile?.university || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <button
                onClick={handleSignOut}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
