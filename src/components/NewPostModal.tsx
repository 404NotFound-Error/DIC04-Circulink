import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Theme } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: { title: string; excerpt: string; content: string; tags: string[] }) => void;
  currentTheme: Theme;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSave, currentTheme }) => {
  const { lang } = useLanguage();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const textColor = currentTheme.id === 'midnight' ? 'text-white' : 'text-gray-800';
  const inputBg = currentTheme.id === 'midnight' ? 'bg-gray-700' : 'bg-gray-50';

  const handleSave = () => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) return;

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onSave({ title, excerpt, content, tags });
    
    // Reset form
    setTitle('');
    setExcerpt('');
    setContent('');
    setTagsInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full ${currentTheme.id === 'midnight' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="sticky top-0 bg-inherit border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${textColor}`}>{lang === 'zh' ? '创建新帖子' : 'Create New Post'}</h2>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${textColor}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              {lang === 'zh' ? '标题' : 'Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
              placeholder={lang === 'zh' ? '输入帖子标题...' : 'Enter your post title...'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              {lang === 'zh' ? '摘要' : 'Excerpt'}
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
              placeholder={lang === 'zh' ? '简要描述你的帖子...' : 'Brief description of your post...'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              {lang === 'zh' ? '标签（逗号分隔）' : 'Tags (comma-separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={`w-full px-3 py-2 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor}`}
              placeholder={lang === 'zh' ? 'React, JavaScript, Web 开发' : 'React, JavaScript, Web Development'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              {lang === 'zh' ? '内容（支持 Markdown）' : 'Content (Markdown supported)'}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${textColor} font-mono text-sm`}
              placeholder={lang === 'zh' ? `# 你的帖子标题

在这里使用 Markdown 语法撰写内容...

## 小标题

- 列表项 1
- 列表项 2

正文从这里开始。` : `# Your Post Title

Write your content here using Markdown syntax...

## Subheading

- List item 1
- List item 2

Your paragraphs go here.`}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={!title.trim() || !excerpt.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              {lang === 'zh' ? '保存帖子' : 'Save Post'}
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${textColor}`}
            >
              {lang === 'zh' ? '取消' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;
