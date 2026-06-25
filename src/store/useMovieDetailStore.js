/**
 * 📁 src/store/useMovieDetailStore.js
 *
 * 🎯 الغرض: متجر تفاصيل الفيلم الواحد (Movie Detail Store).
 *
 * 🧠 لماذا متجر منفصل؟
 *   - صفحة التفاصيل مستقلة تماماً عن الصفحة الرئيسية
 *   - تحتاج بيانات مختلفة: القصة، طاقم التمثيل، الأفلام المشابهة، الفيديوهات
 *   - لها حالة تحميل وخطأ خاصة بها
 *
 * 🧠 لماذا نحتاج resetDetail()؟
 *   عندما ينتقل المستخدم من فيلم لآخر، نحتاج مسح بيانات الفيلم السابق
 *   حتى لا تظهر بيانات قديمة لحظة قبل تحميل البيانات الجديدة.
 *   هذا يُسمى "Stale Data Prevention" (منع البيانات القديمة).
 */

import { create } from 'zustand';
import tmdbService from '../services/tmdb.service';
import i18n from '../i18n';

const useMovieDetailStore = create((set) => ({

  // ═══════════ الحالات (State) ═══════════

  /** بيانات الفيلم الحالي (null = لم يُحمّل بعد) */
  movie: null,

  /** هل جارٍ تحميل تفاصيل الفيلم؟ */
  isLoading: true,

  /** رسالة الخطأ إن فشل التحميل */
  error: '',

  // ═══════════ الأفعال (Actions) ═══════════

  /**
   * جلب تفاصيل فيلم معين بمعرفه (ID).
   *
   * 🧠 المعامل movieId يأتي من React Router عبر useParams().
   *    مثال: إذا فتح المستخدم /movie/550 → movieId = "550"
   *
   * @param {string|number} movieId - معرف الفيلم في TMDB
   */
  fetchMovieDetail: async (movieId) => {
    if (!movieId) return;

    set({ isLoading: true, error: '' });

    try {
      const data = await tmdbService.fetchMovieDetails(movieId);
      set({ movie: data });
    } catch (err) {
      console.error('[MovieDetailStore] fetchMovieDetail failed:', err);
      set({ error: i18n.t('error.fetch_details') });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * إعادة تعيين بيانات التفاصيل (تنظيف عند المغادرة).
   *
   * 🧠 متى نستخدمها؟
   *   عندما يغادر المستخدم صفحة التفاصيل أو ينتقل لفيلم آخر.
   *   هذا يمنع ظهور بيانات الفيلم السابق لمدة ثانية قبل تحميل الجديد.
   */
  resetDetail: () => set({ movie: null, isLoading: true, error: '' }),
}));

export default useMovieDetailStore;
