/**
 * 📁 src/pages/HomePage.jsx
 *
 * 🎯 الغرض: الصفحة الرئيسية للتطبيق (Route: "/").
 *
 * 🧠 ما تغيّر بعد Zustand؟
 *   ❌ قبل: 6 أسطر useState + useEffect لجلب التصنيفات + Custom Hook لجلب الأفلام
 *   ✅ بعد: قراءة مباشرة من المتاجر + useEffect واحد للتحميل الأولي
 *
 *   الفرق الجوهري:
 *   - لا يوجد أي useState في هذه الصفحة بعد الآن!
 *   - كل الحالات تُقرأ من المتجر المركزي
 *   - كل الأفعال (البحث، الفلترة، الفرز) تُستدعى من المتجر
 *
 * 🧠 useDebounce لا يزال هنا — لماذا؟
 *   useDebounce من مكتبة react-use تحتاج React lifecycle (لأنها Hook).
 *   لا يمكن وضعها داخل متجر Zustand (لأنه ليس React component).
 *   لذلك نبقيها هنا: تراقب searchTerm من المتجر، وعند استقراره
 *   تستدعي fetchMovies() من المتجر.
 */

import { useEffect } from 'react';
import { useDebounce } from 'react-use';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

// ═══ المتاجر المركزية (Zustand Stores) ═══
import useMovieStore from '../store/useMovieStore';
import useTrendingStore from '../store/useTrendingStore';

// ═══ المكونات ═══
import Search from '../components/search/Search';
import TypingHeader from '../components/TypingHeader';
import MovieGrid from '../components/movies/MovieGrid';
import TrendingMoviesList from '../components/movies/TrendingMoviesList';
import GenreFilter from '../components/movies/GenreFilter';
import SortSelector from '../components/movies/SortSelector';
import AdvancedFilters from '../components/movies/AdvancedFilters';
import HeroSection from '../components/home/HeroSection';

