import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { apiClient, Category } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

interface SellDraftState {
  title: string;
  description: string;
  currentPrice: number;
  minimumAcceptablePrice?: number;
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
  const { lang } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const locationState = (location.state as { draft?: SellDraftState; editItemId?: string } | null);
  const draft = locationState?.draft;
  const editItemId = locationState?.editItemId;
  const isEditMode = Boolean(editItemId);
  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');

  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [minimumAcceptablePrice, setMinimumAcceptablePrice] = useState<string>('');
  const [condition, setCondition] = useState<string>('GOOD');
  const [categoryId, setCategoryId] = useState<string>('');
  const [existingImagePaths, setExistingImagePaths] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [autoPriceReduce, setAutoPriceReduce] = useState(false);
  const [autoDonation, setAutoDonation] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const normalizeImages = (images: unknown): string[] => {
    if (Array.isArray(images)) return images.filter((image): image is string => typeof image === 'string');
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed.filter((image): image is string => typeof image === 'string') : (images ? [images] : []);
      } catch {
        return images ? [images] : [];
      }
    }
    return [];
  };

  const resolveImageUrl = (url: string) => (url.startsWith('/uploads/') ? `${apiOrigin}${url}` : url);

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
    setMinimumAcceptablePrice(draft.minimumAcceptablePrice ? String(draft.minimumAcceptablePrice) : '');
    setCondition(draft.condition || 'GOOD');
    setCategoryId(draft.categoryId || '');
    setExistingImagePaths(draft.images || []);
    setAutoPriceReduce(Boolean(draft.autoPriceReduce));
    setAutoDonation(Boolean(draft.autoDonation));
  }, [draft]);

  useEffect(() => {
    if (!isEditMode || !editItemId) return;

    const loadItemForEdit = async () => {
      try {
        setLoadingItem(true);
        setError(null);
        const response = await apiClient.getItem(editItemId);
        const item = response.data;
        setTitle(item.title || '');
        setDescription(item.description || '');
        setCurrentPrice(String(item.price ?? ''));
        setMinimumAcceptablePrice('');
        setCondition(item.condition || 'GOOD');
        setCategoryId(item.categoryId || '');
        setExistingImagePaths(normalizeImages(item.images));
        setSelectedFiles([]);
        setPreviewUrls([]);
        setAutoPriceReduce(false);
        setAutoDonation(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : (lang === 'zh' ? '加载编辑商品失败' : 'Failed to load item for edit'));
      } finally {
        setLoadingItem(false);
      }
    };

    loadItemForEdit();
  }, [editItemId, isEditMode, lang]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError(lang === 'zh' ? '请选择图片文件' : 'Please select image files');
      return;
    }
    if (imageFiles.some((file) => file.size > 10 * 1024 * 1024)) {
      setError(lang === 'zh' ? '每张图片需小于 10MB' : 'Each image must be under 10MB');
      return;
    }
    if (existingImagePaths.length + selectedFiles.length + imageFiles.length > 5) {
      setError(lang === 'zh' ? '最多上传 5 张图片' : 'You can upload at most 5 images');
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

  const handleRemoveExistingImage = (index: number) => {
    setExistingImagePaths((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (!isAuthenticated) {
      setError(lang === 'zh' ? '请先登录后再发布商品' : 'Please sign in before listing an item');
      return;
    }
    if (!title.trim()) {
      setError(lang === 'zh' ? '请输入标题' : 'Please enter a title');
      return;
    }
    if (!description.trim()) {
      setError(lang === 'zh' ? '请输入描述' : 'Please enter a description');
      return;
    }
    if (!currentPrice || Number(currentPrice) <= 0) {
      setError(lang === 'zh' ? '请输入有效价格' : 'Please enter a valid current price');
      return;
    }
    if (minimumAcceptablePrice) {
      const minimumPrice = Number(minimumAcceptablePrice);
      const current = Number(currentPrice);
      if (Number.isNaN(minimumPrice) || minimumPrice <= 0) {
        setError(lang === 'zh' ? '请输入有效的最低可接受价格' : 'Please enter a valid minimum acceptable price');
        return;
      }
      if (minimumPrice > current) {
        setError(lang === 'zh' ? '最低可接受价格不能高于当前价格' : 'Minimum acceptable price cannot exceed current price');
        return;
      }
    }
    if (!categoryId) {
      setError(lang === 'zh' ? '请选择分类' : 'Please select a category');
      return;
    }
    if (existingImagePaths.length + selectedFiles.length === 0) {
      setError(lang === 'zh' ? '请至少上传一张图片' : 'Please upload at least one image');
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

      const finalImages = [...existingImagePaths, ...uploadedPaths];

      if (isEditMode && editItemId) {
        await apiClient.updateItem(editItemId, {
          title: title.trim(),
          description: description.trim(),
          price: Number(currentPrice),
          condition,
          categoryId,
          images: finalImages,
        });
        navigate('/profile');
        return;
      }

      const nextDraft: SellDraftState = {
        title: title.trim(),
        description: description.trim(),
        currentPrice: Number(currentPrice),
        minimumAcceptablePrice: minimumAcceptablePrice ? Number(minimumAcceptablePrice) : undefined,
        condition,
        categoryId,
        categoryName: categories.find((category) => category.id === categoryId)?.name,
        images: finalImages,
        autoPriceReduce,
        autoDonation
      };
      navigate('/sell/review', { state: { draft: nextDraft } });
    } catch (err) {
      setError(err instanceof Error ? err.message : (isEditMode ? (lang === 'zh' ? '更新商品失败' : 'Failed to update item') : (lang === 'zh' ? '上传图片失败' : 'Failed to upload images')));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate(isEditMode ? '/profile' : '/')}
            className="mr-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base"
          >
            {tBack(lang)}
          </button>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-200 rounded-full px-8 md:px-12 py-3 md:py-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-800">
              {isEditMode ? (lang === 'zh' ? '编辑商品' : 'Edit Your Item') : (lang === 'zh' ? '发布商品' : 'Sell Your Item')}
            </h1>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base shadow-inner text-emerald-800 font-medium">
            {lang === 'zh' ? '基本信息' : 'Basic Information'}
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
                <span>{lang === 'zh' ? '添加图片' : 'Add your images'}</span>
              </button>

              <button
                onClick={openFileDialog}
                disabled={uploading}
                className="mt-6 bg-emerald-200/80 hover:bg-emerald-200 rounded-md px-4 py-2 text-xs md:text-sm flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="text-lg">⭐</span>
                <span>{lang === 'zh' ? 'AI 识别' : 'AI Recognition'}</span>
              </button>
              {(existingImagePaths.length > 0 || previewUrls.length > 0) && (
                <p className="mt-3 text-xs text-emerald-800">
                  {lang === 'zh' ? `已选择 ${existingImagePaths.length + previewUrls.length} 张图片` : `${existingImagePaths.length + previewUrls.length} image(s) selected`}
                </p>
              )}
              <p className="mt-2 text-xs text-emerald-700">
                {lang === 'zh' ? '支持 PNG/JPG/WebP/GIF，单张不超过 10MB，最多 5 张。' : 'Supports PNG/JPG/WebP/GIF, up to 10MB per image, max 5 images.'}
              </p>
            </div>
            {(existingImagePaths.length > 0 || previewUrls.length > 0) && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {existingImagePaths.map((image, index) => (
                  <div key={`existing-${image}-${index}`} className="relative">
                    <img src={resolveImageUrl(image)} alt={`existing-${index}`} className="h-20 w-full object-cover rounded-lg border border-emerald-200" />
                    <button
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full px-1.5 text-xs"
                      disabled={uploading}
                    >
                      x
                    </button>
                  </div>
                ))}
                {previewUrls.map((image, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img src={image} alt={`new-${index}`} className="h-20 w-full object-cover rounded-lg border border-emerald-200" />
                    <button
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full px-1.5 text-xs"
                      disabled={uploading}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'zh' ? '商品标题...' : 'Item title...'}
              className="w-full mb-4 bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200 text-emerald-800 focus:outline-none focus:border-emerald-400"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'zh' ? '描述你的商品...' : 'Describe your goods...'}
              className="w-full h-64 md:h-72 bg-emerald-50 rounded-2xl p-6 md:p-10 border-2 border-emerald-200 shadow-[8px_8px_0_rgba(16,185,129,0.06)] text-emerald-800 focus:outline-none focus:border-emerald-400 resize-none text-sm md:text-base"
            />
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base shadow-inner text-emerald-800 font-medium">
            {lang === 'zh' ? '价格' : 'Price'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-12 border border-emerald-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                {lang === 'zh' ? '¥ 当前价格' : '¥ Current Price'}
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder={lang === 'zh' ? '输入当前价格' : 'Enter current price'}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                {lang === 'zh' ? '¥ 最低可接受价格' : '¥ Minimum Acceptable Price'}
              </label>
              <input
                type="number"
                value={minimumAcceptablePrice}
                onChange={(e) => setMinimumAcceptablePrice(e.target.value)}
                placeholder={lang === 'zh' ? '输入最低可接受价格' : 'Enter minimum acceptable price'}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                {lang === 'zh' ? '成色' : 'Condition'}
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
                {lang === 'zh' ? '分类' : 'Category'}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm md:text-base"
              >
                <option value="">{lang === 'zh' ? '选择分类' : 'Select a category'}</option>
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
              {lang === 'zh' ? '若 7 天内未售出，自动降价 10%，且不会低于最低可接受价格。' : 'If unsold after 7 days, automatically reduce price by 10%, without dropping below your minimum acceptable price.'}
            </label>
          </div>
        </div>

        {/* Donation Agreement Section */}
        <div className="mb-6">
          <div className="inline-block bg-emerald-100/60 rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base shadow-inner text-emerald-800 font-medium">
            {lang === 'zh' ? '捐赠协议' : 'Donation Agreement'}
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
              {lang === 'zh' ? '30 天后自动转捐' : 'Enable automatic donation after 30 days'}
            </label>
          </div>
          <p className="text-xs md:text-sm text-gray-600 ml-7 leading-relaxed">
            {lang === 'zh'
              ? '若商品 30 天内未售出，将自动进入合作慈善店 Buy42 的捐赠流程。学期末请将捐赠物品放至校园指定回收点。'
              : 'If your item remains unsold for 30 days, it will be automatically listed for donation to our partner charity shop Buy42. At the end of the semester, please place your donated items in the designated collection area on campus.'}
          </p>
        </div>

        {/* Submit Button */}
        {error && (
          <div className="mb-4 text-center text-sm text-red-600">{error}</div>
        )}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleNext}
            disabled={uploading || loadingItem}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg text-sm md:text-base"
          >
            {uploading || loadingItem ? (
              <span className="inline-flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                {loadingItem ? (lang === 'zh' ? '加载中...' : 'Loading...') : isEditMode ? (lang === 'zh' ? '保存中...' : 'Saving...') : (lang === 'zh' ? '上传中...' : 'Uploading...')}
              </span>
            ) : (
              isEditMode ? (lang === 'zh' ? '保存修改' : 'Save Changes') : (lang === 'zh' ? '下一步：预览商品' : 'Next: Review Your Item')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const tBack = (lang: 'en' | 'zh') => (lang === 'zh' ? '返回' : 'Back');

export default SellPage;
