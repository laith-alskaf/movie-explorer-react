/**
 * 📁 src/components/movies/ImageGallery.jsx
 *
 * 🎯 الغرض: عرض معرض صور (Backdrops) للعمل الفني بتصميم عصري (Horizontal Scroll).
 */

import tmdbService from '../../services/tmdb.service';
import { useTranslation } from 'react-i18next';

const ImageGallery = ({ imagesData }) => {
  const { t } = useTranslation();

  if (!imagesData || !imagesData.backdrops || imagesData.backdrops.length === 0) return null;

  // أخذ أفضل 10 صور كحد أقصى لتجنب إثقال الصفحة
  const backdrops = imagesData.backdrops.slice(0, 10);

  if (backdrops.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-white text-xl font-black mb-6 tracking-wide flex items-center gap-2">
        <svg className="w-5 h-5 text-[#AB8BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('features.image_gallery')}
      </h3>
      
      {/* شريط تمرير أفقي مخفي الـ Scrollbar */}
      <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
        {backdrops.map((image, index) => (
          <div 
            key={index} 
            className="flex-none w-[280px] sm:w-[400px] aspect-video rounded-2xl overflow-hidden snap-center border border-white/5 hover:border-[#AB8BFF]/30 transition-all duration-300 shadow-lg"
          >
            <img
              src={tmdbService.getImageUrl(image.file_path, 'w780')}
              alt={`Gallery Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
