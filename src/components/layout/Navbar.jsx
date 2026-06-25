/**
 * 📁 src/components/layout/Navbar.jsx
 *
 * 🎯 الغرض: شريط الملاحة العلوي المشترك (Sticky Glassmorphic Navbar).
 *
 * 🧠 المميزات والتصميم:
 *   - تصميم زجاجي شبه شفاف (backdrop-blur-md bg-[#030014]/70) ليعطي طابعاً مستقبلياً ومميزاً.
 *   - خط Bebas Neue لشعار CineWave لإعطاء مظهر سينمائي فاخر.
 *   - متجاوب بالكامل (Responsive): يتكيف مع شاشات الهواتف والشاشات الكبيرة.
 */

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  //useLocation() يعطينا الرابط الحالي لتلوين الرابط النشط (Active Link)
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030014]/60 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        
        {/* الشعار والهوية البصرية */}
        <Link to="/" className="flex items-center gap-2.5 group">
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

        {/* روابط التصفح */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
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
    </nav>
  );
};

export default Navbar;
