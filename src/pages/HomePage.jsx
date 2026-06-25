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
  const movies = useMovieStore((s) => s.movies);
  const genres = useMovieStore((s) => s.genres);
  const isLoading = useMovieStore((s) => s.isLoading);
  const errorMessage = useMovieStore((s) => s.errorMessage);

  // قراءة الأفعال (Actions) من المتجر
  const setSelectedGenreId = useMovieStore((s) => s.setSelectedGenreId);
  const setSortBy = useMovieStore((s) => s.setSortBy);
  const fetchGenres = useMovieStore((s) => s.fetchGenres);
  const fetchMovies = useMovieStore((s) => s.fetchMovies);

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
  }, [language]);

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
   * 🧠 عندما يغيّر المستخدم التصنيف أو الترتيب، نجلب الأفلام فوراً (بدون Debounce).
   *    لأن هذه ليست كتابة مستمرة — بل ضغطة واحدة = طلب واحد.
   */
  useEffect(() => {
    fetchMovies();
  }, [selectedGenreId, sortBy]);

  // ═══════════════════════════════════════════════════════════
  //   واجهة العرض (JSX)
  // ═══════════════════════════════════════════════════════════

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">

        {/* ترويسة البداية (Hero Section): كارت سينمائي عريض */}
        <header className="relative w-full rounded-3xl overflow-hidden bg-linear-to-b from-[#120a2b]/30 to-[#030014]/50 border border-white/5 backdrop-blur-md p-8 md:p-14 mb-10 shadow-2xl flex flex-col items-center text-center min-h-[380px] justify-center">

          {/* خلفية البانر المندمجة والمضببة */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 select-none">
            <img
              src="./hero.png"
              alt="Hero Background"
              className="w-full h-full object-cover scale-105 filter blur-xs"
            />
            <div className="absolute inset-0 bg-[#030014]/80 bg-gradient-to-t from-[#030014] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-3xl flex flex-col gap-6">
            {/* الشارة الترحيبية الدائرية */}
            <div className="mx-auto flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full shadow-sm max-w-max">
              <span className="w-2 h-2 rounded-full bg-[#AB8BFF] animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">CINEWAVE HUB</span>
            </div>

            <TypingHeader />

            {/* 🧠 Search لم يعد يحتاج Props! يقرأ من المتجر مباشرة */}
            <Search />
          </div>
        </header>

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
                  : t('home.all_movies')}
              </h2>
            </div>
            {/* منتقي الترتيب الفاخر */}
            <SortSelector sortBy={sortBy} onChangeSort={setSortBy} />
          </div>

          <MovieGrid
            movies={movies}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        </section>

      </div>
    </main>
  );
};

export default HomePage;
