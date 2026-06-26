/**
 * 📁 src/pages/FavoritesPage.jsx
 *
 * 🎯 الغرض: صفحة لعرض الأفلام المفضلة للمستخدم.
 */

import { useTranslation } from 'react-i18next';
import useFavoritesStore from '../store/useFavoritesStore';
import MovieGrid from '../components/movies/MovieGrid';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header className="mb-10 text-center sm:mt-10 mt-5 relative z-10">
          <h1 className="text-gradient font-black tracking-wider text-4xl sm:text-5xl mb-4">
            المفضلة (Watchlist)
          </h1>
          <p className="text-light-200 text-lg max-w-2xl mx-auto">
            جميع أفلامك المحفوظة في مكان واحد للوصول السريع إليها.
          </p>
        </header>

        <section className="all-movies">
          {favorites.length === 0 ? (
            <div className="text-center text-light-200 py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#AB8BFF] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">قائمتك فارغة</h2>
              <p>قم بتصفح الأفلام واضغط على أيقونة القلب لحفظها هنا.</p>
            </div>
          ) : (
            <MovieGrid movies={favorites} isLoading={false} errorMessage="" />
          )}
        </section>
      </div>
    </main>
  );
};

export default FavoritesPage;
