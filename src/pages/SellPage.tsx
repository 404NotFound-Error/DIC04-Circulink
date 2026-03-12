import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { apiClient, Category } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface SellDraftState {
  title: string;
  description: string;
  currentPrice: number;
  originalPrice?: number;
  condition: string;
  categoryId: string;
  categoryName?: string;
  images: string[];
  autoPriceReduce: boolean;
  autoDonation: boolean;
}

const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const draft = (location.state as { draft?: SellDraftState } | null)?.draft;

  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [condition, setCondition] = useState<string>('GOOD');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [autoPriceReduce, setAutoPriceReduce] = useState(false);
  const [autoDonation, setAutoDonation] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        setCategories(response.data || []);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!draft) return;
    setTitle(draft.title || '');
    setDescription(draft.description || '');
    setCurrentPrice(draft.currentPrice ? String(draft.currentPrice) : '');
    setOriginalPrice(draft.originalPrice ? String(draft.originalPrice) : '');
    setCondition(draft.condition || 'GOOD');
    setCategoryId(draft.categoryId || '');
    setAutoPriceReduce(Boolean(draft.autoPriceReduce));
    setAutoDonation(Boolean(draft.autoDonation));
  }, [draft]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError('Please select image files');
      return;
    }
    if (imageFiles.some((file) => file.size > 10 * 1024 * 1024)) {
      setError('Each image must be under 10MB');
      return;
    }
    if (selectedFiles.length + imageFiles.length > 5) {
      setError('You can upload at most 5 images');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...imageFiles]);

    const readers = imageFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((urls) => {
      setPreviewUrls((prev) => [...prev, ...urls]);
      setError(null);
    });
  };

  const handleNext = async () => {
    if (!isAuthenticated) {
      setError('Please sign in before listing an item');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!currentPrice || Number(currentPrice) <= 0) {
      setError('Please enter a valid current price');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const uploadedPaths: string[] = [];
      for (const file of selectedFiles) {
        const response = await apiClient.uploadFile(file);
        uploadedPaths.push(response.data.path);
      }

      const draft: SellDraftState = {
        title: title.trim(),
        description: description.trim(),
        currentPrice: Number(currentPrice),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        condition,
        categoryId,
        categoryName: categories.find((category) => category.id === categoryId)?.name,
        images: uploadedPaths,
        autoPriceReduce,
        autoDonation
      };
      navigate('/sell/review', { state: { draft } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate('/')}
            className="mr-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base"
          >
            Back
          </button>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-200 rounded-full px-8 md:px-12 py-3 md:py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-800">Sell Your Item</h1>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base shadow-inner text-emerald-800 font-medium">
            Basic Information
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-6 mb-12">
          <div className="md:col-span-1">
            <div className="bg-emerald-100/60 rounded-2xl p-6 md:p-8 h-64 md:h-72 flex flex-col items-center justify-center shadow-lg border border-emerald-200">
              <input
                ref={fileInputRef}
                onChange={handleFileSelect}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
              />

              <button onClick={openFileDialog} className="flex items-center gap-2 text-emerald-900 text-base md:text-lg hover:opacity-80 transition-opacity" disabled={uploading}>
                <span className="text-lg md:text-xl">📷</span>
                <span>Add your images</span>
              </button>

              <button
                onClick={openFileDialog}
                disabled={uploading}
                className="mt-6 bg-emerald-200/80 hover:bg-emerald-200 rounded-md px-4 py-2 text-xs md:text-sm flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="text-lg">⭐</span>
                <span>AI Recognition</span>
              </button>
              {previewUrls.length > 0 && (
                <p className="mt-3 text-xs text-emerald-800">{previewUrls.length} image(s) selected</p>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item title..."
              className="w-full mb-4 bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200 text-emerald-800 focus:outline-none focus:border-emerald-400"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goods..."
              className="w-full h-64 md:h-72 bg-emerald-50 rounded-2xl p-6 md:p-10 border-2 border-emerald-200 shadow-[8px_8px_0_rgba(16,185,129,0.06)] text-emerald-800 focus:outline-none focus:border-emerald-400 resize-none text-sm md:text-base"
            />
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base shadow-inner text-emerald-800 font-medium">
            Price
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-12 border border-emerald-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                ¥ Current Price
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="Enter current price"
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                ¥ Original Price
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter original price"
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm md:text-base"
              >
                <option value="NEW">NEW</option>
                <option value="LIKE_NEW">LIKE_NEW</option>
                <option value="GOOD">GOOD</option>
                <option value="FAIR">FAIR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm md:text-base"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg">
            <input
              type="radio"
              id="autoPriceReduce"
              checked={autoPriceReduce}
              onChange={(e) => setAutoPriceReduce(e.target.checked)}
              className="mt-1 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="autoPriceReduce" className="text-sm md:text-base text-gray-700 cursor-pointer flex-1">
              If unsold after 7 days, automatically reduce price by 10%.
            </label>
          </div>
        </div>

        {/* Donation Agreement Section */}
        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base shadow-inner text-emerald-800 font-medium">
            Donation Agreement
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-12 border border-emerald-100">
          <div className="flex items-start gap-3 mb-4">
            <input
              type="radio"
              id="autoDonation"
              checked={autoDonation}
              onChange={(e) => setAutoDonation(e.target.checked)}
              className="mt-1 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="autoDonation" className="text-sm md:text-base font-medium text-gray-800 cursor-pointer">
              Enable automatic donation after 30 days
            </label>
          </div>
          <p className="text-xs md:text-sm text-gray-600 ml-7 leading-relaxed">
            If your item remains unsold for 30 days, it will be automatically listed for donation to our partner charity shop Buy42. At the end of the semester, please place your donated items in the designated collection area on campus.
          </p>
        </div>

        {/* Submit Button */}
        {error && (
          <div className="mb-4 text-center text-sm text-red-600">{error}</div>
        )}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleNext}
            disabled={uploading}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg text-sm md:text-base"
          >
            {uploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              'Next: Review Your Item'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
