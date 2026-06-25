/**
 * 📁 src/components/layout/Footer.jsx
 *
 * 🎯 الغرض: تذييل الصفحة المشترك (Footer) مع بطاقة المطور التفاعلية (Developer Profile Card).
 *
 * 🧠 المميزات والتصميم:
 *   - تصميم زجاجي فاخر (glass-panel) للبطاقة مع توهج نيون عند مرور مؤشر الماوس (glow-hover).
 *   - زر مراسلة ينبض بالإضاءة للتواصل المباشر عبر البريد الإلكتروني.
 *   - أيقونات عصرية وتأثيرات بصرية راقية.
 */

import tmdbService from '../../services/tmdb.service';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full border-t border-white/5 bg-[#030014]/40 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-5 py-12 flex flex-col items-center gap-10">
        
        {/* القسم الرئيسي للتذييل */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-8 border-b border-white/5 pb-8">
          
          {/* الجانب الأيسر: معلومات البراند */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-[#D6C7FF] to-[#AB8BFF] flex items-center justify-center">
                <svg className="w-3 h-3 text-[#030014] fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-gradient font-black tracking-wider text-xl font-bebas-neue">
                CINEWAVE
              </span>
            </div>
            <p className="text-sm text-light-200 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* الجانب الأيمن: بطاقة المطور المميزة */}
          <div 
            id="developer-profile" 
            className="w-full max-w-md p-6 rounded-2xl glass-panel glow-hover relative overflow-hidden group"
          >
            {/* إضاءة خلفية نيونية غير مرئية تظهر عند التحويم */}
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#AB8BFF]/10 rounded-full blur-2xl group-hover:bg-[#AB8BFF]/20 transition-all duration-500" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              
              {/* أيقونة/أفاتار المهندس البرمجي */}
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#0f0d23] to-[#252150] border border-white/10 flex items-center justify-center text-2xl shadow-inner relative flex-shrink-0">
                👨‍💻
                {/* نقطة خضراء متوهجة تشير إلى "متاح للعمل/النشاط" */}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#030014] rounded-full animate-pulse" />
              </div>

              {/* تفاصيل المطور */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 flex-1">
                <div>
                  <h3 className="text-white text-lg font-bold tracking-wide">Laith Alskaf</h3>
                  <p className="text-[#AB8BFF] text-xs font-semibold uppercase tracking-wider">
                    {t('footer.job_title')}
                  </p>
                </div>
                
                <p className="text-xs text-light-200 leading-relaxed">
                  {t('footer.dev_desc')}
                </p>

                {/* زر الاتصال بالبريد الإلكتروني التفاعلي */}
                <a
                  href="mailto:laithalskaf@gmail.com"
                  className="mt-2.5 inline-flex items-center gap-2 px-4.5 py-2 rounded-xl bg-[#AB8BFF]/10 hover:bg-[#AB8BFF] text-white hover:text-[#030014] border border-[#AB8BFF]/20 hover:border-transparent font-medium text-xs tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(171,139,255,0.05)] hover:shadow-[0_0_20px_rgba(171,139,255,0.3)] hover:scale-[1.02]"
                >
                  {/* أيقونة رسالة البريد */}
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span>laithalskaf@gmail.com</span>
                </a>
              </div>
              
            </div>
          </div>

        </div>

        {/* حقوق الملكية والسنة */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-light-200">
          <p>© {new Date().getFullYear()} CineWave. {t('footer.rights')}</p>
          <p className="flex items-center gap-1.5">
            {t('footer.developed_by')}
            <span className="text-[#AB8BFF] font-semibold">Laith Alskaf</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
