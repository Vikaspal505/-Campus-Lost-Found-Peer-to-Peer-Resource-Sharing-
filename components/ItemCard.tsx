'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Item } from '@/types';

interface ItemCardProps {
  item: Item;
  showActions?: boolean;
  onResolve?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ItemCard({ item, showActions, onResolve, onDelete }: ItemCardProps) {
  const [imgError, setImgError] = useState(false);

  const categoryIcons: Record<string, string> = {
    Electronics: '💻',
    Books: '📚',
    Clothing: '👕',
    Accessories: '⌚',
    'ID Cards': '🪪',
    Keys: '🔑',
    Bags: '🎒',
    'Sports Equipment': '⚽',
    Other: '📦',
  };

  const getRelativeTime = (date: any) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-hover hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image or Visual Header */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {item.imageUrl && !imgError ? (
          <Image
            src={item.imageUrl}
            alt={item.description}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 text-center">
            <span className="text-4xl mb-2 filter drop-shadow-sm">
              {categoryIcons[item.category] || '📦'}
            </span>
            <span className="text-xs font-semibold text-slate-500">{item.category}</span>
          </div>
        )}

        {/* Top Badges overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Lost / Found Pill */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm backdrop-blur-md ${
              item.type === 'lost'
                ? 'bg-rose-500/95 text-white'
                : 'bg-emerald-600/95 text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {item.type === 'lost' ? 'LOST' : 'FOUND'}
          </span>

          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm ${
              item.status === 'resolved'
                ? 'bg-slate-800/80 text-white'
                : item.status === 'matched'
                ? 'bg-amber-500/90 text-white'
                : 'bg-white/90 text-slate-700'
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Chip */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-sm">{categoryIcons[item.category] || '📦'}</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {item.category}
            </span>
          </div>

          {/* Item Description */}
          <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.description}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3">
            <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        {/* Card Footer: User & Time */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
              {item.userName ? item.userName.charAt(0) : 'U'}
            </div>
            <span className="truncate text-slate-600 font-medium">{item.userName}</span>
          </div>
          <span className="text-[11px] text-slate-400 whitespace-nowrap">
            {getRelativeTime(item.createdAt)}
          </span>
        </div>

        {/* Optional custom actions */}
        {showActions && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
            {onResolve && item.status !== 'resolved' && (
              <button
                onClick={() => onResolve(item.id!)}
                className="flex-1 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark Recovered
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item.id!)}
                className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition-colors"
                title="Remove Report"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
