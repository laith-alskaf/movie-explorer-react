/**
 * 📁 src/store/useTrendingStore.js
 *
 * 🎯 الغرض: متجر الأفلام الأكثر بحثاً (Trending Movies Store).
 *
 * 🧠 لماذا متجر منفصل عن useMovieStore؟
 *   - مصدر البيانات مختلف: Appwrite (وليس TMDB)
 *   - البيانات تُجلب مرة واحدة فقط عند تحميل الصفحة
 *   - لا ترتبط بالبحث أو الفلترة أو الترتيب
 *   هذا تطبيق لمبدأ Single Responsibility: كل متجر مسؤول عن ميزة واحدة.
 *
 * 📌 ملاحظة:
 *   getTrendingMovies تأتي من appwrite.service وليس tmdb.service
 *   لأن بيانات الـ Trending مخزنة في قاعدة بيانات Appwrite الخاصة بنا.
 */

import { create } from 'zustand';
import { getTrendingMovies } from '../services/appwrite.service';

const useTrendingStore = create((set) => ({

  // ═══════════ الحالات (State) ═══════════

  /** قائمة الأفلام الأكثر بحثاً */
  trendingMovies: [],

  /** هل جارٍ تحميل الأفلام الشائعة؟ */
  isTrendingLoading: true,

  // ═══════════ الأفعال (Actions) ═══════════

  /**
   * جلب الأفلام الشائعة من Appwrite.
   * تُستدعى مرة واحدة عند تحميل الصفحة الرئيسية.
   *
   * 🧠 لاحظ: لا نستخدم get() هنا لأننا لا نحتاج قراءة حالة سابقة.
   *    نحتاج فقط set() لتحديث النتائج.
   */
  fetchTrending: async () => {
    set({ isTrendingLoading: true });

    try {
      const movies = await getTrendingMovies();
      set({ trendingMovies: movies ?? [] });
    } catch (error) {
      console.error('[TrendingStore] fetchTrending failed:', error);
      set({ trendingMovies: [] });
    } finally {
      set({ isTrendingLoading: false });
    }
  },
}));

export default useTrendingStore;
