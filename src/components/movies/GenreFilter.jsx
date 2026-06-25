/**
 * 📁 src/components/movies/GenreFilter.jsx
 *
 * 🎯 الغرض: شريط تصنيفات الأفلام (Genre Tabs Navigation).
 *
 * 🧠 التصميم والمميزات:
 *   - تبويبات زجاجية مجمعة في شريط واحد متصل (Unified Glass Navigation Bar).
 *   - التبويب النشط يظهر بتدرج CineWave الأرجواني الفاخر مع ظل نيون بارز.
 *   - التبويبات غير النشطة تتلاشى بنعومة وتستجيب للتحويم.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

const GenreFilter = ({ genres, selectedGenreId, onSelectGenre }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-5xl mx-auto my-10 px-4">
      {/* حاوية زجاجية بلورية موحدة ومضغوطة */}
      <div className="bg-white/[0.01] border border-white/5 p-1.5 rounded-2xl backdrop-blur-xl">
        <div className="flex flex-row items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 justify-start md:justify-center">
          
          {/* زر الكل */}
          <button
            onClick={() => onSelectGenre('')}
            className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              selectedGenreId === ''
                ? 'bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] text-[#030014] font-black shadow-[0_4px_20px_rgba(171,139,255,0.3)] scale-[1.02]'
                : 'text-light-200 hover:text-white hover:bg-white/5'
            }`}
          >
            {t('genre.all')}
          </button>

          {/* أزرار التصنيفات المستدعاة من الـ API */}
          {genres.map((genre) => {
            const isActive = selectedGenreId === genre.id;
            return (
              <button
                key={genre.id}
                onClick={() => onSelectGenre(genre.id)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] text-[#030014] font-black shadow-[0_4px_20px_rgba(171,139,255,0.3)] scale-[1.02]'
                    : 'text-light-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {genre.name}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default GenreFilter;
