import { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#06B6D4',
    background: 'from-blue-400 via-blue-500 to-blue-600',
    text: '#1F2937',
    gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#F59E0B',
    secondary: '#DC2626',
    accent: '#EF4444',
    background: 'from-orange-400 via-red-500 to-pink-500',
    text: '#1F2937',
    gradient: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500'
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    background: 'from-emerald-400 via-green-500 to-teal-500',
    text: '#1F2937',
    gradient: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A855F7',
    background: 'from-purple-900 via-blue-900 to-indigo-900',
    text: '#F9FAFB',
    gradient: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    primary: '#EC4899',
    secondary: '#BE185D',
    accent: '#F472B6',
    background: 'from-pink-400 via-rose-400 to-red-400',
    text: '#1F2937',
    gradient: 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400'
  }
];