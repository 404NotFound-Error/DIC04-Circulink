import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/api';

const DonationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [description, setDescription] = useState('');
  const [agreeBring, setAgreeBring] = useState(true);
  const [agreeClean, setAgreeClean] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Categories
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [donationCategoryId, setDonationCategoryId] = useState<string>('');

  // UI state
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories and find or create donation category
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        setCategories(response.data || []);
        // Find "Other" or first category for donations
        const otherCat = response.data?.find(c => c.name.toLowerCase().includes('other'));
        if (otherCat) {
          setDonationCategoryId(otherCat.id);
        } else if (response.data && response.data.length > 0) {
          setDonationCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length + selectedFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/uploads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiClient.getToken()}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        urls.push(data.data.url);
      } catch (err) {
        console.error('Image upload error:', err);
        throw new Error('Failed to upload image');
      }
    }

    return urls;
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Please log in to donate items');
      return;
    }

    if (!description.trim()) {
      setError('Please describe your donation');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please add at least one image');
      return;
    }

    if (!agreeBring || !agreeClean) {
      setError('Please agree to all donation terms');
      return;
    }

    if (!donationCategoryId) {
      setError('Category not loaded, please try again');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Upload images
      setUploading(true);
      const imageUrls = await uploadImages();
      setUploading(false);

      // Create donation as a special item with price 0
      await apiClient.createItem({
        title: `Donation: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`,
        description: `[DONATION] ${description}\n\nDonation Agreement:\n- Will bring to campus collection area\n- Item is clean and usable`,
        price: 0,
        condition: 'GOOD',
        status: 'ACTIVE',
        categoryId: donationCategoryId,
        images: imageUrls
      });

      // Navigate to thank you page
      navigate('/donation/thanks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit donation');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-sky-50 py-12">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate('/donation')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            disabled={submitting || uploading}
          >
            Back
          </button>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-200 rounded-full px-12 py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-800">
              Give Your Items a Second Life
            </h1>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="inline-block bg-emerald-100/60 rounded-full px-8 py-3 shadow-inner text-emerald-800">
            Basic Information
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 items-start mb-8">
          {/* Images Section */}
          <div className="md:col-span-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={submitting || uploading || previewUrls.length >= 5}
            />

            {previewUrls.length > 0 ? (
              <div className="space-y-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl border-2 border-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={submitting || uploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {previewUrls.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting || uploading}
                    className="w-full bg-emerald-100/60 rounded-xl p-8 flex items-center justify-center border-2 border-dashed border-emerald-300 hover:border-emerald-400 transition-colors"
                  >
                    <span className="text-emerald-900">+ Add More ({previewUrls.length}/5)</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-emerald-100/60 rounded-xl p-8 h-72 flex flex-col items-center justify-center shadow-lg border border-emerald-200">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting || uploading}
                  className="flex flex-col items-center gap-3 text-emerald-900"
                >
                  <ImageIcon className="h-12 w-12" />
                  <span className="text-lg">Add your images</span>
                  <span className="text-sm text-emerald-700">Max 5 images • 10MB each</span>
                </button>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="md:col-span-2">
            <div className="bg-emerald-50 rounded-xl p-10 h-72 flex items-center justify-center border-2 border-emerald-200 shadow-[8px_8px_0_rgba(16,185,129,0.06)]">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goods... (What are you donating? Condition? Any special notes?)"
                className="w-full h-full bg-transparent resize-none outline-none text-emerald-800 placeholder:opacity-80"
                disabled={submitting || uploading}
              />
            </div>
            <p className="mt-2 text-sm text-emerald-700 text-right">
              {description.length}/1000 characters
            </p>
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
              disabled={submitting || uploading}
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
              disabled={submitting || uploading}
            />
            <span className="text-emerald-800">
              I confirm that all donated items are in clean and usable condition.
            </span>
          </label>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || uploading || !agreeBring || !agreeClean}
            className="bg-emerald-50 border-2 border-emerald-200 rounded-full px-12 py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)] text-emerald-800 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-100 transition-colors flex items-center gap-2"
          >
            {uploading && <Loader className="h-5 w-5 animate-spin" />}
            {submitting && !uploading && <Loader className="h-5 w-5 animate-spin" />}
            {uploading ? 'Uploading Images...' : submitting ? 'Submitting...' : 'Confirm Donation'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DonationFormPage;
