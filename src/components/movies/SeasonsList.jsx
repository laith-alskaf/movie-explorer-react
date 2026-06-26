/**
 * 📁 src/components/movies/SeasonsList.jsx
 *
 * 🎯 الغرض: عرض مواسم المسلسل في شكل بطاقات جانبية أو شبكة.
 */

import tmdbService from '../../services/tmdb.service';
import { useTranslation } from 'react-i18next';

const SeasonsList = ({ seasons }) => {
  const { t } = useTranslation();

  if (!seasons || seasons.length === 0) return null;

  // تجاهل "الموسم 0" أو الحلقات الخاصة إن أردنا، ولكن دعنا نعرضها كلها
  // عادة Specials تكون الموسم 0
  const sortedSeasons = [...seasons].sort((a, b) => a.season_number - b.season_number);

  return (
    <div className="mt-12">
      <h3 className="text-white text-xl font-black mb-6 tracking-wide flex items-center gap-2">
        <svg className="w-5 h-5 text-[#AB8BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {t('features.seasons')}
      </h3>
      
      {/* شبكة أفقية قابلة للتمرير للمواسم */}
      <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
        {sortedSeasons.map((season) => (
          <div 
            key={season.id} 
            className="flex-none w-[140px] sm:w-[160px] bg-[#0f0d23]/30 border border-white/5 rounded-2xl overflow-hidden hover:border-[#AB8BFF]/30 transition-all duration-300 snap-start shadow-md group"
          >
            <div className="aspect-[2/3] overflow-hidden bg-white/5 relative">
              <img
                src={tmdbService.getImageUrl(season.poster_path, 'w342')}
                alt={season.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
                {season.episode_count} {t('features.episodes')}
              </div>
            </div>
            <div className="p-3 text-center">
              <p className="text-white text-sm font-bold truncate group-hover:text-[#AB8BFF] transition-colors">
                {season.name}
              </p>
              {season.air_date && (
                <p className="text-light-200 text-xs mt-1">
                  {season.air_date.split('-')[0]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonsList;
