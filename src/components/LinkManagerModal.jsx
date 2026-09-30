import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Copy,
  Check,
  Upload,
  Palette,
  Image as ImageIcon,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import {
  CATEGORY_FALLBACK_IMAGES,
  CARD_COLOR_THEMES,
  SITE_CONFIG,
  resolveCardTheme
} from '../data/projects.js';

const ADMIN_PASSWORD_STORAGE_KEY = 'localweb_demo_hub_admin_pass_v1';

function compressImageToDataUrl(file, maxDim = 280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = ev.target?.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function LinkManagerModal({
  isOpen,
  onClose,
  projects,
  socialConfig,
  onUpdateSocialConfig,
  initialEditProject,
  onAddOrUpdateProject,
  onDeleteProject,
  onResetProjects,
  translateCategory,
  t
}) {
  // Admin Password & Lock State
  const [savedPassword, setSavedPassword] = useState(() => {
    try {
      const stored = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);
      if (stored) return stored;
    } catch {
      // ignore storage errors
    }
    return SITE_CONFIG.defaultAdminPassword || '1234';
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [authError, setAuthError] = useState('');

  // Change Password Section State
  const [showChangePassPanel, setShowChangePassPanel] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [passChangeError, setPassChangeError] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Restaurant & Cafe');
  const [cardColor, setCardColor] = useState('royal-blue');
  const [customAvatar, setCustomAvatar] = useState('');
  const [customAvatar2, setCustomAvatar2] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [adminUrl, setAdminUrl] = useState('');
  const [hindiIdea, setHindiIdea] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [highlightsInput, setHighlightsInput] = useState(
    'QR Menu, WhatsApp Order, Table Booking'
  );
  const [copiedCode, setCopiedCode] = useState(false);

  const avatar1InputRef = useRef(null);
  const avatar2InputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Social links state
  const [instagramUrl, setInstagramUrl] = useState(
    socialConfig?.instagramUrl || ''
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    socialConfig?.whatsappNumber || ''
  );

  // Re-lock and clear password fields whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false);
      setPasswordInput('');
      setAuthError('');
      setShowChangePassPanel(false);
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setPassChangeError('');
      setPassChangeSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setInstagramUrl(socialConfig?.instagramUrl || '');
    setWhatsappNumber(socialConfig?.whatsappNumber || '');
  }, [socialConfig, isOpen]);

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === savedPassword) {
      setIsUnlocked(true);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError(
        t.manager?.wrongPasswordMsg || 'Incorrect password. Please try again.'
      );
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess(false);

    if (currentPassInput !== savedPassword) {
      setPassChangeError(
        t.manager?.wrongPasswordMsg || 'Incorrect current password.'
      );
      return;
    }

    if (newPassInput.trim().length < 4) {
      setPassChangeError(
        t.manager?.passShortMsg || 'Password must be at least 4 characters.'
      );
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassChangeError(
        t.manager?.passMismatchMsg || 'New passwords do not match.'
      );
      return;
    }

    const updated = newPassInput.trim();
    setSavedPassword(updated);
    try {
      localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, updated);
    } catch {
      // ignore storage errors
    }

    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setPassChangeSuccess(true);
    setTimeout(() => {
      setPassChangeSuccess(false);
      setShowChangePassPanel(false);
    }, 1800);
  };

  const getNextDefaultColor = () => {
    const nextIdx = projects.length % CARD_COLOR_THEMES.length;
    return CARD_COLOR_THEMES[nextIdx].id;
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Restaurant & Cafe');
    setCardColor(getNextDefaultColor());
    setCustomAvatar('');
    setCustomAvatar2('');
    setLiveUrl('');
    setAdminUrl('');
    setHindiIdea('');
    setImageUrl('');
    setHighlightsInput('QR Menu, WhatsApp Order, Table Booking');
  };

  useEffect(() => {
    if (initialEditProject) {
      const idx = projects.findIndex((p) => p.id === initialEditProject.id);
      const resolved = resolveCardTheme(
        initialEditProject,
        idx >= 0 ? idx : 0
      );
      setEditingId(initialEditProject.id);
      setTitle(initialEditProject.title || '');
      setCategory(initialEditProject.category || 'Restaurant & Cafe');
      setCardColor(initialEditProject.cardColor || resolved.id);
      setCustomAvatar(initialEditProject.customAvatar || '');
      setCustomAvatar2(initialEditProject.customAvatar2 || '');
      setLiveUrl(initialEditProject.liveUrl || '');
      setAdminUrl(initialEditProject.adminUrl || '');
      setHindiIdea(initialEditProject.hindiIdea || '');
      setImageUrl(initialEditProject.image || '');
      setHighlightsInput(
        Array.isArray(initialEditProject.highlights)
          ? initialEditProject.highlights.join(', ')
          : 'QR Menu, WhatsApp Order'
      );
    } else {
      resetForm();
    }
  }, [initialEditProject, isOpen]);

  const handleStartEdit = (project, index = 0) => {
    const resolved = resolveCardTheme(project, index);
    setEditingId(project.id);
    setTitle(project.title || '');
    setCategory(project.category || 'Other');
    setCardColor(project.cardColor || resolved.id);
    setCustomAvatar(project.customAvatar || '');
    setCustomAvatar2(project.customAvatar2 || '');
    setLiveUrl(project.liveUrl || '');
    setAdminUrl(project.adminUrl || '');
    setHindiIdea(project.hindiIdea || '');
    setImageUrl(project.image || '');
    setHighlightsInput(
      Array.isArray(project.highlights)
        ? project.highlights.join(', ')
        : 'QR Menu, WhatsApp Order'
    );
  };

  const handleAvatarUpload = async (e, slot = 1) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file, 240, 0.84);
      if (slot === 1) {
        setCustomAvatar(dataUrl);
      } else {
        setCustomAvatar2(dataUrl);
      }
    } catch {
      // ignore invalid image
    }
    e.target.value = '';
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file, 480, 0.82);
      setImageUrl(dataUrl);
    } catch {
      // ignore
    }
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !liveUrl.trim()) return;

    const normalizedLive = /^https?:\/\//i.test(liveUrl.trim())
      ? liveUrl.trim()
      : `https://${liveUrl.trim()}`;

    const normalizedAdmin =
      adminUrl.trim() && !/^https?:\/\//i.test(adminUrl.trim())
        ? `https://${adminUrl.trim()}`
        : adminUrl.trim();

    const fallbackImg =
      CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES.Other;

    const entry = {
      id: editingId || `demo-${Date.now()}`,
      title: title.trim(),
      category: category.trim() || 'Other',
      cardColor: cardColor || 'royal-blue',
      customAvatar: customAvatar || '',
      customAvatar2: customAvatar2 || '',
      hindiIdea:
        hindiIdea.trim() ||
        `${category} के लिए आधुनिक मोबाइल-फ्रेंडली डेमो वेबसाइट`,
      liveUrl: normalizedLive,
      adminUrl: normalizedAdmin || '',
      deliveryDays: '5 Days',
      image: imageUrl.trim() || fallbackImg,
      isCustomEdited: true,
      highlights: highlightsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)
    };

    onAddOrUpdateProject(entry, Boolean(editingId));
    resetForm();
  };

  const handleSaveSocials = () => {
    if (!onUpdateSocialConfig) return;
    onUpdateSocialConfig({
      instagramUrl: instagramUrl.trim() || 'https://instagram.com/',
      whatsappNumber: whatsappNumber.replace(/\D/g, '') || '919876543210'
    });
  };

  const handleCopyCode = () => {
    const code = `export const INITIAL_PROJECTS = ${JSON.stringify(
      projects,
      null,
      2
    )};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const mgr = t.manager;
  const previewTheme = resolveCardTheme({ cardColor }, 0);
  const currentCoverPreview =
    imageUrl.trim() ||
    CATEGORY_FALLBACK_IMAGES[category] ||
    CATEGORY_FALLBACK_IMAGES.Other;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full ${
              isUnlocked ? 'max-w-2xl' : 'max-w-md'
            } max-h-[92vh] overflow-y-auto rounded-[32px] sky-white-card p-6 sm:p-7 space-y-5 shadow-2xl`}
          >
            {!isUnlocked ? (
              /* ============================================================
               * LOCKED VIEW: ADMIN PASSWORD GATE
               * ============================================================ */
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#0D4A9E] text-white flex items-center justify-center shadow-md shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-slate-900">
                        {mgr.lockTitle || 'Admin Access Required'}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {mgr.lockSubtitle ||
                          'Enter your admin password to manage demo links and social settings.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 rounded-full sky-stage flex items-center justify-center text-app-sub hover:text-app-main cursor-pointer shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleUnlockSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <input
                        type={showPasswordInput ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        autoFocus
                        required
                        placeholder={
                          mgr.passwordPlaceholder || 'Enter admin password'
                        }
                        className="w-full pl-4 pr-11 py-3 text-sm rounded-2xl sky-stage font-mono-tabular text-app-main focus:outline-none focus:border-[#0D4A9E]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordInput((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                        aria-label={
                          showPasswordInput ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPasswordInput ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {authError && (
                      <p className="mt-2 text-xs font-semibold text-rose-600">
                        {authError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-2xl sky-stage text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {mgr.cancelEditBtn || 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-2xl sky-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{mgr.unlockBtn || 'Unlock Manager'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ============================================================
               * UNLOCKED VIEW: FULL DEMO LINK & SOCIAL MANAGER + CHANGE PASSWORD
               * ============================================================ */
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between gap-3 border-b border-app-soft pb-4">
                  <div>
                    <h2 className="font-display font-bold text-lg text-sky-accent">
                      {editingId ? mgr.editTitle : mgr.addTitle}
                    </h2>
                    <p className="text-xs text-app-sub mt-0.5">{mgr.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Change Password Panel Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassPanel((prev) => !prev);
                        setPassChangeError('');
                        setPassChangeSuccess(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                        showChangePassPanel
                          ? 'bg-[#0D4A9E] text-white'
                          : 'sky-stage text-app-main hover:bg-slate-200/70'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{mgr.changePassBtn || 'Change Password'}</span>
                    </button>

                    {/* Lock Again Button */}
                    <button
                      type="button"
                      onClick={() => setIsUnlocked(false)}
                      title={mgr.lockBtn || 'Lock'}
                      className="px-2.5 py-1.5 rounded-full sky-stage text-[11px] font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      <span className="hidden sm:inline">
                        {mgr.lockBtn || 'Lock'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-9 h-9 rounded-full sky-stage flex items-center justify-center text-app-sub hover:text-app-main cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Change Password Panel */}
                {showChangePassPanel && (
                  <form
                    onSubmit={handleChangePasswordSubmit}
                    className="p-4 rounded-2xl bg-blue-50/70 border border-[#0D4A9E]/20 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D4A9E]">
                        <KeyRound className="w-4 h-4" />
                        <span>
                          {mgr.securityHeading || 'Admin Password Settings'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNewPass((prev) => !prev)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        {showNewPass ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder={
                          mgr.currentPassPlaceholder || 'Current password'
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono-tabular text-slate-900 focus:outline-none focus:border-[#0D4A9E]"
                      />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder={
                          mgr.newPassPlaceholder || 'New password (min 4 chars)'
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono-tabular text-slate-900 focus:outline-none focus:border-[#0D4A9E]"
                      />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        placeholder={
                          mgr.confirmPassPlaceholder || 'Confirm new password'
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono-tabular text-slate-900 focus:outline-none focus:border-[#0D4A9E]"
                      />
                    </div>

                    {passChangeError && (
                      <p className="text-xs font-semibold text-rose-600">
                        {passChangeError}
                      </p>
                    )}

                    {passChangeSuccess && (
                      <p className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {mgr.passSavedMsg || 'Password updated successfully!'}
                        </span>
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl sky-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{mgr.savePassBtn || 'Update Password'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Quick Socials Config (Instagram & WhatsApp) */}
                <div className="p-4 rounded-2xl sky-stage space-y-3">
                  <div className="text-xs font-bold text-sky-accent">
                    {mgr.socialsHeading}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-app-main mb-1">
                        {mgr.instaLabel}
                      </label>
                      <input
                        type="text"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        onBlur={handleSaveSocials}
                        placeholder="https://instagram.com/your_username"
                        className="w-full px-3 py-2 text-xs rounded-xl sky-white-card font-mono-tabular text-app-main focus:outline-none focus:border-[#259DFB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-app-main mb-1">
                        {mgr.whatsappLabel}
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        onBlur={handleSaveSocials}
                        placeholder="919876543210"
                        className="w-full px-3 py-2 text-xs rounded-xl sky-white-card font-mono-tabular text-app-main focus:outline-none focus:border-[#259DFB]"
                      />
                    </div>
                  </div>
                </div>

                {/* Add / Edit Demo Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-app-main mb-1">
                        {mgr.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={mgr.namePlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl sky-stage text-app-main focus:outline-none focus:border-[#259DFB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-app-main mb-1">
                        {mgr.categoryLabel}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl sky-stage text-app-main focus:outline-none focus:border-[#259DFB]"
                      >
                        <option value="Restaurant & Cafe">
                          {translateCategory('Restaurant & Cafe')}
                        </option>
                        <option value="Clinic & Medical">
                          {translateCategory('Clinic & Medical')}
                        </option>
                        <option value="Gym & Fitness">
                          {translateCategory('Gym & Fitness')}
                        </option>
                        <option value="Salon & Studio">
                          {translateCategory('Salon & Studio')}
                        </option>
                        <option value="Real Estate & Builders">
                          {translateCategory('Real Estate & Builders')}
                        </option>
                        <option value="Other">
                          {translateCategory('Other')}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Card Color Chooser (Preset Swatches + Custom Color Input + Live Preview) */}
                  <div className="p-4 rounded-2xl sky-stage space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-app-main">
                        <Palette className="w-4 h-4 text-sky-accent" />
                        <span>
                          {mgr.cardColorLabel ||
                            'Card Theme Color (Changes on Swipe)'}
                        </span>
                      </label>

                      <span
                        style={{
                          background: `linear-gradient(90deg, ${previewTheme.primary}, ${previewTheme.secondary})`
                        }}
                        className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-xs"
                      >
                        {previewTheme.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {CARD_COLOR_THEMES.map((theme) => {
                        const isSelected =
                          cardColor === theme.id ||
                          String(cardColor).toLowerCase() ===
                            theme.primary.toLowerCase();
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setCardColor(theme.id)}
                            style={{
                              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                            }}
                            className={`h-9 px-3 rounded-full text-white text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-transform ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-slate-900 scale-105 shadow-md'
                                : 'opacity-85 hover:opacity-100'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{theme.name}</span>
                          </button>
                        );
                      })}

                      {/* Custom Hex Color Picker */}
                      <label className="h-9 px-3 rounded-full bg-white border border-slate-300 text-slate-800 text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs hover:border-slate-400">
                        <input
                          type="color"
                          value={
                            cardColor.startsWith('#')
                              ? cardColor
                              : previewTheme.primary
                          }
                          onChange={(e) => setCardColor(e.target.value)}
                          className="w-5 h-5 rounded-full border-0 cursor-pointer bg-transparent"
                        />
                        <span>{mgr.customColorLabel || 'Custom Color'}</span>
                      </label>
                    </div>
                  </div>

                  {/* Cartoon Avatar & Image Upload Section (Top-Left Circles Preview + Upload) */}
                  <div className="p-4 rounded-2xl sky-stage space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-app-main">
                        <ImageIcon className="w-4 h-4 text-sky-accent" />
                        <span>
                          {mgr.avatarUploadLabel ||
                            'Cartoon Avatar / Image Upload (Card Top-Left Circles)'}
                        </span>
                      </label>
                      {(customAvatar || customAvatar2) && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomAvatar('');
                            setCustomAvatar2('');
                          }}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          {mgr.clearAvatarBtn || 'Use Default Cartoon'}
                        </button>
                      )}
                    </div>

                    {/* Live Mini Preview of the 3 Top-Left Card Circles + Upload Triggers */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80">
                      {/* Live 3-Circle Preview */}
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${previewTheme.primary}, ${previewTheme.secondary})`
                          }}
                          className="p-2.5 rounded-2xl flex items-center -space-x-2.5 shadow-sm"
                        >
                          {/* Circle 1 Preview */}
                          <div className="w-10 h-10 rounded-full bg-[#F49AC2] border-2 border-white overflow-hidden flex items-center justify-center shrink-0">
                            {customAvatar ? (
                              <img
                                src={customAvatar}
                                alt="Avatar 1"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg viewBox="0 0 64 64" className="w-full h-full">
                                <rect width="64" height="64" fill="#F49AC2" />
                                <circle cx="32" cy="26" r="12" fill="#FCE4EC" />
                                <path
                                  d="M16 60 C18 44, 46 44, 48 60 Z"
                                  fill="#CE93D8"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Circle 2 Preview */}
                          <div className="w-10 h-10 rounded-full bg-[#F7A9A8] border-2 border-white overflow-hidden flex items-center justify-center shrink-0">
                            {customAvatar2 ? (
                              <img
                                src={customAvatar2}
                                alt="Avatar 2"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg viewBox="0 0 64 64" className="w-full h-full">
                                <rect width="64" height="64" fill="#F7A9A8" />
                                <circle cx="32" cy="29" r="10" fill="#FAD7A0" />
                                <path
                                  d="M16 60 C19 45, 45 45, 48 60 Z"
                                  fill="#A9DFBF"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Circle 3 Preview (Cover / Thumbnail) */}
                          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={currentCoverPreview}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 leading-tight">
                          <div className="font-bold text-slate-900">
                            Card Top-Left Preview
                          </div>
                          <div>
                            Upload your own avatar, logo, or shop photo
                          </div>
                        </div>
                      </div>

                      {/* Hidden File Inputs & Upload Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={avatar1InputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAvatarUpload(e, 1)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => avatar1InputRef.current?.click()}
                          className="px-3 py-2 rounded-xl sky-btn-soft text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{mgr.avatarUploadBtn || 'Upload Avatar 1'}</span>
                        </button>

                        <input
                          ref={avatar2InputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAvatarUpload(e, 2)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => avatar2InputRef.current?.click()}
                          className="px-3 py-2 rounded-xl sky-stage text-[11px] font-bold text-app-main inline-flex items-center gap-1.5 cursor-pointer hover:bg-slate-200/70"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Avatar 2</span>
                        </button>

                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="px-3 py-2 rounded-xl sky-stage text-[11px] font-bold text-app-main inline-flex items-center gap-1.5 cursor-pointer hover:bg-slate-200/70"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {mgr.coverUploadBtn || 'Upload Cover Photo'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-app-main mb-1">
                        {mgr.liveUrlLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder={mgr.liveUrlPlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl sky-stage font-mono-tabular text-app-main focus:outline-none focus:border-[#259DFB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-app-main mb-1">
                        {mgr.adminUrlLabel}
                      </label>
                      <input
                        type="text"
                        value={adminUrl}
                        onChange={(e) => setAdminUrl(e.target.value)}
                        placeholder={mgr.adminUrlPlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl sky-stage font-mono-tabular text-app-main focus:outline-none focus:border-[#259DFB]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-app-main mb-1">
                        {mgr.ideaLabel}
                      </label>
                      <input
                        type="text"
                        value={hindiIdea}
                        onChange={(e) => setHindiIdea(e.target.value)}
                        placeholder={mgr.ideaPlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl sky-stage text-app-main focus:outline-none focus:border-[#259DFB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-app-main mb-1">
                        {mgr.featuresLabel}
                      </label>
                      <input
                        type="text"
                        value={highlightsInput}
                        onChange={(e) => setHighlightsInput(e.target.value)}
                        placeholder={mgr.featuresPlaceholder}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl sky-stage text-app-main focus:outline-none focus:border-[#259DFB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-app-main mb-1">
                      {mgr.coverUrlLabel}
                    </label>
                    <input
                      type="text"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder={
                        imageUrl.startsWith('data:')
                          ? 'Uploaded custom photo active (paste URL to replace)'
                          : 'https://example.com/cover.jpg'
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-2xl sky-stage font-mono-tabular text-app-main focus:outline-none focus:border-[#259DFB]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onResetProjects}
                        className="px-3.5 py-2 rounded-2xl sky-stage text-xs font-bold text-app-sub hover:text-app-main inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{mgr.resetBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-3.5 py-2 rounded-2xl sky-stage text-xs font-bold text-app-sub hover:text-app-main inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{mgr.copiedCodeBtn}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{mgr.copyCodeBtn}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2 rounded-2xl sky-btn-soft text-xs font-bold cursor-pointer"
                        >
                          {mgr.cancelEditBtn}
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-2xl sky-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {editingId ? mgr.saveChangesBtn : mgr.submitNewBtn}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Saved Links List */}
                <div className="pt-4 border-t border-app-soft space-y-2.5">
                  <div className="text-xs font-bold text-sky-accent font-mono-tabular">
                    {mgr.currentLinksHeading} ({projects.length})
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {projects.map((item, idx) => {
                      const itemTheme = resolveCardTheme(item, idx);
                      return (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-2xl sky-stage flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              style={{
                                background: `linear-gradient(135deg, ${itemTheme.primary}, ${itemTheme.secondary})`
                              }}
                              className="w-6 h-6 rounded-full shrink-0 border border-white shadow-xs flex items-center justify-center text-[10px] font-bold text-white font-mono-tabular"
                              title={itemTheme.name}
                            >
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="font-bold text-app-main truncate font-mono-tabular">
                                {item.title}{' '}
                                <span className="font-normal text-app-muted">
                                  · {translateCategory(item.category)}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono-tabular text-sky-accent truncate">
                                {item.liveUrl}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item, idx)}
                              className="px-2.5 py-1.5 rounded-xl sky-white-card font-bold text-app-main inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3 text-[#259DFB]" />
                              <span>{mgr.editItemBtn}</span>
                            </button>
                            <button
                              type="button"
                              disabled={projects.length <= 1}
                              onClick={() => onDeleteProject(item.id)}
                              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 disabled:opacity-30 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LinkManagerModal;
