/**
 * 📁 src/components/movies/AdvancedFilters.jsx
 *
 * 🎯 الغرض: فلاتر متقدمة (سنة، تقييم، لغة) قابلة للطي للحفاظ على بساطة الواجهة.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMovieStore from '../../store/useMovieStore';
import { motion, AnimatePresence } from 'framer-motion';
import { expandHeight } from '../../utils/animations';

const AdvancedFilters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const filterYear = useMovieStore((s) => s.filterYear);
  const filterRating = useMovieStore((s) => s.filterRating);
  const filterLanguage = useMovieStore((s) => s.filterLanguage);
  const setFilters = useMovieStore((s) => s.setFilters);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const languages = [
    { code: '', label: t('genre.all') },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleReset = () => {
    setFilters({ filterYear: '', filterRating: 0, filterLanguage: '' });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 mb-8 relative z-10">
      
      {/* زر فتح/إغلاق الفلاتر */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-bold text-light-200 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {isOpen ? t('features.hide_filters') : t('features.advanced_filters')}
          {(filterYear || filterRating > 0 || filterLanguage) && !isOpen && (
            <span className="w-2 h-2 rounded-full bg-[#AB8BFF] animate-pulse ml-1" />
          )}
        </button>
      </div>

      {/* منطقة الفلاتر */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={expandHeight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-4 p-5 rounded-2xl bg-[#0f0d23]/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* فلتر السنة */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-light-200 ml-1">{t('features.release_year')}</label>
                <select
                  value={filterYear}
                  onChange={(e) => handleFilterChange('filterYear', e.target.value)}
                  className="w-full bg-[#030014]/50 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#AB8BFF]/50 transition-colors"
                >
                  <option value="">{t('features.any_year')}</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* فلتر التقييم */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-light-200 ml-1">{t('features.min_rating')}</label>
                <select
                  value={filterRating}
                  onChange={(e) => handleFilterChange('filterRating', Number(e.target.value))}
                  className="w-full bg-[#030014]/50 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#AB8BFF]/50 transition-colors"
                >
                  <option value={0}>{t('features.any_rating')}</option>
                  <option value={5}>+5.0</option>
                  <option value={7}>+7.0</option>
                  <option value={8}>+8.0</option>
                  <option value={9}>+9.0</option>
                </select>
              </div>

              {/* فلتر اللغة */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-light-200 ml-1">{t('features.language')}</label>
                <select
                  value={filterLanguage}
                  onChange={(e) => handleFilterChange('filterLanguage', e.target.value)}
                  className="w-full bg-[#030014]/50 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#AB8BFF]/50 transition-colors"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* زر إعادة الضبط */}
            {(filterYear || filterRating > 0 || filterLanguage) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20"
                >
                  ✕ {t('features.clear_filters')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
