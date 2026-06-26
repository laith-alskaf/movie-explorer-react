/**
 * 📁 src/components/ui/MediaTypeToggle.jsx
 *
 * 🎯 الغرض: مفتاح تبديل (Toggle) أنيق بين الأفلام (Movies) والمسلسلات (TV Shows).
 * 🧠 التصميم: زجاجي (Glassmorphic) مع حركة سلسة (Transition) توضح الخيار النشط.
 */

import { useTranslation } from 'react-i18next';
import useMovieStore from '../../store/useMovieStore';

const MediaTypeToggle = () => {
  const { t } = useTranslation();
  const mediaType = useMovieStore((state) => state.mediaType);
  const setMediaType = useMovieStore((state) => state.setMediaType);

  return (
    <div className="relative inline-flex items-center bg-[#030014]/60 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-lg mx-auto">
      
      {/* خلفية متحركة تشير للعنصر النشط */}
      <div
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full shadow-[0_0_15px_rgba(171,139,255,0.4)] transition-transform duration-300 ease-out z-0 ${
          mediaType === 'movie' ? 'translate-x-0' : 'ltr:translate-x-[100%] rtl:-translate-x-[100%]'
        }`}
      />

      {/* زر الأفلام */}
      <button
        onClick={() => setMediaType('movie')}
        className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors duration-300 w-32 sm:w-40 ${
          mediaType === 'movie' ? 'text-[#030014]' : 'text-light-200 hover:text-white'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <span>{t('features.movies')}</span>
      </button>

      {/* زر المسلسلات */}
      <button
        onClick={() => setMediaType('tv')}
        className={`relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors duration-300 w-32 sm:w-40 ${
          mediaType === 'tv' ? 'text-[#030014]' : 'text-light-200 hover:text-white'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>{t('features.tv_shows')}</span>
      </button>

    </div>
  );
};

export default MediaTypeToggle;
