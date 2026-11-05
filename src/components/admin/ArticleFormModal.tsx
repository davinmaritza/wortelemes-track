'use client';

import React, { useState, useEffect } from 'react';
import { ArticleItem } from '@/types/diecast';
import { X, Newspaper, Edit3, PlusCircle } from 'lucide-react';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleToEdit?: ArticleItem | null;
  onSave: (article: ArticleItem) => void;
}

export const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  isOpen,
  onClose,
  articleToEdit,
  onSave,
}) => {
  const isEditing = Boolean(articleToEdit);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('RLC Drops & Calendar');
  const [tag, setTag] = useState('Drop Alert');
  const [date, setDate] = useState('');
  const [readTime, setReadTime] = useState('3 min read');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setCategory(articleToEdit.category);
      setTag(articleToEdit.tag);
      setDate(articleToEdit.date);
      setReadTime(articleToEdit.readTime);
      setExcerpt(articleToEdit.excerpt);
      setContent(articleToEdit.content || '');
    } else {
      const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      setTitle('');
      setCategory('RLC Drops & Calendar');
      setTag('Drop Alert');
      setDate(today);
      setReadTime('3 min read');
      setExcerpt('');
      setContent('');
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    const savedData: ArticleItem = {
      id: articleToEdit?.id || `art-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      tag: tag.trim(),
      date: date.trim() || 'Nov 2026',
      readTime: readTime.trim() || '3 min read',
      excerpt: excerpt.trim(),
      content: content.trim(),
    };

    onSave(savedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#12141c] border border-white/[0.08] w-full max-w-lg rounded-2xl p-5 flex flex-col max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Edit3 className="w-4 h-4 text-amber-400" />
            ) : (
              <PlusCircle className="w-4 h-4 text-white" />
            )}
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
              {isEditing ? 'Edit Collector Article' : 'Publish New Article'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">
              Article Headline / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Red Line Club (RLC) Drop Calendar..."
              className="w-full bg-[#161822] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#161822] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
              >
                <option value="RLC Drops & Calendar">RLC Drops & Calendar</option>
                <option value="Care & Preservation">Care & Preservation</option>
                <option value="Market Insights">Market Insights</option>
                <option value="Authentication">Authentication</option>
                <option value="Casting Spotlight">Casting Spotlight</option>
                <option value="Convention News">Convention News</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Badge / Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Drop Alert, Guide"
                className="w-full bg-[#161822] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Display Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Nov 5, 2026"
                className="w-full bg-[#161822] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 4 min read"
                className="w-full bg-[#161822] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">
              Short Summary / Excerpt *
            </label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Concise 1-2 sentence overview for the cards..."
              className="w-full bg-[#161822] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40 leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">
              Full Article Story / Content (Optional)
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write detailed guides, specifications, or drop details..."
              className="w-full bg-[#161822] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40 leading-relaxed resize-y"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 font-medium py-2.5 rounded-xl text-xs transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-white hover:bg-neutral-200 active:scale-95 text-black font-semibold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
            >
              {isEditing ? 'Save Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
