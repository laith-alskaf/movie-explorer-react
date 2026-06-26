/**
 * 📁 src/components/layout/Footer.jsx
 *
 * 🎯 الغرض: تذييل الصفحة المشترك (Footer) مع بطاقة المطور التفاعلية.
 */

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="w-full mt-20 relative z-10 bg-[#030014]">
      {/* فاصل علوي متدرج ومشع */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#AB8BFF]/50 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-[30px] bg-gradient-to-b from-[#AB8BFF]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 py-16">
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 items-start border-b border-white/5 pb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          
          {/* الجانب الأيمن (معلومات البراند) - يأخذ 5 أعمدة */}
          <motion.div variants={fadeInUp} className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-[#D6C7FF] to-[#AB8BFF] flex items-center justify-center shadow-[0_0_20px_rgba(171,139,255,0.4)]">
                <svg className="w-4 h-4 text-[#030014] fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-light-200 font-black tracking-[0.1em] text-2xl font-bebas-neue">
                CINEWAVE
              </span>
            </div>
            <p className="text-sm text-light-200/80 leading-relaxed max-w-sm">
              {t('footer.description')}
              <br className="hidden md:block" />
              {t('footer.sub_description')}
            </p>
          </motion.div>

          {/* الجانب الأوسط (روابط سريعة) - يأخذ 3 أعمدة */}
          <motion.div variants={fadeInUp} className="md:col-span-3 flex flex-col items-center md:items-start gap-4 w-full">
            <h4 className="text-white font-bold tracking-wide">{t('footer.quick_links')}</h4>
            <ul className="flex flex-col items-center md:items-start gap-3 w-full">
              <li>
                <a href="/" className="text-sm text-light-200/80 hover:text-[#AB8BFF] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#AB8BFF] transition-colors" /> {t('footer.home')}
                </a>
              </li>
              <li>
                <a href="/favorites" className="text-sm text-light-200/80 hover:text-[#AB8BFF] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#AB8BFF] transition-colors" /> {t('footer.favorites')}
                </a>
              </li>
              <li>
                <a href="https://github.com/laith-alskaf" target="_blank" rel="noreferrer" className="text-sm text-light-200/80 hover:text-[#AB8BFF] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#AB8BFF] transition-colors" /> {t('footer.source_code')}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* الجانب الأيسر (بطاقة المطور) - يأخذ 4 أعمدة */}
          <motion.div variants={fadeInUp} className="md:col-span-4 w-full flex justify-center md:justify-end">
            <div 
              className="w-full max-w-sm p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-[#AB8BFF]/30 transition-all duration-500 shadow-xl"
            >
              {/* إضاءة خلفية نيونية */}
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#AB8BFF]/10 rounded-full blur-3xl group-hover:bg-[#AB8BFF]/20 transition-all duration-700" />
              
              <div className="flex gap-4 items-center relative z-10">
                {/* الأفاتار المطور */}
                <div className="w-14 h-14 rounded-full p-[2px] bg-linear-to-tr from-[#AB8BFF] via-[#D6C7FF] to-[#AB8BFF] relative flex-shrink-0 animate-[spin_4s_linear_infinite]" style={{ animationPlayState: 'paused' }} onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'running'} onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'paused'}>
                  <div className="w-full h-full rounded-full bg-[#030014] flex items-center justify-center text-xl overflow-hidden relative">
                    👨‍💻
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-[#030014] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* التفاصيل */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-white text-base font-bold tracking-wide leading-tight">Laith Alskaf</h3>
                  <p className="text-[#AB8BFF] text-[10px] font-black uppercase tracking-widest mt-0.5">
                    {t('footer.job_title')}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3 relative z-10">
                <p className="text-[11px] text-light-200/80 leading-relaxed">
                  {t('footer.dev_desc')}
                </p>
                
                <a
                  href="mailto:laithalskaf@gmail.com"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#AB8BFF] text-light-100 hover:text-[#030014] border border-white/10 hover:border-transparent font-bold text-xs tracking-wide transition-all duration-300 group/btn"
                >
                  <svg className="w-4 h-4 fill-current transition-transform group-hover/btn:scale-110 group-hover/btn:-rotate-12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span>{t('footer.contact_dev')}</span>
                </a>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* حقوق الملكية والسنة */}
        <motion.div 
          className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-light-200/60 mt-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} CineWave. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy_policy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms_of_service')}</a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
