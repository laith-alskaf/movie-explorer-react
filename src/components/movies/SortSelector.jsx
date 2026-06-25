/**
 * 📁 src/components/movies/SortSelector.jsx
 *
 * 🎯 الغرض: منتقي فرز الأفلام الفاخر (Custom Glassmorphic Dropdown).
 *
 * 🧠 التصميم والمميزات:
 *   - قائمة منسدلة زجاجية مخصصة للتحكم بالفرز (شعبية، تقييم، أحدث).
 *   - مستشعر الضغط الخارجي (Click Outside Detector) لإغلاق المنسدل تلقائياً.
 *   - تصميم متجانس تماماً مع نسق CineWave الداكن والبنفسجي النيوني.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SortSelector = ({ sortBy, onChangeSort }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'popularity.desc', label: t('sort.popular') },
    { value: 'vote_average.desc', label: t('sort.top_rated') },
    { value: 'primary_release_date.desc', label: t('sort.newest') }
  ];

  const currentOption = options.find((opt) => opt.value === sortBy) || options[0];

  // إغلاق المنسدل عند النقر في أي مكان خارج المكون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-30 flex-shrink-0" ref={dropdownRef}>
      {/* زر التنشيط للمنسدل */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#AB8BFF]/30 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer min-w-[210px] shadow-md"
      >
        <span className="flex items-center gap-2">
          {/* أيقونة الفرز */}
          <svg className="w-4 h-4 text-light-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-3-3m3 3l3-3" />
          </svg>
          {currentOption.label}
        </span>
        
        {/* سهم المؤشر */}
        <svg
          className={`w-3.5 h-3.5 text-light-200 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* خيارات المنسدل */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f0d23]/95 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/80 animate-fade-in">
          {options.map((opt) => {
            const isSelected = opt.value === sortBy;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChangeSort(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3.5 text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer block border-b border-white/5 last:border-b-0 ${
                  isSelected
                    ? 'bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] text-[#030014]'
                    : 'text-light-200 hover:text-white hover:bg-white/5'
                } text-start`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortSelector;
