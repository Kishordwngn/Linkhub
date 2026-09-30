import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Eye,
  Copy,
  Check,
  Edit3,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Store,
  Utensils,
  Stethoscope,
  Dumbbell,
  Building2
} from 'lucide-react';
import { resolveCardTheme } from '../data/projects.js';

function getCategoryIcon(category, className = 'w-3.5 h-3.5') {
  switch (category) {
    case 'Restaurant & Cafe':
      return <Utensils className={className} />;
    case 'Clinic & Medical':
      return <Stethoscope className={className} />;
    case 'Gym & Fitness':
      return <Dumbbell className={className} />;
    case 'Salon & Studio':
      return <Sparkles className={className} />;
    case 'Real Estate & Builders':
      return <Building2 className={className} />;
    default:
      return <Store className={className} />;
  }
}

const CARTOON_AVATAR_PALETTES = [
  {
    bg1: '#F49AC2',
    skin1: '#FCE4EC',
    hair1: '#F8BBD0',
    shirt1: '#CE93D8',
    bg2: '#F7A9A8',
    hair2: '#E59866',
    skin2: '#FAD7A0',
    shirt2: '#A9DFBF'
  },
  {
    bg1: '#93C5FD',
    skin1: '#FEF3C7',
    hair1: '#1E3A8A',
    shirt1: '#3B82F6',
    bg2: '#FDE68A',
    hair2: '#92400E',
    skin2: '#FDE047',
    shirt2: '#10B981'
  },
  {
    bg1: '#C4B5FD',
    skin1: '#FFEDD5',
    hair1: '#4C1D95',
    shirt1: '#8B5CF6',
    bg2: '#FDBA74',
    hair2: '#7C2D12',
    skin2: '#FED7AA',
    shirt2: '#F43F5E'
  },
  {
    bg1: '#F9A8D4',
    skin1: '#FDF2F8',
    hair1: '#831843',
    shirt1: '#EC4899',
    bg2: '#6EE7B7',
    hair2: '#064E3B',
    skin2: '#FEF3C7',
    shirt2: '#059669'
  },
  {
    bg1: '#67E8F9',
    skin1: '#FFFBEB',
    hair1: '#164E63',
    shirt1: '#0891B2',
    bg2: '#FCA5A5',
    hair2: '#7F1D1D',
    skin2: '#FEE2E2',
    shirt2: '#DC2626'
  }
];

