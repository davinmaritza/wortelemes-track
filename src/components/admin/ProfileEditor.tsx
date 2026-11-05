'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CollectorProfile,
  ProfileFaqItem,
  ProfilePillarItem,
} from '@/types/diecast';
import {
  getStoredProfile,
  saveStoredProfile,
  resetStoredProfile,
  defaultProfile,
} from '@/lib/storage/profileStorage';
import {
  User,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Upload,
  Camera,
  RotateCcw,
  Save,
  Check,
  Plus,
  Trash2,
  HelpCircle,
  Award,
  Package,
  Truck,
  Shield,
  Eye,
  Sparkles,
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const ProfileEditor: React.FC = () => {
  const [garageName, setGarageName] = useState(defaultProfile.garageName);
  const [collectorBadge, setCollectorBadge] = useState(defaultProfile.collectorBadge);
  const [bio, setBio] = useState(defaultProfile.bio);
  const [whatsappNumber, setWhatsappNumber] = useState(defaultProfile.whatsappNumber);
  const [location, setLocation] = useState(defaultProfile.location);
  const [avatarUrl, setAvatarUrl] = useState(defaultProfile.avatarUrl);
  const [instagramHandle, setInstagramHandle] = useState(defaultProfile.instagramHandle || '');
  const [pillars, setPillars] = useState<ProfilePillarItem[]>(defaultProfile.pillars);
  const [faqs, setFaqs] = useState<ProfileFaqItem[]>(defaultProfile.faqs);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile from storage on mount
  useEffect(() => {
    const data = getStoredProfile();
    setGarageName(data.garageName || defaultProfile.garageName);
    setCollectorBadge(data.collectorBadge || defaultProfile.collectorBadge);
    setBio(data.bio || defaultProfile.bio);
    setWhatsappNumber(data.whatsappNumber || defaultProfile.whatsappNumber);
    setLocation(data.location || defaultProfile.location);
    setAvatarUrl(data.avatarUrl || defaultProfile.avatarUrl);
    setInstagramHandle(data.instagramHandle || '');
    setPillars(data.pillars?.length ? data.pillars : defaultProfile.pillars);
    setFaqs(data.faqs?.length ? data.faqs : defaultProfile.faqs);
  }, []);

  // Handle Avatar Image File Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload avatar image');
      }

      setAvatarUrl(data.url);
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setUploadError(err.message || 'Avatar upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CollectorProfile = {
      garageName: garageName.trim() || 'WORTELEMES GARAGE',
      collectorBadge: collectorBadge.trim() || 'Verified Collector',
      bio: bio.trim(),
      whatsappNumber: whatsappNumber.trim() || '6281234567890',
      location: location.trim() || 'Indonesia',
      avatarUrl: avatarUrl.trim() || '/logo.png',
      instagramHandle: instagramHandle.trim(),
      pillars,
      faqs,
    };

    saveStoredProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Reset profile details and FAQs to initial curator defaults?')) {
      const def = resetStoredProfile();
      setGarageName(def.garageName);
      setCollectorBadge(def.collectorBadge);
      setBio(def.bio);
      setWhatsappNumber(def.whatsappNumber);
      setLocation(def.location);
      setAvatarUrl(def.avatarUrl);
      setInstagramHandle(def.instagramHandle || '');
      setPillars(def.pillars);
      setFaqs(def.faqs);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Pillar updates
  const handlePillarChange = (
    index: number,
    field: 'title' | 'description' | 'icon',
    value: string
  ) => {
    setPillars((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // FAQ updates
  const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddFaq = () => {
    const newFaq: ProfileFaqItem = {
      id: `faq-${Date.now()}`,
      q: 'New Question Title?',
      a: 'Answer description explaining your policy or collection details.',
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const renderPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="w-4 h-4 text-blue-400" />;
      case 'package':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'truck':
        return <Truck className="w-4 h-4 text-amber-400" />;
      case 'shield':
      default:
        return <Shield className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Notification Toast */}
      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile and trust parameters saved! Live showcase updated in real time.</span>
          </div>
          <span className="text-[10px] uppercase font-black bg-emerald-500/20 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
      )}

      {/* Main Grid: Form Controls (Left) & Live Public Mirror (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 7 cols on LG */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-7 flex flex-col gap-5 bg-[#111219] border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 font-sans uppercase">
                <User className="w-4 h-4 text-gray-400" />
                Curator Identity & Policies
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure garage display name, verification insignia, direct WhatsApp hotline, and grading standards.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08] px-2.5 py-1.5 rounded-xl transition-colors font-medium"
                title="Reset to default profile"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-black font-semibold text-xs px-4 py-1.5 rounded-xl active:scale-95 transition-all shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* 1. Identity & Avatar */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar Preview & Upload */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative w-20 h-20 rounded-2xl bg-[#1a1d26] border border-[#242735] overflow-hidden p-1 shadow-inner">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40">
                  <Image
                    src={avatarUrl || '/logo.png'}
                    alt="Avatar Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-blue-950/30 border border-blue-900/40 px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
              >
                <Upload className="w-3 h-3" />
                <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
              </button>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Garage Display Name
                </label>
                <input
                  type="text"
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  placeholder="e.g. WORTELEMES GARAGE"
                  required
                  className="w-full bg-[#12141c] border border-white/[0.08] focus:border-white/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Collector Badge Label
                </label>
                <input
                  type="text"
                  value={collectorBadge}
                  onChange={(e) => setCollectorBadge(e.target.value)}
                  placeholder="e.g. Verified Collector"
                  required
                  className="w-full bg-[#12141c] border border-white/[0.08] focus:border-white/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Avatar Image URL (or upload above)
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://... or /logo.png"
                  className="w-full bg-[#12141c] border border-white/[0.08] focus:border-white/40 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none font-mono transition-colors"
                />
                {uploadError && <p className="text-[10px] text-red-400 mt-1">{uploadError}</p>}
              </div>
            </div>
          </div>

          {/* 2. Bio */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
              Curator Bio / Garage Philosophy
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Introduce your collection specialties, scale focus, and trading policies..."
              required
              className="w-full bg-[#12141c] border border-white/[0.08] focus:border-white/40 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed transition-colors"
            />
          </div>

          {/* 3. Contact & Location Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="6281234567890"
                required
                className="w-full bg-[#12141c] border border-white/[0.08] focus:border-white/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono transition-colors"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Format: 628xxx (no + sign)</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-white/70" />
                Base Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Indonesia (Worldwide)"
                required
                className="w-full bg-[#12141c] border border-white/[0.08] focus:border-white/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <InstagramIcon className="w-3 h-3 text-pink-400" />
                Instagram Handle
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@wortelemes"
                className="w-full bg-[#12141c] border border-white/[0.08] focus:border-white/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 4. Trust Pillars (3 Feature Cards) */}
          <div className="pt-2 border-t border-white/[0.06]">
            <h3 className="text-xs font-semibold uppercase text-white/80 tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Trust Pillars & Guarantees (3 Badges)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pillars.map((pillar, idx) => (
                <div
                  key={pillar.id || idx}
                  className="bg-[#12141c] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">Pillar #{idx + 1}</span>
                    <select
                      value={pillar.icon}
                      onChange={(e) =>
                        handlePillarChange(idx, 'icon', e.target.value as any)
                      }
                      className="bg-[#0b0c10] border border-white/[0.08] rounded-md px-1.5 py-0.5 text-[10px] text-gray-300 focus:outline-none"
                    >
                      <option value="award">Award</option>
                      <option value="package">Package</option>
                      <option value="truck">Truck</option>
                      <option value="shield">Shield</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                    placeholder="Pillar title"
                    className="w-full bg-[#0b0c10] border border-white/[0.08] rounded-lg px-2 py-1 text-xs font-semibold text-white focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                    placeholder="Brief guarantee explanation..."
                    className="w-full bg-[#0b0c10] border border-white/[0.08] rounded-lg p-2 text-[11px] text-gray-300 focus:outline-none leading-snug resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 5. FAQs Editor */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase text-white/80 tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-white/60" />
                Collector FAQ Management ({faqs.length})
              </h3>

              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-white/90 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-2.5 py-1 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => (
                <div
                  key={faq.id || idx}
                  className="bg-[#12141c] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-gray-400">Q{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(idx)}
                      className="p-1 rounded text-red-400/80 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                    placeholder="Question title..."
                    className="w-full bg-[#0b0c10] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                    placeholder="Answer explanation..."
                    className="w-full bg-[#0b0c10] border border-white/[0.08] rounded-lg p-2.5 text-xs text-gray-300 focus:outline-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form Bottom Submit */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save All Profile Changes</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Public Mirror / Preview: 5 cols on LG */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-white/60" />
              <h3 className="text-xs font-semibold uppercase text-white/80 tracking-wider">
                Live Public Preview Mirror
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          {/* Preview Card */}
          <div className="bg-[#12141c] border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col gap-5 relative overflow-hidden">
            {/* Profile Avatar & Header */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-16 rounded-2xl bg-[#161822] border border-white/10 overflow-hidden shadow-lg shrink-0 p-1">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40">
                  <Image
                    src={avatarUrl || '/logo.png'}
                    alt="Preview Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1">
                    {garageName || 'WORTELEMES GARAGE'}
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-medium uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-white/80 border border-white/10 mt-1">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  {collectorBadge || 'Verified Collector'}
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-3">
              {bio || 'Collector bio will appear here...'}
            </p>

            {/* Contact Details */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  WhatsApp
                </span>
                <span className="font-mono text-gray-200">{whatsappNumber || 'None'}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  Location
                </span>
                <span className="text-gray-200 line-clamp-1">{location || 'None'}</span>
              </div>

              {instagramHandle && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 flex items-center gap-1">
                    <InstagramIcon className="w-3 h-3 text-pink-400" />
                    Instagram
                  </span>
                  <span className="text-pink-300 font-mono">{instagramHandle}</span>
                </div>
              )}
            </div>

            {/* Trust Pillars Preview */}
            <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Active Trust Pillars
              </span>
              <div className="grid grid-cols-3 gap-2">
                {pillars.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="bg-[#181a24] border border-white/5 rounded-xl p-2 flex flex-col gap-1 text-center items-center"
                  >
                    {renderPillarIcon(p.icon)}
                    <span className="text-[10px] font-bold text-white line-clamp-1">
                      {p.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
