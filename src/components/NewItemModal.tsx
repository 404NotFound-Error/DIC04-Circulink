import React, { useState, useRef, useEffect } from 'react';
import { X, Loader, AlertCircle, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  images?: string;
}

const NewItemModal: React.FC<NewItemModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState('GOOD');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // Categories
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        setCategories(response.data || []);
        if (response.data && response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setCondition('GOOD');
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadedImageUrls([]);
    setErrors({});
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) {
      newErrors.title = lang === 'zh' ? '标题不能为空' : 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = lang === 'zh' ? '标题至少 3 个字符' : 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = lang === 'zh' ? '标题不能超过 100 个字符' : 'Title must be less than 100 characters';
    }

    if (!description.trim()) {
      newErrors.description = lang === 'zh' ? '描述不能为空' : 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = lang === 'zh' ? '描述至少 10 个字符' : 'Description must be at least 10 characters';
    } else if (description.length > 1000) {
      newErrors.description = lang === 'zh' ? '描述不能超过 1000 个字符' : 'Description must be less than 1000 characters';
    }

    const priceNum = parseFloat(price);
    if (!price) {
      newErrors.price = lang === 'zh' ? '价格不能为空' : 'Price is required';
    } else if (isNaN(priceNum)) {
      newErrors.price = lang === 'zh' ? '价格格式不正确' : 'Price must be a valid number';
    } else if (priceNum < 0) {
      newErrors.price = lang === 'zh' ? '价格不能为负数' : 'Price cannot be negative';
    } else if (priceNum > 1000000) {
      newErrors.price = lang === 'zh' ? '价格过高' : 'Price is too high';
    }

    if (!categoryId) {
      newErrors.category = lang === 'zh' ? '分类不能为空' : 'Category is required';
    }

    if (selectedFiles.length === 0 && uploadedImageUrls.length === 0) {
      newErrors.images = lang === 'zh' ? '至少上传一张图片' : 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(lang === 'zh' ? '仅支持图片文件' : 'Only image files are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError(lang === 'zh' ? '图片需小于 10MB' : 'Image size must be less than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length + selectedFiles.length > 5) {
      setError(lang === 'zh' ? '最多上传 5 张图片' : 'Maximum 5 images allowed');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
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
      try {
        const data = await apiClient.uploadFile(file);
        urls.push(data.data.path);
      } catch (err) {
        console.error('Image upload error:', err);
        throw new Error(lang === 'zh' ? '上传图片失败' : 'Failed to upload image');
      }
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError(lang === 'zh' ? '请先登录后再发布商品' : 'You must be logged in to create an item');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Upload images first
      let imageUrls = [...uploadedImageUrls];
      if (selectedFiles.length > 0) {
        setUploading(true);
        const newUrls = await uploadImages();
        imageUrls = [...imageUrls, ...newUrls];
        setUploading(false);
      }

      // Create item
      await apiClient.createItem({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        condition: condition,
        status: 'ACTIVE',
        categoryId: categoryId,
        images: imageUrls
      });

      // Success
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'zh' ? '创建商品失败' : 'Failed to create item'));
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">{lang === 'zh' ? '发布新商品' : 'List New Item'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={submitting || uploading}
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'zh' ? '商品标题' : 'Item Title'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={lang === 'zh' ? '例如：MacBook Pro 13 M1' : 'e.g., MacBook Pro 13 inch M1'}
              disabled={submitting || uploading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'zh' ? '描述' : 'Description'} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={lang === 'zh' ? '详细描述你的商品...' : 'Describe your item in detail...'}
              disabled={submitting || uploading}
            />
            <p className="mt-1 text-sm text-gray-500">
              {description.length}/1000 {lang === 'zh' ? '字' : 'characters'}
            </p>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price and Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'zh' ? '价格($)' : 'Price ($)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={submitting || uploading}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'zh' ? '成色' : 'Condition'} <span className="text-red-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={submitting || uploading}
              >
                <option value="NEW">{lang === 'zh' ? '全新' : 'New'}</option>
                <option value="LIKE_NEW">{lang === 'zh' ? '几乎全新' : 'Like New'}</option>
                <option value="GOOD">{lang === 'zh' ? '良好' : 'Good'}</option>
                <option value="FAIR">{lang === 'zh' ? '一般' : 'Fair'}</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'zh' ? '分类' : 'Category'} <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={submitting || uploading || categories.length === 0}
            >
              {categories.length === 0 && <option value="">{lang === 'zh' ? '分类加载中...' : 'Loading categories...'}</option>}
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === 'zh' ? '图片' : 'Photos'} <span className="text-red-500">*</span>
            </label>

            {/* Image previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={submitting || uploading}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={submitting || uploading || previewUrls.length >= 5}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting || uploading || previewUrls.length >= 5}
              className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.images ? 'border-red-300' : 'border-gray-300 hover:border-green-500'
              } ${previewUrls.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {previewUrls.length === 0 ? (lang === 'zh' ? '点击上传图片' : 'Click to upload images') : (lang === 'zh' ? `已选择 ${previewUrls.length}/5 张` : `${previewUrls.length}/5 images selected`)}
              </p>
              <p className="text-sm text-gray-500">{lang === 'zh' ? 'PNG/JPG，单张不超过10MB，最多5张' : 'PNG, JPG up to 10MB • Max 5 images'}</p>
            </button>
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting || uploading}
            >
              {lang === 'zh' ? '取消' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={submitting || uploading}
            >
              {uploading && <Loader className="h-5 w-5 animate-spin" />}
              {submitting && !uploading && <Loader className="h-5 w-5 animate-spin" />}
              {uploading ? (lang === 'zh' ? '上传图片中...' : 'Uploading Images...') : submitting ? (lang === 'zh' ? '创建中...' : 'Creating...') : (lang === 'zh' ? '发布商品' : 'List Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewItemModal;
