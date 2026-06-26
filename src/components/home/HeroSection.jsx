/**
 * 📁 src/components/home/HeroSection.jsx
 *
 * 🎯 الغرض: ترويسة رئيسية (Hero) ديناميكية، فاخرة، مع صور خلفية متغيرة بناءً على الأفلام الشائعة.
 */

import { useState, useEffect } from 'react';
import useMovieStore from '../../store/useMovieStore';
import tmdbService from '../../services/tmdb.service';
import TypingHeader from '../TypingHeader';
import MediaTypeToggle from '../ui/MediaTypeToggle';
import Search from '../search/Search';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const HeroSection = () => {
  const movies = useMovieStore(s => s.movies);
  const [currentBg, setCurrentBg] = useState('./hero.png');
  const [nextBg, setNextBg] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useTranslation();

  // دورة لتغيير الخلفية بناءً على أشهر الأفلام
  useEffect(() => {
    if (movies && movies.length > 0) {
      // نأخذ أفضل 5 أعمال تمتلك backdrop
      const backdrops = movies
        .filter(m => m.backdrop_path)
        .slice(0, 5)
        .map(m => tmdbService.getImageUrl(m.backdrop_path, 'w1280'));
        
      if (backdrops.length > 0) {
        let index = 0;
        setCurrentBg(backdrops[0]);
        
        const interval = setInterval(() => {
          const nextIndex = (index + 1) % backdrops.length;
          setNextBg(backdrops[nextIndex]);
          setIsTransitioning(true);
          
          setTimeout(() => {
            setCurrentBg(backdrops[nextIndex]);
            setIsTransitioning(false);
            setNextBg(null);
          }, 1000); // مدة التلاشي
          
          index = nextIndex;
        }, 6000); // تغيير كل 6 ثواني
        
        return () => clearInterval(interval);
      }
    }
  }, [movies]);

  return (
    <motion.header 
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-[40px] overflow-hidden bg-[#030014] border border-white/5 p-8 md:p-16 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center min-h-[480px] justify-center group"
    >
      
      {/* الخلفية الديناميكية المتبدلة */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* الصورة الحالية */}
        <img
          src={currentBg}
          alt="Hero Background"
          className={`w-full h-full object-cover scale-110 transition-all duration-[1500ms] ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-60'} group-hover:scale-[1.15]`}
        />
        {/* الصورة القادمة (للتلاشي السلس) */}
        {nextBg && (
          <img
            src={nextBg}
            alt="Hero Background Next"
            className={`absolute inset-0 w-full h-full object-cover scale-110 transition-all duration-[1500ms] ease-in-out ${isTransitioning ? 'opacity-60' : 'opacity-0'} group-hover:scale-[1.15]`}
          />
        )}
        {/* تدرج التعتيم من الأسفل وتوهج أسود لحماية النص */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/40 to-[#030014]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(3,0,20,0.6)_0%,_transparent_60%)]" />
      </div>

      {/* دائرة توهج ملونة خلف النص */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[600px] h-[70vw] md:h-[600px] bg-[#AB8BFF] rounded-full mix-blend-multiply filter blur-[150px] pointer-events-none" 
      />

      <motion.div 
        className="relative z-10 w-full max-w-4xl flex flex-col gap-7 items-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* الشارة الترحيبية الدائرية */}
        <motion.div variants={fadeInUp} className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 px-5 py-2 rounded-full shadow-[0_0_20px_rgba(171,139,255,0.15)] backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] animate-pulse shadow-[0_0_10px_#AB8BFF]" />
          <span className="text-[10px] md:text-xs font-black text-transparent bg-clip-text bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] uppercase tracking-[0.2em]">
            {t('features.premium_exp')}
          </span>
        </motion.div>

        {/* النص الذي يُكتب تلقائياً */}
        <motion.div variants={fadeInUp} className="transform scale-100 md:scale-110 mt-2 mb-2 w-full px-4">
          <TypingHeader />
        </motion.div>

        {/* مفتاح تبديل الأفلام / المسلسلات */}
        <motion.div variants={fadeInUp} className="mt-4 mb-2 z-20">
          <MediaTypeToggle />
        </motion.div>

        {/* مربع البحث */}
        <motion.div variants={fadeInUp} className="w-full max-w-2xl mt-4 z-20 px-4 transition-transform duration-300 hover:scale-[1.02]">
          <Search />
        </motion.div>
      </motion.div>
      
      {/* خط زخرفي سفلي */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#AB8BFF]/30 to-transparent" />
    </motion.header>
  );
};

export default HeroSection;
