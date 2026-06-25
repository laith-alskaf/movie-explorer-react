/**
 * 📁 src/components/layout/Navbar.jsx
 *
 * 🎯 الغرض: شريط الملاحة العلوي المشترك (Sticky Glassmorphic Navbar).
 *
 * 🧠 المميزات والتصميم:
 *   - تصميم زجاجي شبه شفاف (backdrop-blur-md bg-[#030014]/70) ليعطي طابعاً مستقبلياً ومميزاً.
 *   - خط Bebas Neue لشعار CineWave لإعطاء مظهر سينمائي فاخر.
 *   - متجاوب بالكامل (Responsive): يتكيف مع شاشات الهواتف والشاشات الكبيرة مع قائمة همبرغر.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import useMovieStore from '../../store/useMovieStore';

const Navbar = () => {
  const { t } = useTranslation();
  //useLocation() يعطينا الرابط الحالي لتلوين الرابط النشط (Active Link)
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // جلب دوال إعادة الضبط من المتجر
  const setSearchTerm = useMovieStore((state) => state.setSearchTerm);
  const setSelectedGenreId = useMovieStore((state) => state.setSelectedGenreId);
  const setSortBy = useMovieStore((state) => state.setSortBy);

  // دالة تُنفذ عند الضغط على زر "الرئيسية" أو الشعار
  const handleHomeClick = () => {
    setIsOpen(false);
    setSearchTerm(''); // تفريغ البحث
    setSelectedGenreId(''); // تفريغ تصنيف الأفلام
    setSortBy('popularity.desc'); // إعادة الترتيب للافتراضي
    window.scrollTo({ top: 0, behavior: 'smooth' }); // التمرير لأعلى الصفحة بنعومة
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030014]/60 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between relative">
        
        {/* الشعار والهوية البصرية */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2.5 group">
          {/* أيقونة شعار سينمائية مصممة برمجياً بالـ CSS والـ SVG */}
          <div className="relative w-9 h-9 rounded-xl bg-linear-to-tr from-[#D6C7FF] to-[#AB8BFF] flex items-center justify-center shadow-[0_0_15px_rgba(171,139,255,0.4)] group-hover:scale-105 transition-transform duration-300">
            {/* أيقونة زر تشغيل (Play) مبسطة */}
            <svg
              className="w-4 h-4 text-[#030014] fill-current ml-0.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          {/* اسم البراند */}
          <span className="text-gradient font-black tracking-wider text-2xl font-bebas-neue group-hover:opacity-90 transition-opacity">
            CINEWAVE
          </span>
        </Link>

        {/* أدوات الموبايل (اللغة + زر الهمبرغر) - تظهر فقط في الشاشات الصغيرة */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* روابط التصفح - شاشات الكمبيوتر */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`text-sm font-medium tracking-wide transition-colors duration-250 ${
              location.pathname === '/' ? 'text-[#AB8BFF]' : 'text-light-200 hover:text-white'
            }`}
          >
            {t('nav.home')}
          </Link>
          
          <a
            href="#developer-profile"
            className="text-sm font-medium px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-light-200 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            {t('nav.developer')}
          </a>

          <LanguageSwitcher />
        </div>
      </div>

      {/* القائمة المنسدلة - شاشات الموبايل */}
      <div 
        className={`md:hidden absolute top-full start-0 w-full bg-[#030014]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden shadow-2xl ${
          isOpen ? 'max-h-60 py-5 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-5 gap-5">
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`text-base font-medium tracking-wide transition-colors flex items-center gap-3 ${
              location.pathname === '/' ? 'text-[#AB8BFF]' : 'text-light-200 hover:text-white'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${location.pathname === '/' ? 'bg-[#AB8BFF]' : 'bg-transparent'}`}></span>
            {t('nav.home')}
          </Link>
          
          <a
            href="#developer-profile"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-light-200 hover:text-white hover:bg-white/10 transition-all text-center"
          >
            {t('nav.developer')}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