const HomePage = () => {
  // ═══════════════════════════════════════════════════════════
  //   قراءة الحالات من المتجر المركزي (بدلاً من useState)
  // ═══════════════════════════════════════════════════════════

  /**
   * 🧠 كل سطر هنا هو "Selector" — يختار حالة محددة من المتجر.
   *    المكون يُعاد رسمه فقط عندما تتغير الحالات التي يقرأها.
   */
  const { language } = useLanguage();
  const { t } = useTranslation();

  const searchTerm = useMovieStore((s) => s.searchTerm);
  const selectedGenreId = useMovieStore((s) => s.selectedGenreId);
  const sortBy = useMovieStore((s) => s.sortBy);
  const mediaType = useMovieStore((s) => s.mediaType);
  const movies = useMovieStore((s) => s.movies);
  const genres = useMovieStore((s) => s.genres);
  const isLoading = useMovieStore((s) => s.isLoading);
  const errorMessage = useMovieStore((s) => s.errorMessage);
  const hasMore = useMovieStore((s) => s.hasMore);
  const isLoadingMore = useMovieStore((s) => s.isLoadingMore);
  
  const filterYear = useMovieStore((s) => s.filterYear);
  const filterRating = useMovieStore((s) => s.filterRating);
  const filterLanguage = useMovieStore((s) => s.filterLanguage);

  // قراءة الأفعال (Actions) من المتجر
  const setSelectedGenreId = useMovieStore((s) => s.setSelectedGenreId);
  const setSortBy = useMovieStore((s) => s.setSortBy);
  const fetchGenres = useMovieStore((s) => s.fetchGenres);
  const fetchMovies = useMovieStore((s) => s.fetchMovies);
  const loadMoreMovies = useMovieStore((s) => s.loadMoreMovies);

  // قراءة الأفلام الشائعة من متجر منفصل
  const trendingMovies = useTrendingStore((s) => s.trendingMovies);
  const fetchTrending = useTrendingStore((s) => s.fetchTrending);

  // ═══════════════════════════════════════════════════════════
  //   التحميل الأولي (Initial Load)
  // ═══════════════════════════════════════════════════════════

  /**
   * 🧠 هذا الـ useEffect يعمل مرة واحدة فقط عند تحميل الصفحة.
   *    [] (مصفوفة فارغة) = لا تعتمد على أي متغير = تعمل مرة واحدة فقط.
   *    نجلب: التصنيفات + الأفلام الشعبية + الأفلام الشائعة.
   */
  useEffect(() => {
    fetchGenres();
    fetchMovies();
    fetchTrending();
  }, [language, mediaType]);

  // ═══════════════════════════════════════════════════════════
  //   الـ Debounce للبحث
  // ═══════════════════════════════════════════════════════════

  /**
   * 🧠 useDebounce: ينتظر 500ms بعد آخر تغيير في searchTerm ثم يستدعي fetchMovies.
   *    هذا يمنع إرسال طلب API مع كل حرف يكتبه المستخدم.
   *    مثال: المستخدم يكتب "batman" → 6 حروف → طلب واحد فقط (بعد توقف الكتابة).
   */
  useDebounce(() => {
    fetchMovies();
  }, 500, [searchTerm]);

  // ═══════════════════════════════════════════════════════════
  //   إعادة الجلب عند تغيير التصنيف أو الترتيب
  // ═══════════════════════════════════════════════════════════

  /**
   * 🧠 عندما يغيّر المستخدم التصنيف أو الترتيب أو الفلاتر المتقدمة، نجلب الأفلام فوراً (بدون Debounce).
   *    لأن هذه ليست كتابة مستمرة — بل ضغطة واحدة = طلب واحد.
   */
  useEffect(() => {
    fetchMovies();
  }, [selectedGenreId, sortBy, filterYear, filterRating, filterLanguage]);

  // ═══════════════════════════════════════════════════════════

  // تم إزالة التمرير اللانهائي (Infinite Scrolling) التلقائي
  // واستبداله بزر "عرض المزيد" بناءً على طلب المستخدم لتحسين الوصول للتذييل (Footer)

  // ═══════════════════════════════════════════════════════════
  //   واجهة العرض (JSX)
  // ═══════════════════════════════════════════════════════════

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">

        {/* ترويسة البداية (Hero Section) الفاخرة */}
        <HeroSection />

        {/* قسم كبسولات تصفية الأفلام */}
        <GenreFilter
          genres={genres}
          selectedGenreId={selectedGenreId}
          onSelectGenre={setSelectedGenreId}
        />

        {/* قسم الأفلام الشائعة */}
        <TrendingMoviesList movies={trendingMovies} />

        {/* قسم جميع الأفلام مع خيارات الترتيب */}
        <section className="all-movies mt-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-7 rounded-full bg-linear-to-b from-[#D6C7FF] to-[#AB8BFF]" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {selectedGenreId
                  ? `${genres.find((g) => g.id === selectedGenreId)?.name || ''}`
                  : (mediaType === 'movie' ? t('home.all_movies') : t('features.all_series'))}
              </h2>
            </div>
            {/* منتقي الترتيب الفاخر */}
            <SortSelector sortBy={sortBy} onChangeSort={setSortBy} />
          </div>

          {/* الفلاتر المتقدمة (سنة، تقييم، لغة) */}
          <div className="mb-8">
            <AdvancedFilters />
          </div>

          <MovieGrid
            movies={movies}
            isLoading={isLoading && !isLoadingMore}
            errorMessage={errorMessage}
          />

          {/* زر تحميل المزيد */}
          {!isLoading && !errorMessage && hasMore && movies.length > 0 && (
            <div className="flex justify-center py-12">
              <button
                onClick={loadMoreMovies}
                disabled={isLoadingMore}
                className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold tracking-wider hover:bg-white/10 hover:border-[#AB8BFF]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {isLoadingMore ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('features.loading')}</span>
                  </>
                ) : (
                  <span>{t('features.load_more')}</span>
                )}
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default HomePage;
