'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { demoCondominium, demoEdition } from '@/data/demo';
import { categories } from '@/data/categories';
import { Category } from '@/types';
import { ViewMode, viewModeLabels, ThemePreset, themePresets } from '@/components/revista/types';
import FlipView from '@/components/revista/FlipView';
import ScrollView from '@/components/revista/ScrollView';
import GridView from '@/components/revista/GridView';
import StoriesView from '@/components/revista/StoriesView';
import NewspaperView from '@/components/revista/NewspaperView';
import SlidesView from '@/components/revista/SlidesView';
import TimelineView from '@/components/revista/TimelineView';
import EleganteView from '@/components/revista/EleganteView';
import LayoutSelector from '@/components/revista/LayoutSelector';
import { DemoClassifiedSubmission, loadDemoClassifieds, mergeClassifiedSection } from '@/lib/demoClassifieds';

export default function RevistaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('stories');
  const [showSelector, setShowSelector] = useState(false);
  const [theme, setTheme] = useState<ThemePreset>(themePresets[0]);
  const [demoClassifieds, setDemoClassifieds] = useState<DemoClassifiedSubmission[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDemoClassifieds(loadDemoClassifieds());
  }, []);

  const condo = {
    ...demoCondominium,
    themeColor: theme.themeColor,
    accentColor: theme.accentColor,
  };
  const edition = demoEdition;
  const sections = edition.sections
    .filter(s => s.visible)
    .map((section) => (section.categoryId === 'classificados' ? mergeClassifiedSection(section, demoClassifieds) : section));

  const getCategoryInfo = (catId: string): Category | undefined =>
    categories.find(c => c.id === catId);

  const viewProps = { edition, condo, sections, categories, getCategoryInfo };

  const modes: ViewMode[] = ['flip', 'scroll', 'grid', 'stories', 'newspaper', 'slides', 'timeline', 'elegante'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bgGradient }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/20 backdrop-blur-sm border-b border-white/5">
        <Link href="/demo" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </Link>

        {/* View Mode Selector - compact */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {modes.map(mode => {
            const info = viewModeLabels[mode];
            const active = viewMode === mode;
            return (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all ${active ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                title={info.label}>
                {active && (
                  <motion.div layoutId="viewModeTab"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: `${condo.accentColor}33`, border: `1px solid ${condo.accentColor}55` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative text-xs">{info.icon}</span>
                <span className="relative hidden lg:inline">{info.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Customize button */}
          <button onClick={() => setShowSelector(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs">
            <span>🎨</span>
            <span className="hidden sm:inline">Personalizar</span>
          </button>
          <Link href="/" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs">
            Sair
          </Link>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'flip' && <FlipView {...viewProps} />}
      {viewMode === 'scroll' && <ScrollView {...viewProps} />}
      {viewMode === 'grid' && <GridView {...viewProps} />}
      {viewMode === 'stories' && <StoriesView {...viewProps} />}
      {viewMode === 'newspaper' && <NewspaperView {...viewProps} />}
      {viewMode === 'slides' && <SlidesView {...viewProps} />}
      {viewMode === 'timeline' && <TimelineView {...viewProps} />}
      {viewMode === 'elegante' && <EleganteView {...viewProps} />}

      {/* Layout Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <LayoutSelector
            currentMode={viewMode}
            currentTheme={theme}
            onSelectMode={setViewMode}
            onSelectTheme={setTheme}
            onClose={() => setShowSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
