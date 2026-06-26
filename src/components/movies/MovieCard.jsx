/**
 * 📁 src/components/movies/MovieCard.jsx
 *
 * 🎯 الغرض: بطاقة عرض الفيلم الفردية (Movie Card).
 *
 * 🧠 التصميم والمميزات:
 *   - شارة تقييم عائمة مدمجة (Floating Badge) ذات تأثير زجاجي في الزاوية العلوية.
 *   - تصميم بطاقات سينمائية عائمة ترتفع لأعلى وتتوهج بالبنفسجي عند مرور الماوس (`hover:-translate-y-1.5`).
 *   - تفاصيل مجمعة متناسقة وألوان نصوص متناسبة للمقروئية العالية.
 */

import { Link } from 'react-router-dom';
import tmdbService from '../../services/tmdb.service';
import useFavoritesStore from '../../store/useFavoritesStore';
import useMovieStore from '../../store/useMovieStore';

const MovieCard = ({ movie }) => {
  const { id, title, name, vote_average, poster_path, release_date, first_air_date, original_language } = movie;
  
  // دمج المتغيرات لتتناسب مع الأفلام والمسلسلات
  const displayTitle = title || name || 'Unknown Title';
  const displayDate = release_date || first_air_date;
  
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
  const year = displayDate ? displayDate.split('-')[0] : 'N/A';
  
  // قراءة نوع العمل المختار حالياً (أفلام أم مسلسلات)
  // هذا سيوجه الرابط إما إلى /movie/123 أو /tv/123
  const mediaType = useMovieStore((state) => state.mediaType);

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id));

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // لمنع الانتقال لصفحة التفاصيل عند الضغط على زر المفضلة
    toggleFavorite(movie);
  };

  return (
    <Link to={`/${mediaType}/${id}`} className="block group">
      <div className="flex flex-col h-full rounded-2xl bg-[#0f0d23]/30 border border-white/5 overflow-hidden transition-all duration-300 hover:translate-y-[-6px] hover:border-[#AB8BFF]/30 hover:shadow-[0_12px_24px_rgba(171,139,255,0.12)]">
        
        {/* حاوية الصورة والتقييم العائم */}
        <div className="relative overflow-hidden aspect-[2/3] bg-dark-100">
          <img
            src={tmdbService.getImageUrl(poster_path)}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* زر المفضلة */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 start-3 p-2 bg-[#030014]/60 backdrop-blur-md rounded-full border border-white/10 shadow-sm hover:bg-[#030014]/90 transition-all z-10 group/btn"
          >
            <svg
              className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white/70 group-hover/btn:text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* شارة التقييم العائمة */}
          <div className="absolute top-3 end-3 flex items-center gap-1 bg-[#030014]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-sm z-10">
            <img src="/star.svg" alt="Star" className="w-3.5 h-3.5" />
            <span className="text-white text-xs font-bold">{rating}</span>
          </div>
        </div>

        {/* تفاصيل العمل */}
        <div className="p-4 flex flex-col flex-grow justify-between gap-2">
          <h3 className="text-white text-sm font-semibold tracking-wide line-clamp-1 group-hover:text-[#AB8BFF] transition-colors duration-300 text-start">
            {displayTitle}
          </h3>

          <div className="flex items-center gap-2 text-xs text-light-200 mt-1">
            <span className="capitalize px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-bold border border-white/5">
              {original_language}
            </span>
            <span className="text-white/20">•</span>
            <span>{year}</span>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default MovieCard;
