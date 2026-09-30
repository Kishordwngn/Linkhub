import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageCircle,
  Check,
  Sparkles,
  ExternalLink,
  Home,
  Calendar,
  User,
  Settings,
  Instagram,
  Copy
} from 'lucide-react';
import { INITIAL_PROJECTS, SITE_CONFIG } from './data/projects.js';
import {
  UI_TEXT,
  CATEGORY_TRANSLATIONS,
  PROJECT_LOCALIZED_CONTENT
} from './data/translations.js';
import { AppTopBar } from './components/AppTopBar.jsx';
import { DemoCardsRow } from './components/DemoCardsRow.jsx';
import { LinkManagerModal } from './components/LinkManagerModal.jsx';
import { AboutPage } from './components/AboutPage.jsx';

const STORAGE_KEY = 'localweb_demo_hub_projects_v1';
const SOCIAL_STORAGE_KEY = 'localweb_demo_hub_social_v1';
const LANGUAGE_STORAGE_KEY = 'localweb_demo_hub_lang_en_default_v2';

export function App() {
  // Language state ('en' default | 'hi' | 'hinglish')
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && UI_TEXT[saved]) return saved;
    } catch {
      // ignore storage errors
    }
    return 'en';
  });

  // Page state ('home' | 'about')
  const [activePage, setActivePage] = useState('home');

  // Ensure light mode is always active (no dark mode)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const handleSelectLanguage = (langId) => {
    setLanguage(langId);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langId);
    } catch {
      // ignore
    }
  };

  const t = UI_TEXT[language] || UI_TEXT.en;

  // Load projects from localStorage or fall back to INITIAL_PROJECTS
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore localStorage errors
    }
    return INITIAL_PROJECTS;
  });

  // Load Social Config (Instagram & WhatsApp)
  const [socialConfig, setSocialConfig] = useState(() => {
    const defaultSocial = {
      instagramUrl: SITE_CONFIG.instagramUrl,
      whatsappNumber: SITE_CONFIG.whatsappNumber
    };
    try {
      const saved = localStorage.getItem(SOCIAL_STORAGE_KEY);
      if (saved) {
        return { ...defaultSocial, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return defaultSocial;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedBio, setCopiedBio] = useState(false);
  const [activeDock, setActiveDock] = useState('demos');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore storage quota errors
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(socialConfig));
    } catch {
      // ignore
    }
  }, [socialConfig]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const translateCategory = (cat) => {
    return CATEGORY_TRANSLATIONS[cat]?.[language] || cat;
  };

  const getProjectTitle = (project) => {
    if (project.isCustomEdited && project.title) {
      return project.title;
    }
    return (
      PROJECT_LOCALIZED_CONTENT[project.id]?.title?.[language] || project.title
    );
  };

  const getProjectIdea = (project) => {
    if (project.isCustomEdited && project.hindiIdea) {
      return project.hindiIdea;
    }
    return (
      PROJECT_LOCALIZED_CONTENT[project.id]?.idea?.[language] ||
      project.hindiIdea
    );
  };

  const getProjectHighlights = (project) => {
    if (project.isCustomEdited && Array.isArray(project.highlights)) {
      return project.highlights;
    }
    return (
      PROJECT_LOCALIZED_CONTENT[project.id]?.highlights?.[language] ||
      project.highlights ||
      []
    );
  };

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyBioLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 1800);
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleAddOrUpdateProject = (projectData, isEditing) => {
    if (isEditing) {
      setProjects((prev) =>
        prev.map((item) => (item.id === projectData.id ? projectData : item))
      );
    } else {
      setProjects((prev) => [projectData, ...prev]);
    }
    setSelectedCategory('All');
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const handleDeleteProject = (id) => {
    if (projects.length <= 1) return;
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetProjects = () => {
    setProjects(INITIAL_PROJECTS);
    setSelectedCategory('All');
    localStorage.removeItem(STORAGE_KEY);
  };

  const whatsappMessage = t.whatsappPretext
    ? t.whatsappPretext(SITE_CONFIG.developerName)
    : `Hi ${SITE_CONFIG.developerName}, I visited your Demo Hub.`;

  const whatsappHref = `https://wa.me/${socialConfig.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const scrollToSection = (id) => {
    if (activePage !== 'home') {
      setActivePage('home');
      setActiveDock(id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    setActiveDock(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openAboutPage = () => {
    setActivePage('about');
    setActiveDock('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHomePage = () => {
    setActivePage('home');
    setActiveDock('demos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col app-canvas selection:bg-[#0D4A9E] selection:text-white pb-40">
      {/* 1. Reference Style Profile Top Bar */}
      <AppTopBar
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onOpenManager={handleOpenAddModal}
        activePage={activePage}
        onToggleAboutPage={() =>
          activePage === 'about' ? openHomePage() : openAboutPage()
        }
        t={t}
      />

      {activePage === 'about' ? (
        /* Dedicated About Page */
        <main className="flex-1 w-full pt-3 sm:pt-5">
          <AboutPage
            onBackHome={openHomePage}
            whatsappHref={whatsappHref}
            instagramUrl={socialConfig.instagramUrl}
          />
        </main>
      ) : (
        /* Main Home / Demos Container (Mobile single-column -> Tablet medium -> Desktop 12-col split) */
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column on Desktop / Top Section on Mobile: Headline + Desktop Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Bold Uppercase Hero Headline in Pure Black (#000000) */}
              <section
                aria-label="Developer Introduction"
                className="space-y-2.5"
              >
                <h1 className="font-display font-extrabold text-[25px] sm:text-[32px] lg:text-[36px] leading-[1.14] tracking-tight text-black uppercase">
                  {t.hero.headline}
                </h1>
                <p className="hidden sm:block text-sm text-slate-600 leading-relaxed">
                  {t.hero.subtext}
                </p>
              </section>

              {/* Desktop-only Quick Direct Connect Card (keeps desktop left column balanced) */}
              <div className="hidden lg:block space-y-5 pt-2">
                <section
                  aria-label="Desktop Quick Connect"
                  className="rounded-[28px] bg-[#0D4A9E] text-white p-6 shadow-lg space-y-4"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.hero.statusBadge}</span>
                  </span>

                  <p className="text-sm font-medium text-white/95 leading-relaxed">
                    {t.bottomBar.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full bg-white text-[#0D4A9E] text-xs font-bold inline-flex items-center gap-2 shadow-sm hover:bg-blue-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.bottomBar.whatsappBtn}</span>
                    </a>

                    <a
                      href={socialConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>{t.bottomBar.instagramBtn}</span>
                      <ExternalLink className="w-3 h-3 opacity-75" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyBioLink}
                      className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copiedBio ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{t.cardsRow.copiedText}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t.bottomBar.copyBioBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {/* Right Column on Desktop / Main Deck on Mobile & Tablet */}
            <div className="lg:col-span-7 w-full">
              <DemoCardsRow
                projects={projects}
                filteredProjects={filteredProjects}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                copiedId={copiedId}
                onCopyUrl={handleCopyUrl}
                onOpenEditModal={handleOpenEditModal}
                onOpenAddModal={handleOpenAddModal}
                translateCategory={translateCategory}
                getProjectTitle={getProjectTitle}
                getProjectIdea={getProjectIdea}
                getProjectHighlights={getProjectHighlights}
                t={t}
              />
            </div>
          </div>

          {/* How-To-Order & Contact Sections Below (Responsive Grid for Tablet & Desktop) */}
          <div className="mt-8 pt-6 space-y-6 border-t border-slate-200/80">
            {/* 3-Step Order Process */}
            <section
              id="how-to-order"
              aria-label="How to Order Your Website"
              className="rounded-[28px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0D4A9E] uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.howToOrder.kicker}</span>
                </div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-black">
                  {t.howToOrder.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {t.howToOrder.steps.map((st) => (
                  <div
                    key={st.num}
                    className="rounded-2xl bg-[#F3F4F6] p-4 flex items-start gap-3"
                  >
                    <span className="font-mono-tabular text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0D4A9E] text-white shrink-0">
                      {st.num}
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-sm text-black">
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct Social & Contact Card (Visible on Mobile & Tablet, and anchored for #contact) */}
            <section
              id="contact"
              aria-label="Contact Developer"
              className="lg:hidden rounded-[28px] bg-[#0D4A9E] text-white p-6 shadow-lg space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>{t.hero.statusBadge}</span>
              </span>

              <p className="text-sm font-medium text-white/95 leading-relaxed">
                {t.bottomBar.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white text-[#0D4A9E] text-xs font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.bottomBar.whatsappBtn}</span>
                </a>

                <a
                  href={socialConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold inline-flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{t.bottomBar.instagramBtn}</span>
                  <ExternalLink className="w-3 h-3 opacity-75" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyBioLink}
                  className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedBio ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{t.cardsRow.copiedText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.bottomBar.copyBioBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </main>
      )}

      {/* Fixed Bottom Reference Stack: Floating "Chat on WhatsApp" Pill + White Bottom Dock */}
      <div className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none px-4">
        <div className="max-w-[440px] mx-auto flex flex-col items-end gap-2.5">
          {/* Floating "Chat on WhatsApp" Pill (Exact Reference Image Placement & Style) */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mr-1 px-5 py-2.5 rounded-full bg-[#0D4A9E] hover:bg-[#093B82] text-white shadow-[0_12px_28px_-6px_rgba(13,74,158,0.75)] border border-white/15 inline-flex items-center gap-2 font-display font-bold text-[13px] transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white/15" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Bottom White Pill Navigation Dock (Exact Reference Image Layout) */}
          <nav
            aria-label="Bottom Navigation Dock"
            className="pointer-events-auto w-full rounded-full bg-white/95 backdrop-blur-md p-2 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.16)] border border-slate-200/90 flex items-center justify-between gap-2"
          >
            {/* Dock Item 1: Home / Demos Pill */}
            <button
              type="button"
              onClick={openHomePage}
              className={`h-12 rounded-full flex items-center justify-center gap-2 font-display font-bold text-[14px] transition-all cursor-pointer ${
                activePage === 'home' && activeDock === 'demos'
                  ? 'px-6 bg-[#0D4A9E] text-white shadow-md'
                  : 'w-12 bg-[#F3F4F6] text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              {activePage === 'home' && activeDock === 'demos' && (
                <span>Home</span>
              )}
            </button>

            {/* Dock Item 2: How to Order Process */}
            <button
              type="button"
              onClick={() => scrollToSection('how-to-order')}
              title={t.howToOrder.title}
              aria-label="How to Order"
              className={`h-12 rounded-full flex items-center justify-center gap-2 font-display font-bold text-[13px] transition-all cursor-pointer ${
                activePage === 'home' && activeDock === 'how-to-order'
                  ? 'px-5 bg-[#0D4A9E] text-white shadow-md'
                  : 'w-12 bg-[#F3F4F6] text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              {activePage === 'home' && activeDock === 'how-to-order' && (
                <span>Order</span>
              )}
            </button>

            {/* Dock Item 3: Dedicated About Page */}
            <button
              type="button"
              onClick={openAboutPage}
              title="About Kishore Dewangan"
              aria-label="About Page"
              className={`h-12 rounded-full flex items-center justify-center gap-2 font-display font-bold text-[13px] transition-all cursor-pointer ${
                activePage === 'about'
                  ? 'px-5 bg-[#0D4A9E] text-white shadow-md'
                  : 'w-12 bg-[#F3F4F6] text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              {activePage === 'about' && <span>About</span>}
            </button>

            {/* Dock Item 4: Settings / Link Manager Modal */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              title={t.addLinkBtn}
              aria-label={t.addLinkBtn}
              className="w-12 h-12 rounded-full bg-[#F3F4F6] text-slate-700 hover:bg-[#0D4A9E] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>

      {/* Add / Edit Demo Modal */}
      <LinkManagerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        projects={projects}
        socialConfig={socialConfig}
        onUpdateSocialConfig={setSocialConfig}
        initialEditProject={editingProject}
        onAddOrUpdateProject={handleAddOrUpdateProject}
        onDeleteProject={handleDeleteProject}
        onResetProjects={handleResetProjects}
        translateCategory={translateCategory}
        t={t}
      />
    </div>
  );
}

export default App;
