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
   * نوع العمل الفني: 'movie' للأفلام، 'tv' للمسلسلات.
   */
  mediaType: 'movie',

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
   * فلاتر متقدمة إضافية (Advanced Filters)
   */
  filterYear: '',
  filterRating: 0,
  filterLanguage: '',

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
   * الصفحة الحالية للتمرير اللانهائي.
   */
  page: 1,

  /**
   * هل يوجد صفحات أخرى للتحميل؟
   */
  hasMore: true,

  /**
   * هل يتم تحميل صفحة إضافية حالياً؟
   */
  isLoadingMore: false,

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
  setSearchTerm: (term) => set({ searchTerm: term, page: 1, hasMore: true }),

  /**
   * تحديث التصنيف المختار.
   * 🧠 عند اختيار تصنيف جديد، نمسح نص البحث تلقائياً
   *    حتى لا يتعارض البحث النصي مع الفلترة بالتصنيف.
   */
  setSelectedGenreId: (genreId) => set({
    selectedGenreId: genreId,
    searchTerm: '',  // مسح البحث عند تغيير التصنيف
    page: 1,
    hasMore: true
  }),

  /**
   * تحديث الفلاتر المتقدمة
   */
  setFilters: (filters) => set((state) => ({
    ...filters,
    page: 1,
    hasMore: true
  })),

  /**
   * تحديث نوع العمل (أفلام/مسلسلات).
   * يمسح البحث والتصنيفات ويعود للصفحة الأولى لضمان التبديل النظيف.
   */
  setMediaType: (type) => set({
    mediaType: type,
    searchTerm: '',
    selectedGenreId: '',
    filterYear: '',
    filterRating: 0,
    filterLanguage: '',
    sortBy: 'popularity.desc',
    page: 1,
    hasMore: true,
    movies: []
  }),

  /**
   * تحديث خيار الترتيب (شعبية، تقييم، أحدث).
   */
  setSortBy: (sort) => set({ sortBy: sort, page: 1, hasMore: true }),

  /**
   * جلب قائمة التصنيفات الرسمية من TMDB API بناءً على نوع العمل.
   * تُستدعى عند تحميل الصفحة الرئيسية أو عند تغيير نوع العمل.
   */
  fetchGenres: async () => {
    const { mediaType } = get();
    try {
      const data = await tmdbService.fetchGenres(mediaType);
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
    const { searchTerm, selectedGenreId, sortBy, page, mediaType, filterYear, filterRating, filterLanguage } = get();

    // 2. نبدأ التحميل ونمسح أي أخطاء سابقة
    if (page === 1) {
      set({ isLoading: true, errorMessage: '' });
    } else {
      set({ isLoadingMore: true });
    }

    try {
      // 3. نحدد نوع الطلب: بحث نصي أم تصفح عام
      const data = searchTerm
        ? await tmdbService.searchMedia(searchTerm, mediaType, page)
        : await tmdbService.fetchPopularMedia(mediaType, selectedGenreId, sortBy, page, filterYear, filterRating, filterLanguage);

      // 4. نحفظ النتائج في المتجر
      set((state) => ({ 
        movies: page === 1 ? data.results : [...state.movies, ...data.results],
        hasMore: page < data.totalPages
      }));

      // 5. تحديث إحصائيات البحث في Appwrite (فقط عند البحث النصي والصفحة الأولى)
      if (searchTerm && data.results.length > 0 && page === 1) {
        await updateSearchCount(searchTerm, data.results[0]);
      }
    } catch (error) {
      console.error('[MovieStore] fetchMovies failed:', error);
      set({
        errorMessage: page === 1 ? i18n.t('error.fetch_movies') : '',
      });
    } finally {
      // 6. ننهي التحميل دائماً (سواء نجح أو فشل)
      set({ isLoading: false, isLoadingMore: false });
    }
  },

  /**
   * تحميل الصفحة التالية للتمرير اللانهائي.
   */
  loadMoreMovies: () => {
    const { hasMore, isLoading, isLoadingMore, page, fetchMovies } = get();
    if (hasMore && !isLoading && !isLoadingMore) {
      set({ page: page + 1 });
      fetchMovies();
    }
  },
}));

export default useMovieStore;
