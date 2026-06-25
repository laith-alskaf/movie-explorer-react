/**
 * 📁 src/store/useMovieStore.js
 *
 * 🎯 الغرض: المتجر المركزي الرئيسي للأفلام (Movie Store).
 *   يجمع كل الحالات والأفعال المتعلقة بـ: البحث، الفلترة، الفرز، وجلب الأفلام.
 *
 * 🧠 ما هو المتجر (Store)؟
 *   فكّر فيه كـ "قاعدة بيانات مصغّرة" داخل المتصفح.
 *   بدلاً من أن تكون البيانات مبعثرة في useState في كل مكون،
 *   نجمعها هنا في مكان واحد — وأي مكون يحتاجها يقرأ منها مباشرة.
 *
 * 🧠 كيف يعمل create()؟
 *   - create() تأخذ دالة تستقبل معاملين: set و get
 *   - set: لتحديث الحالة (تدمج القيم الجديدة مع القيمة القديمة تلقائياً)
 *   - get: لقراءة الحالة الحالية داخل الـ Action
 *   - الدالة تُرجع كائناً يحتوي على: الحالات (بيانات) + الأفعال (دوال)
 *
 * 🧠 لماذا نستخدم get() داخل fetchMovies؟
 *   لأننا نحتاج قراءة القيم الحالية لـ searchTerm و selectedGenreId و sortBy
 *   في لحظة تنفيذ الطلب — وليس قيمة قديمة محفوظة في closure.
 *
 * 📌 المبادئ المطبقة:
 *   - Single Responsibility: هذا المتجر مسؤول فقط عن الأفلام والبحث
 *   - Separation of Concerns: المتجر يستدعي الـ Service، لا يكتب fetch بنفسه
 */

import { create } from 'zustand';
import tmdbService from '../services/tmdb.service';
import { updateSearchCount } from '../services/appwrite.service';
import i18n from '../i18n';

const useMovieStore = create((set, get) => ({

  // ═══════════════════════════════════════════════════════════
  //                    الحالات (State)
  // ═══════════════════════════════════════════════════════════

  /**
   * نص البحث الذي يكتبه المستخدم في صندوق البحث.
   * يتغير فوراً مع كل حرف يكتبه المستخدم.
   */
  searchTerm: '',

  /**
   * معرف التصنيف المختار حالياً (مثال: 28 = أكشن، 35 = كوميدي).
   * '' تعني "الكل" — لا يوجد فلتر نشط.
   */
  selectedGenreId: '',

  /**
   * خيار الترتيب المختار للأفلام.
   * القيم المتاحة: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc'
   */
  sortBy: 'popularity.desc',

  /**
   * قائمة الأفلام الحالية المعروضة في الشبكة.
   * تتغير عند: البحث، تغيير التصنيف، تغيير الترتيب.
   */
  movies: [],

  /**
   * قائمة التصنيفات الرسمية المجلوبة من TMDB API.
   * تُجلب مرة واحدة عند تحميل التطبيق ولا تتغير بعدها.
   */
  genres: [],

  /**
   * هل التطبيق يحمّل بيانات الأفلام حالياً؟
   * true = جارٍ التحميل، false = انتهى التحميل
   */
  isLoading: false,

  /**
   * رسالة الخطأ إن وُجد خلل في جلب البيانات.
   * '' تعني لا يوجد خطأ.
   */
  errorMessage: '',


  // ═══════════════════════════════════════════════════════════
  //                    الأفعال (Actions)
  // ═══════════════════════════════════════════════════════════

  /**
   * تحديث نص البحث.
   * 🧠 لاحظ: set({ searchTerm: term }) تُحدّث فقط searchTerm
   *    وتترك باقي الحالات كما هي — هذا الدمج التلقائي (Auto Merge) ميزة من Zustand.
   */
  setSearchTerm: (term) => set({ searchTerm: term }),

  /**
   * تحديث التصنيف المختار.
   * 🧠 عند اختيار تصنيف جديد، نمسح نص البحث تلقائياً
   *    حتى لا يتعارض البحث النصي مع الفلترة بالتصنيف.
   */
  setSelectedGenreId: (genreId) => set({
    selectedGenreId: genreId,
    searchTerm: '',  // مسح البحث عند تغيير التصنيف
  }),

  /**
   * تحديث خيار الترتيب (شعبية، تقييم، أحدث).
   */
  setSortBy: (sort) => set({ sortBy: sort }),

  /**
   * جلب قائمة التصنيفات الرسمية من TMDB API.
   * تُستدعى مرة واحدة عند تحميل الصفحة الرئيسية.
   *
   * 🧠 لماذا async؟
   *   لأنها تتصل بالإنترنت (API Call) — والنتيجة لا تأتي فوراً.
   *   await تجعل الكود ينتظر حتى تصل البيانات قبل تحديث الحالة.
   */
  fetchGenres: async () => {
    try {
      const data = await tmdbService.fetchGenres();
      set({ genres: data });
    } catch (err) {
      console.error('[MovieStore] Error loading genres:', err);
    }
  },

  /**
   * جلب الأفلام بناءً على الحالة الحالية (بحث أو فلترة أو فرز).
   *
   * 🧠 كيف يعمل get()؟
   *   get() يقرأ الحالة الحالية في لحظة الاستدعاء.
   *   هذا يضمن أننا نستخدم أحدث قيم للبحث والتصنيف والترتيب.
   *
   * 🧠 المنطق:
   *   - إذا كان هناك نص بحث → نستخدم searchMovies
   *   - إذا لم يكن هناك بحث → نستخدم fetchPopularMovies مع الفلترة والترتيب
   */
  fetchMovies: async () => {
    // 1. نقرأ الحالة الحالية
    const { searchTerm, selectedGenreId, sortBy } = get();

    // 2. نبدأ التحميل ونمسح أي أخطاء سابقة
    set({ isLoading: true, errorMessage: '' });

    try {
      // 3. نحدد نوع الطلب: بحث نصي أم تصفح عام
      const results = searchTerm
        ? await tmdbService.searchMovies(searchTerm)
        : await tmdbService.fetchPopularMovies(selectedGenreId, sortBy);

      // 4. نحفظ النتائج في المتجر
      set({ movies: results });

      // 5. تحديث إحصائيات البحث في Appwrite (فقط عند البحث النصي)
      if (searchTerm && results.length > 0) {
        await updateSearchCount(searchTerm, results[0]);
      }
    } catch (error) {
      console.error('[MovieStore] fetchMovies failed:', error);
      set({
        errorMessage: i18n.t('error.fetch_movies'),
        movies: [],
      });
    } finally {
      // 6. ننهي التحميل دائماً (سواء نجح أو فشل)
      set({ isLoading: false });
    }
  },
}));

export default useMovieStore;
