import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Globe,
  Wrench,
  Sparkles,
  MessageCircle,
  Instagram,
  ExternalLink
} from 'lucide-react';

export function AboutPage({
  onBackHome,
  whatsappHref,
  instagramUrl
}) {
  const pillars = [
    {
      label: 'Web experiences',
      icon: Globe
    },
    {
      label: 'Business tools',
      icon: Wrench
    },
    {
      label: 'Thoughtful design',
      icon: Sparkles
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12"
    >
      {/* Top Back to Home Button */}
      <div className="mb-5">
        <button
          type="button"
          onClick={onBackHome}
          className="px-4 py-2 rounded-full bg-white border border-slate-200/90 text-slate-800 hover:border-[#0D4A9E] hover:text-[#0D4A9E] text-xs font-display font-bold inline-flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Demos</span>
        </button>
      </div>

      {/* Main About Card matching the Reference Royal Blue & Clean Alabaster Aesthetic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left / Top Identity & Statement Card */}
        <section
          aria-label="About Kishore Dewangan"
          className="lg:col-span-7 rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-9 shadow-[0_18px_40px_-15px_rgba(13,74,158,0.1)] flex flex-col justify-between space-y-6"
        >
          <div className="space-y-5">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] text-[#0D4A9E] text-xs font-display font-bold tracking-wide">
              <span>A developer in your corner.</span>
            </div>

            {/* Profile Identity Block */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5B9BF3] p-0.5 shadow-md shrink-0 overflow-hidden border-2 border-white flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  role="img"
                  aria-label="Kishore Dewangan Avatar"
                >
                  <circle cx="50" cy="50" r="50" fill="#5B9BF3" />
                  <path d="M18 96 C20 74, 80 74, 82 96 Z" fill="#263445" />
                  <path d="M36 77 L50 92 L64 77" fill="#3B4D63" />
                  <rect x="43" y="64" width="14" height="14" rx="6" fill="#E0A37E" />
                  <rect x="31" y="28" width="38" height="42" rx="18" fill="#F1B894" />
                  <circle cx="30" cy="50" r="4.5" fill="#E0A37E" />
                  <circle cx="70" cy="50" r="4.5" fill="#E0A37E" />
                  <path
                    d="M29 44 C27 25, 42 18, 53 20 C66 21, 73 29, 71 44 C68 34, 60 30, 50 30 C39 30, 33 35, 29 44 Z"
                    fill="#22252A"
                  />
                  <path d="M38 43 Q42 41 46 43" stroke="#22252A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <path d="M54 43 Q58 41 62 43" stroke="#22252A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <circle cx="42" cy="48" r="2.3" fill="#1E293B" />
                  <circle cx="58" cy="48" r="2.3" fill="#1E293B" />
                  <path
                    d="M32 53 C32 66, 42 72, 50 72 C58 72, 68 66, 68 53 C65 58, 59 61, 50 61 C41 61, 35 58, 32 53 Z"
                    fill="#22252A"
                  />
                  <path d="M42 57 Q50 53 58 57" stroke="#22252A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  <path d="M45 59 Q50 63 55 59" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-display font-extrabold text-[20px] sm:text-[22px] text-black leading-tight">
                    Kishore Dewangan
                  </h1>
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
                <p className="text-[14px] font-semibold text-[#185ADB] mt-0.5">
                  Full-Stack Developer
                </p>
              </div>
            </div>

            {/* Bold Two-Line Statement */}
            <div className="pt-2">
              <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] leading-[1.12] tracking-tight text-black">
                Local roots.
                <br />
                <span className="text-[#0D4A9E]">Digital possibilities.</span>
              </h2>
            </div>

            {/* Main Bio Paragraph */}
            <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed font-normal">
              I build thoughtful websites and practical digital tools for local
              businesses. This is a space to explore what’s possible—from a
              better first impression to a smoother everyday workflow.
            </p>
          </div>
        </section>

        {/* Right / Bottom Royal Blue Capabilities & CTA Card */}
        <section
          aria-label="Capabilities and Contact"
          className="lg:col-span-5 rounded-[32px] bg-gradient-to-b from-[#0F52AD] to-[#0B418C] text-white p-6 sm:p-8 shadow-[0_22px_48px_-12px_rgba(11,65,140,0.55)] border border-white/15 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE2D0] text-[#5A4B3C] text-[12px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#7A654E]" />
              <span>What I Build</span>
            </span>

            {/* 3 Core Pillars */}
            <div className="space-y-3 pt-1">
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white/12 border border-white/15 px-4 py-3.5 flex items-center gap-3.5 backdrop-blur-xs"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-[#0D4A9E] flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-display font-bold text-[16px] text-white tracking-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Button: Let’s talk about your idea */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-5 rounded-full bg-white text-[#0D4A9E] hover:bg-blue-50 font-display font-bold text-[15px] inline-flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Let’s talk about your idea</span>
            </a>

            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-full bg-[#072B60]/90 hover:bg-[#05204A] text-[#EAE2D0] border border-[#C8B282]/65 font-display font-bold text-[13px] inline-flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Instagram className="w-4 h-4 shrink-0" />
                <span>Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default AboutPage;
