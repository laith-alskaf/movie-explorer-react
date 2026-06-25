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

const MovieCard = ({
  movie: { id, title, vote_average, poster_path, release_date, original_language },
}) => {
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
  const year = release_date ? release_date.split('-')[0] : 'N/A';

  return (
    <Link to={`/movie/${id}`} className="block group">
      <div className="flex flex-col h-full rounded-2xl bg-[#0f0d23]/30 border border-white/5 overflow-hidden transition-all duration-300 hover:translate-y-[-6px] hover:border-[#AB8BFF]/30 hover:shadow-[0_12px_24px_rgba(171,139,255,0.12)]">
        
        {/* حاوية الصورة والتقييم العائم */}
        <div className="relative overflow-hidden aspect-[2/3] bg-dark-100">
          <img
            src={tmdbService.getImageUrl(poster_path)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* شارة التقييم العائمة */}
          <div className="absolute top-3 end-3 flex items-center gap-1 bg-[#030014]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">
            <img src="/star.svg" alt="Star" className="w-3.5 h-3.5" />
            <span className="text-white text-xs font-bold">{rating}</span>
          </div>
        </div>

        {/* تفاصيل الفيلم */}
        <div className="p-4 flex flex-col flex-grow justify-between gap-2">
          <h3 className="text-white text-sm font-semibold tracking-wide line-clamp-1 group-hover:text-[#AB8BFF] transition-colors duration-300 text-start">
            {title}
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
