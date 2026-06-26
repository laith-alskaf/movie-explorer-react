/**
 * 📁 src/pages/MovieDetailPage.jsx
 *
 * 🎯 الغرض: صفحة تفاصيل الفيلم الفنية والسينمائية (Cinematic Movie Detail Page).
 *
 * 🧠 ما تغيّر بعد Zustand؟
 *   ❌ قبل: كان يستخدم useMovieDetail(id) — Custom Hook مع useState داخلي
 *   ✅ بعد: يقرأ مباشرة من useMovieDetailStore + يستدعي fetchMovieDetail(id)
 *
 *   الميزة الإضافية: resetDetail() عند مغادرة الصفحة
 *   تمنع ظهور بيانات الفيلم السابق لحظياً عند فتح فيلم جديد.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import useMovieDetailStore from '../store/useMovieDetailStore';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import tmdbService from '../services/tmdb.service';
import useFavoritesStore from '../store/useFavoritesStore';
import WatchProviders from '../components/movies/WatchProviders';
import ImageGallery from '../components/movies/ImageGallery';
import SeasonsList from '../components/movies/SeasonsList';
import ImageModal from '../components/ui/ImageModal';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, scaleUp } from '../utils/animations';

const MovieDetailPage = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // ═══ قراءة الحالات والأفعال من متجر التفاصيل ═══
  const movie = useMovieDetailStore((s) => s.movie);
  const isLoading = useMovieDetailStore((s) => s.isLoading);
  const error = useMovieDetailStore((s) => s.error);
  const fetchMediaDetail = useMovieDetailStore((s) => s.fetchMediaDetail);
  const resetDetail = useMovieDetailStore((s) => s.resetDetail);

  // حالة محلية للنافذة المنبثقة للـ Trailer
  const [isModalOpen, setIsModalOpen] = useState(false);
  // حالة محلية للنافذة المنبثقة للصورة
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // حالة المفضلة للفيلم الحالي
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => movie ? s.isFavorite(movie.id) : false);

  /**
   * 🧠 useEffect هنا يفعل شيئين:
   *   1. عند الدخول: يجلب تفاصيل الفيلم بناءً على الـ mediaType والـ id من الرابط
   *   2. عند المغادرة (return): يمسح البيانات القديمة (resetDetail)
   *      هذا يُسمى "Cleanup Function" — تعمل عند unmount المكون
   */
  useEffect(() => {
    fetchMediaDetail(mediaType, id);

    // Cleanup: عند مغادرة الصفحة أو تغيّر الـ id أو النوع
    return () => resetDetail();
  }, [mediaType, id, language]);

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014]">
        <Spinner />
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#030014] px-5">
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] text-[#030014] font-bold shadow-[0_0_20px_rgba(171,139,255,0.3)] transition-all cursor-pointer"
        >
          {t('features.back_to_home')}
        </button>
      </div>
    );
  }

  if (!movie) return null;

  const {
    title,
    name,
    overview,
    poster_path,
    backdrop_path,
    vote_average,
    runtime,
    episode_run_time, // لبعض المسلسلات القديمة
    number_of_seasons,
    seasons,
    release_date,
    first_air_date,
    genres,
    credits,
    similar,
    videos,
  } = movie;

  // توحيد الحقول لأن TMDB يختلف بين الأفلام والمسلسلات
  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;
  const displayRuntime = runtime || (episode_run_time && episode_run_time.length > 0 ? episode_run_time[0] : 0);

  // استخراج مقطع الإعلان الدعائي (Trailer) الرسمي من YouTube إن وُجد
  const trailerVideo = videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos?.results?.find(
    (video) => video.site === 'YouTube'
  );

  const topCast = credits?.cast?.slice(0, 6) ?? [];
  const similarMovies = similar?.results?.slice(0, 4) ?? [];

  return (
    <main className="min-h-screen bg-[#030014] relative overflow-hidden">

      {/* خلفية البوستر الكبيرة للفيلم مع قناع تعتيم متدرج */}
      {backdrop_path && (
        <div className="absolute inset-x-0 top-0 h-[60vh] md:h-[70vh] z-0 select-none pointer-events-none">
          <div
            className="w-full h-full bg-cover bg-center opacity-25"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w1280${backdrop_path})`,
            }}
          />
          {/* تدرج سفلي وتدرج راديال للتعتيم والاندماج */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/60 to-[#030014]" />
        </div>
      )}

      {/* محتوى الصفحة الرئيسي */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-8 md:py-14">

        {/* زر الرجوع العائم */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-light-100 hover:text-white transition-all duration-300 mb-8 cursor-pointer shadow-md group"
        >
          <span className="transition-transform rtl:group-hover:translate-x-1 ltr:group-hover:-translate-x-1">{language === 'ar' ? '→' : '←'}</span>
          <span className="text-xs font-bold uppercase tracking-wider">{t('features.back')}</span>
        </button>

        {/* الكرت الزجاجي الكبير الحاوي لكل التفاصيل */}
        <div className="w-full rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-2xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 lg:gap-12 overflow-hidden">

          {/* الجزء الأيسر: البوستر */}
          <motion.div 
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            className="w-full md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0"
          >
            <div 
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#AB8BFF]/5 cursor-zoom-in relative group"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={tmdbService.getImageUrl(poster_path)}
                alt={displayTitle}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* الجزء الأيمن: التفاصيل والمعلومات */}
          <motion.div 
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col gap-6 text-start"
          >

            <div>
              {/* العنوان */}
              <h1 className="text-start text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-wide">
                {displayTitle}
              </h1>

              {/* شارات التفاصيل السريعة */}
              <div className="flex flex-wrap items-center gap-3 mt-4">

                {/* التقييم */}
                <div className="flex items-center gap-1.5 bg-[#AB8BFF]/15 border border-[#AB8BFF]/25 px-3 py-1 rounded-lg">
                  <img src="/star.svg" alt="Rating" className="w-4 h-4" />
                  <span className="text-white font-extrabold text-xs">
                    {vote_average ? vote_average.toFixed(1) : 'N/A'}
                  </span>
                </div>

                {/* تاريخ الإصدار */}
                {displayDate && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-light-200">
                    {displayDate.split('-')[0]}
                  </span>
                )}

                {/* مدة الفيلم / المسلسل */}
                {displayRuntime > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-light-200">
                    {Math.floor(displayRuntime / 60) > 0 && `${Math.floor(displayRuntime / 60)}h `}
                    {displayRuntime % 60}m
                  </span>
                )}

                {/* عدد المواسم (للمسلسلات فقط) */}
                {number_of_seasons > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-light-200">
                    {number_of_seasons} {number_of_seasons > 1 ? t('features.seasons_count') : t('features.season')}
                  </span>
                )}
              </div>

              {/* أين تشاهد؟ (Watch Providers) */}
              <WatchProviders providersData={movie['watch/providers']} />
            </div>

            {/* تصنيفات الفيلم */}
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/5 text-[#AB8BFF] border border-[#AB8BFF]/10"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* الأزرار التفاعلية المميزة */}
            <div className="flex flex-wrap gap-3.5 mt-2">
              {trailerVideo ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] text-[#030014] font-black text-xs uppercase tracking-wider shadow-[0_4px_25px_rgba(171,139,255,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{t('features.watch_trailer')}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-white/40 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5 fill-current opacity-40" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{t('features.trailer_unavailable')}</span>
                </button>
              )}

              <button
                onClick={() => toggleFavorite(movie)}
                className={`px-6 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 ${
                  isFavorite 
                    ? 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30' 
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  {isFavorite ? (
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  ) : (
                    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  )}
                </svg>
                <span>{isFavorite ? t('features.remove_favorite') : t('features.add_favorite')}</span>
              </button>
            </div>

            {/* قصة الفيلم */}
            {overview && (
              <div className="border-t border-white/5 pt-5">
                <h3 className="text-white text-base font-bold mb-2">{t('movie.overview')}</h3>
                <p className="text-light-200 leading-relaxed text-sm font-medium">
                  {overview}
                </p>
              </div>
            )}

            {/* طاقم التمثيل كأفاتارات دائرية متجاوبة */}
            {topCast.length > 0 && (
              <div className="border-t border-white/5 pt-5">
                <h3 className="text-white text-base font-bold mb-4">{t('movie.cast')}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {topCast.map((actor) => (
                    <Link to={`/person/${actor.id}`} key={actor.id} className="flex flex-col items-center gap-2 text-center group cursor-pointer">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 group-hover:border-[#AB8BFF]/60 transition-all duration-300 shadow-md">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                              : '/no-movie.png'
                          }
                          alt={actor.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="text-light-100 text-xs font-semibold leading-tight line-clamp-1 group-hover:text-white transition-colors">
                        {actor.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>

        {/* المواسم والحلقات (تظهر للمسلسلات فقط) */}
        {mediaType === 'tv' && seasons && seasons.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SeasonsList seasons={seasons} />
          </div>
        )}

        {/* معرض الصور (Image Gallery) */}
        {movie.images && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <ImageGallery imagesData={movie.images} />
          </div>
        )}

        {/* قسم الأفلام المشابهة */}
        {similarMovies.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-7 rounded-full bg-linear-to-b from-[#D6C7FF] to-[#AB8BFF]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                {t('movie.similar')}
              </h2>
            </div>

            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {similarMovies.map((sim) => (
                <motion.div key={sim.id} variants={fadeInUp}>
                  <Link
                    to={`/${mediaType}/${sim.id}`}
                    className="block group rounded-2xl overflow-hidden bg-[#0f0d23]/30 border border-white/5 hover:border-[#AB8BFF]/30 hover:shadow-[0_8px_20px_rgba(171,139,255,0.15)] hover:-translate-y-1 transition-all duration-300 h-full"
                  >
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={tmdbService.getImageUrl(sim.poster_path)}
                        alt={sim.title || sim.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-[#AB8BFF] transition-colors duration-300 text-start">
                        {sim.title || sim.name}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

      </div>

      {/* شاشة مشغل العرض المنبثقة الفاخرة (Glassmorphic Video Modal) */}
      <AnimatePresence>
        {isModalOpen && trailerVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          >
            {/* حاوية المشغل المقاومة للضغط الخارجي */}
            <motion.div
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#030014] shadow-[0_20px_50px_rgba(171,139,255,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* زر إغلاق دائري متوهج */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 end-4 z-10 w-10 h-10 rounded-full bg-[#030014]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#AB8BFF] hover:text-[#030014] hover:border-transparent transition-all duration-300 shadow-md cursor-pointer text-sm font-bold"
                aria-label="Close trailer"
              >
                ✕
              </button>

              {/* تضمين مشغل اليوتيوب */}
              <iframe
                src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&rel=0`}
                title={`${displayTitle} Official Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة عرض الصورة بكامل الشاشة */}
      <ImageModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={tmdbService.getImageUrl(poster_path, 'original')}
        altText={displayTitle}
      />

    </main>
  );
};

export default MovieDetailPage;
