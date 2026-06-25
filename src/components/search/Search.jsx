/**
 * 📁 src/components/search/Search.jsx
 *
 * 🎯 الغرض: مكون صندوق البحث — Controlled Component يقرأ من المتجر المركزي.
 *
 * 🧠 ما تغيّر بعد Zustand؟
 *   ❌ قبل: كان يستقبل searchTerm و setSearchTerm كـ Props من الأب (HomePage)
 *   ✅ بعد: يقرأ ويكتب مباشرة من/إلى المتجر المركزي (useMovieStore)
 *
 *   هذا يعني أن هذا المكون أصبح مستقلاً تماماً:
 *   - لا يحتاج Props من أي مكون أب
 *   - يمكن وضعه في أي مكان في التطبيق وسيعمل
 *   - هذا يحل مشكلة Prop Drilling بالكامل!
 *
 * 🧠 ما هو الـ Selector؟
 *   useMovieStore((state) => state.searchTerm)
 *   هذا يُسمى "Selector" — نختار فقط الجزء الذي نحتاجه من المتجر.
 *   الميزة: المكون يُعاد رسمه فقط عندما يتغير searchTerm،
 *   وليس عند تغيّر أي حالة أخرى في المتجر (مثل movies أو isLoading).
 */

import useMovieStore from '../../store/useMovieStore';
import { useTranslation } from 'react-i18next';

const Search = () => {
  // ✅ قراءة searchTerm مباشرة من المتجر المركزي (بدلاً من Props)
  const searchTerm = useMovieStore((state) => state.searchTerm);

  // ✅ قراءة دالة التحديث من المتجر (بدلاً من Props)
  const setSearchTerm = useMovieStore((state) => state.setSearchTerm);
  const { t } = useTranslation();

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />

        <input
          id="movie-search-input"
          type="text"
          placeholder={t('home.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for movies"
        />
      </div>
    </div>
  );
};

export default Search;
