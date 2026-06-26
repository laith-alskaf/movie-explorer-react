/**
 * 📁 src/store/useFavoritesStore.js
 *
 * 🎯 الغرض: متجر لحفظ قائمة الأفلام المفضلة للمستخدم.
 * 🧠 التقنية: استخدام persist middleware لحفظ البيانات في localStorage تلقائياً.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [], // مصفوفة لتخزين الأفلام المفضلة

      // دالة لإضافة أو إزالة فيلم من المفضلة
      toggleFavorite: (movie) => {
        const { favorites } = get();
        const isFavorite = favorites.some((fav) => fav.id === movie.id);

        if (isFavorite) {
          // إزالة الفيلم إذا كان موجوداً
          set({ favorites: favorites.filter((fav) => fav.id !== movie.id) });
        } else {
          // إضافة الفيلم إذا لم يكن موجوداً
          set({ favorites: [...favorites, movie] });
        }
      },

      // دالة للتحقق مما إذا كان الفيلم في المفضلة
      isFavorite: (movieId) => {
        const { favorites } = get();
        return favorites.some((fav) => fav.id === movieId);
      },
    }),
    {
      name: 'cinewave-favorites', // اسم المفتاح في localStorage
    }
  )
);

export default useFavoritesStore;
