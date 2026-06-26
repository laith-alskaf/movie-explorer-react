/**
 * 📁 src/components/layout/MobileBottomNav.jsx
 *
 * 🎯 الغرض: شريط تنقل سفلي عائم مخصص لشاشات الموبايل (iOS style).
 * 🧠 المميزات: يحل محل الـ Navbar العلوي في الشاشات الصغيرة لسهولة الاستخدام بإصبع واحد.
 */

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useMovieStore from '../../store/useMovieStore';

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const setSearchTerm = useMovieStore((state) => state.setSearchTerm);
  const setSelectedGenreId = useMovieStore((state) => state.setSelectedGenreId);
  const setSortBy = useMovieStore((state) => state.setSortBy);

  const handleHomeClick = () => {
    setSearchTerm('');
    setSelectedGenreId('');
    setSortBy('popularity.desc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
      <div className="bg-[#030014]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* زر الرئيسية */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 w-16 ${
            location.pathname === '/' ? 'text-[#AB8BFF] bg-white/5' : 'text-light-200 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-semibold">{t('nav.home')}</span>
        </Link>

        {/* زر المفضلة (سيتم برمجته في المرحلة القادمة) */}
        <Link
          to="/favorites"
          className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 w-16 ${
            location.pathname === '/favorites' ? 'text-[#AB8BFF] bg-white/5' : 'text-light-200 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-[10px] font-semibold">المفضلة</span>
        </Link>

        {/* زر المطور */}
        <a
          href="#developer-profile"
          className="flex flex-col items-center p-2 rounded-xl transition-all duration-300 w-16 text-light-200 hover:text-white"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-[10px] font-semibold">{t('nav.developer')}</span>
        </a>

      </div>
    </div>
  );
};

export default MobileBottomNav;