export function DemoCardsRow({
  projects,
  filteredProjects,
  categories,
  selectedCategory,
  onSelectCategory,
  copiedId,
  onCopyUrl,
  onOpenEditModal,
  onOpenAddModal,
  translateCategory,
  getProjectTitle,
  getProjectIdea,
  getProjectHighlights,
  t
}) {
  const c = t.cardsRow || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Reset active card index when category filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory, filteredProjects.length]);

  const total = filteredProjects.length;
  const safeIndex = total > 0 ? activeIndex % total : 0;
  const nextIndex = total > 1 ? (safeIndex + 1) % total : safeIndex;
  const thirdIndex = total > 2 ? (safeIndex + 2) % total : nextIndex;

  const activeProject = total > 0 ? filteredProjects[safeIndex] : null;
  const nextProject = total > 1 ? filteredProjects[nextIndex] : null;
  const thirdProject = total > 2 ? filteredProjects[thirdIndex] : null;

  // Idea 1 & 2: Resolve each card's own signature color so bottom cards move up with their true color
  const activeTheme = activeProject
    ? resolveCardTheme(activeProject, safeIndex)
    : resolveCardTheme(null, 0);
  const nextTheme = nextProject
    ? resolveCardTheme(nextProject, nextIndex)
    : activeTheme;
  const thirdTheme = thirdProject
    ? resolveCardTheme(thirdProject, thirdIndex)
    : nextTheme;

  const avatarPalette =
    CARTOON_AVATAR_PALETTES[safeIndex % CARTOON_AVATAR_PALETTES.length];

  const paginate = (newDirection) => {
    if (total <= 1) return;
    setDirection(newDirection);
    setActiveIndex((prev) => (prev + newDirection + total) % total);
  };

  const selectSpecificCard = (targetIndex) => {
    if (targetIndex === safeIndex || total <= 1) return;
    setDirection(targetIndex > safeIndex ? 1 : -1);
    setActiveIndex(targetIndex);
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 45;
    const velocityThreshold = 300;

    if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      paginate(1);
    } else if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > velocityThreshold
    ) {
      paginate(-1);
    }
  };

  const cardVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 260 : -260,
      opacity: 0,
      scale: 0.92,
      rotate: dir > 0 ? 6 : -6
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 320,
        damping: 28
      }
    },
    exit: (dir) => ({
      x: dir > 0 ? -260 : 260,
      opacity: 0,
      scale: 0.92,
      rotate: dir > 0 ? -6 : 6,
      transition: {
        duration: 0.22,
        ease: 'easeInOut'
      }
    })
  };

  const displayTitle = (proj) =>
    getProjectTitle ? getProjectTitle(proj) : proj.title;

  return (
    <section
      id="demos"
      aria-label="Interactive Project Demo Deck"
      className="w-full space-y-5"
    >
      {/* Category Filter Pills (Scrollable on Mobile, Wrap-friendly on Tablet/Desktop) */}
      <div
        className="flex items-center md:flex-wrap gap-2.5 overflow-x-auto md:overflow-visible no-scrollbar pb-1 pt-1"
        role="tablist"
        aria-label="Filter Demos by Business Category"
      >
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          const label =
            cat === 'All' ? 'ALL DEMOS' : translateCategory(cat).toUpperCase();
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectCategory(cat)}
              style={
                active
                  ? {
                      backgroundColor: activeTheme.primary,
                      boxShadow: `0 8px 20px -6px ${activeTheme.shadow}`
                    }
                  : undefined
              }
              className={`px-5 py-2.5 rounded-full text-[13px] font-display font-bold tracking-wide transition-all shrink-0 cursor-pointer uppercase ${
                active
                  ? 'text-white'
                  : 'bg-white text-slate-800 border border-slate-200/90 hover:border-slate-400 shadow-2xs'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Stacked Swipeable Card Deck */}
      {activeProject && (
        <div className="relative pt-8 pb-2 select-none max-w-[540px] mx-auto lg:mx-0 lg:max-w-none">
          {/* Top Blurred Back Stack Layers (Synced with Active & Next Card Theme Colors) */}
          <div
            aria-hidden="true"
            onClick={() => paginate(1)}
            style={{ backgroundColor: thirdTheme.glowTop }}
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[76%] h-14 rounded-t-[28px] opacity-60 blur-[3px] -rotate-2 transform transition-colors duration-300"
          />
          <div
            aria-hidden="true"
            onClick={() => paginate(1)}
            style={{ backgroundColor: activeTheme.glowMid }}
            className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 w-[87%] h-14 rounded-t-[30px] opacity-85 blur-[1.5px] -rotate-1 transform flex items-center justify-between px-5 pt-2 transition-colors duration-300"
          >
            <div className="flex -space-x-2 opacity-60">
              <div className="w-6 h-6 rounded-full bg-pink-300" />
              <div className="w-6 h-6 rounded-full bg-amber-200" />
              <div className="w-6 h-6 rounded-full bg-purple-300" />
            </div>
            <div className="w-16 h-4 rounded-full bg-white/25" />
          </div>

          {/* Active Front Card (Dynamic Color Synced with Queue + Thumb-Swipeable) */}
          <div className="relative z-20 overflow-visible">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.article
                key={activeProject.id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.85}
                whileTap={{ cursor: 'grabbing', scale: 0.99 }}
                onDragEnd={handleDragEnd}
                style={{
                  background: `linear-gradient(180deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
                  boxShadow: `0 22px 48px -12px ${activeTheme.shadow}`
                }}
                className="relative z-20 rounded-[32px] text-white p-6 sm:p-8 border border-white/15 cursor-grab touch-pan-y transition-colors duration-300"
              >
                {/* Top Row: Overlapping Cartoon/Custom Avatars + Live Demo Status Pill */}
                <div className="flex items-center justify-between gap-2">
                  {/* Left: 3 Overlapping Avatar Circles (Supports Custom Uploaded Avatar or Dynamic Cartoon) */}
                  <div className="flex items-center -space-x-3">
                    {/* Avatar 1: Custom Uploaded Avatar OR Dynamic Cartoon Participant 1 */}
                    <div
                      style={{
                        borderColor: activeTheme.primary,
                        backgroundColor: avatarPalette.bg1
                      }}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-sm shrink-0 relative"
                    >
                      {activeProject.customAvatar ? (
                        <img
                          src={activeProject.customAvatar}
                          alt={`${displayTitle(activeProject)} avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg viewBox="0 0 64 64" className="w-full h-full">
                          <rect width="64" height="64" fill={avatarPalette.bg1} />
                          <circle cx="32" cy="26" r="12" fill={avatarPalette.skin1} />
                          <path
                            d="M22 25 C22 16, 42 16, 42 25"
                            fill={avatarPalette.hair1}
                          />
                          <circle
                            cx="28"
                            cy="26"
                            r="3.5"
                            stroke="#4A3540"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <circle
                            cx="36"
                            cy="26"
                            r="3.5"
                            stroke="#4A3540"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path
                            d="M16 60 C18 44, 46 44, 48 60 Z"
                            fill={avatarPalette.shirt1}
                          />
                        </svg>
                      )}
                    </div>

                    {/* Avatar 2: Custom Uploaded Avatar 2 OR Dynamic Cartoon Participant 2 */}
                    <div
                      style={{
                        borderColor: activeTheme.primary,
                        backgroundColor: avatarPalette.bg2
                      }}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-sm shrink-0 relative"
                    >
                      {activeProject.customAvatar2 ? (
                        <img
                          src={activeProject.customAvatar2}
                          alt={`${displayTitle(activeProject)} second avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg viewBox="0 0 64 64" className="w-full h-full">
                          <rect width="64" height="64" fill={avatarPalette.bg2} />
                          <path
                            d="M18 28 C18 14, 46 14, 46 28 L44 38 L20 38 Z"
                            fill={avatarPalette.hair2}
                          />
                          <circle cx="32" cy="29" r="10" fill={avatarPalette.skin2} />
                          <circle cx="28.5" cy="28.5" r="1.5" fill="#3E2723" />
                          <circle cx="35.5" cy="28.5" r="1.5" fill="#3E2723" />
                          <path
                            d="M16 60 C19 45, 45 45, 48 60 Z"
                            fill={avatarPalette.shirt2}
                          />
                        </svg>
                      )}
                    </div>

                    {/* Avatar 3: Project Live Thumbnail / Uploaded Cover Image */}
                    <div
                      style={{ borderColor: activeTheme.primary }}
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white/20 border-2 overflow-hidden flex items-center justify-center shadow-sm shrink-0 relative"
                    >
                      <img
                        src={activeProject.image}
                        alt={displayTitle(activeProject)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Right: Live Demo Status Badge + Quick Copy/Edit Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyUrl(activeProject.id, activeProject.liveUrl);
                      }}
                      title={c.copyTooltip || 'Copy Link'}
                      className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      {copiedId === activeProject.id ? (
                        <Check className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(activeProject);
                      }}
                      title={c.editTooltip || 'Edit Demo'}
                      className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-white/90" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>

                {/* Idea 3: Prominent DEMO #01 / #02 Number Indicator + Category Icon Badge */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-900 text-[11px] font-display font-extrabold tracking-wider uppercase shadow-xs">
                    <span>
                      DEMO #{String(safeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500 font-mono-tabular">
                      {String(total).padStart(2, '0')}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE2D0] text-[#4A3B2C] text-[12px] font-bold shadow-2xs">
                    {getCategoryIcon(
                      activeProject.category,
                      'w-3.5 h-3.5 text-[#6E563F]'
                    )}
                    <span>{translateCategory(activeProject.category)}</span>
                  </span>
                </div>

                {/* Project Title (Bold Uppercase Matching Reference Image) */}
                <h3 className="mt-3.5 font-display font-extrabold text-[22px] sm:text-[26px] tracking-tight text-white uppercase leading-[1.18]">
                  {displayTitle(activeProject)}
                </h3>

                {/* Project Description / Idea */}
                <p className="mt-2 text-[14px] sm:text-[15px] text-white/90 leading-relaxed font-normal">
                  {getProjectIdea(activeProject)}
                </p>

                {/* Feature Highlights Pills */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {getProjectHighlights(activeProject).map((feat) => (
                    <span
                      key={feat}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/14 text-white/95 border border-white/12"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Primary & Secondary Action Pill Buttons (Synced with Active Card Color) */}
                <div className="mt-6 grid grid-cols-2 gap-3.5">
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{ color: activeTheme.primary }}
                    className="py-3.5 px-4 rounded-full bg-white hover:bg-slate-50 font-display font-bold text-[14px] sm:text-[15px] inline-flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <span role="img" aria-label="rocket">
                      🚀
                    </span>
                    <span className="truncate">Live Demo</span>
                  </a>

                  <a
                    href={activeProject.adminUrl || activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{ backgroundColor: activeTheme.accentDark }}
                    className="py-3.5 px-4 rounded-full text-[#EAE2D0] border border-[#C8B282]/70 hover:brightness-110 font-display font-bold text-[14px] sm:text-[15px] inline-flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Eye className="w-4 h-4 text-[#EAE2D0] shrink-0" />
                    <span className="truncate">Admin View</span>
                  </a>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* 2nd Stacked Card Peeking Below (Shows Next Project's ACTUAL Theme Color so it matches when swiped up!) */}
          {nextProject && (
            <motion.div
              layout
              onClick={() => paginate(1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') paginate(1);
              }}
              aria-label={`Next demo: ${displayTitle(nextProject)}`}
              style={{
                background: `linear-gradient(90deg, ${nextTheme.primary} 0%, ${nextTheme.secondary} 100%)`,
                boxShadow: `0 14px 30px -10px ${nextTheme.shadow}`
              }}
              className="relative z-10 -mt-6 pt-9 pb-5 px-6 sm:px-8 rounded-b-[32px] text-white cursor-pointer transition-all duration-300 hover:translate-y-0.5 flex items-center justify-between gap-3 border-t border-white/10"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-mono-tabular font-bold uppercase tracking-wider">
                    #{String(nextIndex + 1).padStart(2, '0')}
                  </span>
                  <div className="font-display font-extrabold text-[17px] sm:text-[19px] tracking-wide uppercase truncate text-white drop-shadow-2xs">
                    {displayTitle(nextProject)}
                  </div>
                </div>
                <div className="text-[11px] font-medium text-white/85 truncate mt-0.5">
                  {translateCategory(nextProject.category)} · Swipe or tap to bring front
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-black/20 text-[11px] font-bold uppercase tracking-wider shrink-0">
                Next →
              </span>
            </motion.div>
          )}

          {/* 3rd Stacked Card Peeking Below (Shows 3rd Project's ACTUAL Theme Color!) */}
          {thirdProject && (
            <motion.div
              layout
              onClick={() => selectSpecificCard(thirdIndex)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectSpecificCard(thirdIndex);
                }
              }}
              aria-label={`Upcoming demo: ${displayTitle(thirdProject)}`}
              style={{
                background: `linear-gradient(90deg, ${thirdTheme.primary} 0%, ${thirdTheme.secondary} 100%)`
              }}
              className="relative z-0 -mt-6 pt-9 pb-5 px-6 sm:px-8 rounded-b-[32px] text-white shadow-md cursor-pointer transition-all duration-300 hover:translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center gap-1.5 px-2.5 h-6 rounded-full bg-white/20 mb-1.5 text-[10px] font-bold">
                {getCategoryIcon(thirdProject.category, 'w-3.5 h-3.5 text-white')}
                <span className="font-mono-tabular">
                  #{String(thirdIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-display font-extrabold text-[16px] sm:text-[18px] tracking-wide uppercase truncate text-white/95">
                  {displayTitle(thirdProject)}
                </div>
                <span className="text-[11px] text-white/75 font-mono-tabular shrink-0">
                  Queue #{thirdIndex + 1}
                </span>
              </div>
            </motion.div>
          )}

          {/* Deck Navigation Controls & Add New Demo Trigger */}
          <div className="mt-4 flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => paginate(-1)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-950 shadow-2xs cursor-pointer"
                aria-label="Previous Demo Card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-950 shadow-2xs cursor-pointer"
                aria-label="Next Demo Card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Dots (Colored by Each Card's Theme!) */}
            <div className="flex items-center gap-1.5">
              {filteredProjects.map((proj, idx) => {
                const isCurrent = idx === safeIndex;
                const dotTheme = resolveCardTheme(proj, idx);
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => selectSpecificCard(idx)}
                    aria-label={`Go to ${displayTitle(proj)}`}
                    style={{
                      backgroundColor: isCurrent ? dotTheme.primary : undefined
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      isCurrent
                        ? 'w-7 shadow-xs'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                );
              })}
            </div>

            {/* Quick Add Demo Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              style={{ color: activeTheme.primary }}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs hover:border-slate-400 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addLinkBtn || '+ Add Link'}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DemoCardsRow;
