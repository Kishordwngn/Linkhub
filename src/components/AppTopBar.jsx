import React from 'react';
import { Plus, User } from 'lucide-react';
import { LANGUAGES } from '../data/translations.js';
import { SITE_CONFIG } from '../data/projects.js';

export function AppTopBar({
  language,
  onSelectLanguage,
  onOpenManager,
  activePage,
  onToggleAboutPage,
  t
}) {
  const isAbout = activePage === 'about';

  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Developer Profile Avatar + Full Name in Black + Verified Badge */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#5B9BF3] p-0.5 shadow-md shrink-0 overflow-hidden border-2 border-white flex items-center justify-center">
            {/* Illustrated Developer Avatar SVG matching the reference style */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              role="img"
              aria-label={`${SITE_CONFIG.developerName} Avatar`}
            >
              <circle cx="50" cy="50" r="50" fill="#5B9BF3" />
              {/* Shoulders / Hoodie */}
              <path
                d="M18 96 C20 74, 80 74, 82 96 Z"
                fill="#263445"
              />
              <path
                d="M36 77 L50 92 L64 77"
                fill="#3B4D63"
              />
              {/* Neck */}
              <rect x="43" y="64" width="14" height="14" rx="6" fill="#E0A37E" />
              {/* Face */}
              <rect x="31" y="28" width="38" height="42" rx="18" fill="#F1B894" />
              {/* Ears */}
              <circle cx="30" cy="50" r="4.5" fill="#E0A37E" />
              <circle cx="70" cy="50" r="4.5" fill="#E0A37E" />
              {/* Hair */}
              <path
                d="M29 44 C27 25, 42 18, 53 20 C66 21, 73 29, 71 44 C68 34, 60 30, 50 30 C39 30, 33 35, 29 44 Z"
                fill="#22252A"
              />
              {/* Eyebrows */}
              <path d="M38 43 Q42 41 46 43" stroke="#22252A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M54 43 Q58 41 62 43" stroke="#22252A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              {/* Eyes */}
              <circle cx="42" cy="48" r="2.3" fill="#1E293B" />
              <circle cx="58" cy="48" r="2.3" fill="#1E293B" />
              {/* Beard & Mustache */}
              <path
                d="M32 53 C32 66, 42 72, 50 72 C58 72, 68 66, 68 53 C65 58, 59 61, 50 61 C41 61, 35 58, 32 53 Z"
                fill="#22252A"
              />
              <path
                d="M42 57 Q50 53 58 57"
                stroke="#22252A"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Smile */}
              <path
                d="M45 59 Q50 63 55 59"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-[17px] sm:text-[20px] text-black whitespace-nowrap leading-tight">
                {SITE_CONFIG.developerName}
              </span>
              {/* Scalloped Blue Verified Checkmark Badge */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#1D74F2] shrink-0 fill-current"
                aria-label="Verified Developer"
              >
                <path d="M12 2l2.4 1.8 3-.3 1.2 2.8 2.8 1.2-.3 3L22.9 12l-1.8 2.4.3 3-2.8 1.2-1.2 2.8-3-.3L12 22.9l-2.4-1.8-3 .3-1.2-2.8-2.8-1.2.3-3L1.1 12l1.8-2.4-.3-3 2.8-1.2 1.2-2.8 3 .3L12 2z" />
                <path
                  d="M8.5 12.5l2.2 2.2 4.8-4.8"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <p className="text-[13px] sm:text-[14px] font-semibold text-[#185ADB] whitespace-nowrap mt-0.5">
              Full-Stack Developer
            </p>
          </div>
        </div>

        {/* Right: About Page Button, Language Switcher & Add Link Button */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={onToggleAboutPage}
            className={`px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-display font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs border ${
              isAbout
                ? 'bg-[#0D4A9E] text-white border-[#0D4A9E]'
                : 'bg-white text-black border-slate-200/90 hover:border-[#0D4A9E] hover:text-[#0D4A9E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isAbout ? 'Home' : 'About'}</span>
          </button>

          <div
            className="flex items-center bg-white p-0.5 rounded-full border border-slate-200/90 shadow-2xs"
            role="group"
            aria-label="Language Switcher"
          >
            {LANGUAGES.map((opt) => {
              const active = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => onSelectLanguage(opt.code)}
                  title={opt.name}
                  className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0D4A9E] text-white shadow-2xs'
                      : 'text-slate-700 hover:text-black'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenManager}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D4A9E] text-white flex items-center justify-center shadow-sm hover:bg-[#093B82] transition-colors cursor-pointer shrink-0"
            title={t.addLinkBtn || '+ Add Link'}
            aria-label="Manage Demos"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppTopBar;
