import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import usePersonStore from '../store/usePersonStore';
import { useTranslation } from 'react-i18next';
import tmdbService from '../services/tmdb.service';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import ImageModal from '../components/ui/ImageModal';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { slideInLeft, slideInRight, staggerContainer, fadeInUp } from '../utils/animations';
import { useState } from 'react';

const PersonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const person = usePersonStore((s) => s.person);
  const isLoading = usePersonStore((s) => s.isLoading);
  const error = usePersonStore((s) => s.error);
  const fetchPerson = usePersonStore((s) => s.fetchPerson);
  const resetPerson = usePersonStore((s) => s.resetPerson);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    fetchPerson(id);
    return () => resetPerson();
  }, [id, language]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#030014]"><Spinner /></div>;
  }

  if (error || !person) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#030014] px-5">
        <ErrorMessage message={error || "Person not found"} />
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] text-[#030014] font-bold">
          {t('features.back')}
        </button>
      </div>
    );
  }

  const {
    name,
    biography,
    profile_path,
    known_for_department,
    birthday,
    place_of_birth,
    combined_credits
  } = person;

  // ترتيب الأعمال الفنية حسب الشهرة
  const topCredits = combined_credits?.cast
    ?.sort((a, b) => b.popularity - a.popularity)
    ?.slice(0, 12) || [];

  return (
    <main className="min-h-screen bg-[#030014] py-8 md:py-14 px-5 relative overflow-hidden">
      <Helmet>
        <title>{name} - CineWave</title>
        <meta name="description" content={biography ? biography.substring(0, 150) + '...' : `Details about ${name} on CineWave`} />
        <meta property="og:title" content={`${name} - CineWave`} />
        <meta property="og:description" content={biography ? biography.substring(0, 150) + '...' : ''} />
        <meta property="og:image" content={tmdbService.getImageUrl(profile_path, 'w500')} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      {/* خلفية زجاجية تجميلية */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#AB8BFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* زر الرجوع */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-light-100 hover:text-white transition-all duration-300 mb-8 cursor-pointer shadow-md group"
        >
          <span className="transition-transform rtl:group-hover:translate-x-1 ltr:group-hover:-translate-x-1">{language === 'ar' ? '→' : '←'}</span>
          <span className="text-xs font-bold uppercase tracking-wider">{t('features.back')}</span>
        </button>

        {/* بطاقة الشخصية (Profile) */}
        <div className="w-full rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 lg:gap-12 overflow-hidden">
          
          {/* الصورة الشخصية */}
          <motion.div 
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            className="w-full md:w-64 lg:w-72 flex-shrink-0 mx-auto md:mx-0"
          >
            <div 
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#AB8BFF]/5 aspect-[2/3] cursor-zoom-in relative group"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={tmdbService.getImageUrl(profile_path, 'h632')}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* المعلومات */}
          <motion.div 
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col gap-6 text-start"
          >
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-wide mb-3">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {known_for_department && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#AB8BFF]/20 text-[#AB8BFF] border border-[#AB8BFF]/30 uppercase">
                    {known_for_department}
                  </span>
                )}
                {birthday && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-light-200">
                    {birthday}
                  </span>
                )}
                {place_of_birth && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-light-200 truncate max-w-[200px]">
                    {place_of_birth}
                  </span>
                )}
              </div>
            </div>

            {biography && (
              <div className="border-t border-white/5 pt-5">
                <h3 className="text-white text-base font-bold mb-2">{t('features.biography')}</h3>
                <p className="text-light-200 leading-relaxed text-sm font-medium whitespace-pre-line line-clamp-[8] hover:line-clamp-none transition-all cursor-pointer">
                  {biography}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* شبكة الأعمال الفنية (Credits) */}
        {topCredits.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-7 rounded-full bg-linear-to-b from-[#D6C7FF] to-[#AB8BFF]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {t('features.top_credits')}
              </h2>
            </div>

            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {topCredits.map((item) => (
                <motion.div key={`${item.id}-${item.credit_id}`} variants={fadeInUp}>
                  <Link
                    to={`/${item.media_type}/${item.id}`}
                    className="block group rounded-2xl overflow-hidden bg-[#0f0d23]/30 border border-white/5 hover:border-[#AB8BFF]/30 hover:shadow-[0_8px_20px_rgba(171,139,255,0.15)] hover:-translate-y-1 transition-all duration-300 h-full"
                  >
                    <div className="aspect-[2/3] overflow-hidden bg-white/5 relative">
                      <img
                        src={tmdbService.getImageUrl(item.poster_path, 'w342')}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {item.vote_average > 0 && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-[#AB8BFF] flex items-center gap-1">
                          ★ {item.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-[#AB8BFF] transition-colors text-start">
                        {item.title || item.name}
                      </p>
                      <p className="text-light-200 text-[10px] mt-1 line-clamp-1 text-start">
                        {item.character ? `${t('features.role')}: ${item.character}` : ''}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* نافذة عرض الصورة بكامل الشاشة */}
      <ImageModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={tmdbService.getImageUrl(profile_path, 'original')}
        altText={name}
      />
    </main>
  );
};

export default PersonDetailPage;
