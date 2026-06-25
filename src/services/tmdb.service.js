/**
 * 📁 src/services/tmdb.service.js
 *
 * 🎯 الغرض: طبقة البيانات (Data Layer) الخاصة بـ TMDB API.
 *   هذا الملف الوحيد المسؤول عن التواصل مع TMDB — لا يوجد fetch() خارج هذا الملف.
 *
 * 🧠 لماذا نفصل الـ API Calls في Service؟ (Dependency Inversion - مبدأ D في SOLID)
 *   ❌ الطريقة القديمة: المكون يعرف كيف يتصل بالـ API (يكتب fetch بنفسه).
 *   ✅ الطريقة الصحيحة: المكون يطلب "أعطني الأفلام" فقط، الـ Service هو مَن يعرف كيف.
 *
 *   إذا قررت لاحقاً استبدال fetch بـ axios أو تغيير الـ API تماماً،
 *   تعدّل هذا الملف فقط، ولا تمس أي مكون أو هوك.
 *
 * 🏗️ بنية الـ Service Object:
 *   نصدّر كائناً (Object) يحتوي على دوال — هذا يسمى "Service Pattern" وشائع جداً في المشاريع الاحترافية.
 */

import { API_BASE_URL, API_OPTIONS, IMAGE_BASE_URL } from '../constants/api.constants';
import i18n from '../i18n';

/**
 * دالة مساعدة داخلية (private) لتنفيذ الطلبات HTTP.
 * نستخدم _ كاتفاقية (Convention) للإشارة إلى أنها مخصصة داخل هذا الملف فقط.
 *
 * @param {string} endpoint - المسار الكامل للـ API
 * @returns {Promise<any>} - البيانات المُرجعة من الـ API
 * @throws {Error} - في حال فشل الطلب
 */
const _fetchFromTMDB = async (endpoint) => {
  const lang = i18n.language || 'en';
  // Use en-US for english and ar-SA for arabic to match TMDB requirements
  const tmdbLang = lang === 'ar' ? 'ar-SA' : 'en-US';
  const url = endpoint.includes('?') ? `${endpoint}&language=${tmdbLang}` : `${endpoint}?language=${tmdbLang}`;
  
  const response = await fetch(url, API_OPTIONS);

  if (!response.ok) {
    // نرمي خطأً واضح الرسالة حتى نعرف ما الذي فشل بالضبط
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * الـ Service Object الرئيسي — يحتوي على جميع الدوال المتعلقة بـ TMDB API.
 *
 * كل دالة هنا = عملية واحدة على الـ API (Single Responsibility).
 */
const tmdbService = {
  /**
   * جلب الأفلام الأكثر شعبية (الصفحة الرئيسية بدون بحث).
   * @param {number|string} [genreId=''] - معرف التصنيف الاختياري للفلترة
   * @param {string} [sortBy='popularity.desc'] - خيار الترتيب المختار
   * @returns {Promise<Movie[]>}
   */
  fetchPopularMovies: async (genreId = '', sortBy = 'popularity.desc') => {
    const genreQuery = genreId ? `&with_genres=${genreId}` : '';
    // لتفادي ظهور أفلام غير معروفة مقيمة 10/10 بتقييم واحد، نضع حداً أدنى للأصوات عند الترتيب بالتقييم
    const voteCountQuery = sortBy.includes('vote_average') ? '&vote_count.gte=300' : '';
    
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/discover/movie?sort_by=${sortBy}${genreQuery}${voteCountQuery}`
    );
    return data.results ?? [];
  },

  /**
   * جلب قائمة التصنيفات الرسمية للأفلام.
   * @returns {Promise<Genre[]>}
   */
  fetchGenres: async () => {
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/genre/movie/list`
    );
    return data.genres ?? [];
  },

  /**
   * البحث عن أفلام بكلمة مفتاحية.
   * encodeURIComponent: تحوّل النص إلى صيغة آمنة للـ URL (مثلاً المسافات تصبح %20)
   * @param {string} query - نص البحث
   * @returns {Promise<Movie[]>}
   */
  searchMovies: async (query) => {
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    );
    return data.results ?? [];
  },

  /**
   * جلب تفاصيل فيلم معين بالـ ID الخاص به.
   * append_to_response: تجلب بيانات إضافية (Cast + Similar) في طلب واحد بدلاً من 3 طلبات.
   * @param {number|string} movieId - معرف الفيلم
   * @returns {Promise<MovieDetail>}
   */
  fetchMovieDetails: async (movieId) => {
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/movie/${movieId}?append_to_response=credits,similar,videos`
    );
    return data;
  },

  /**
   * دالة مساعدة: بناء الـ URL الكامل لصورة الفيلم.
   * @param {string|null} posterPath - مسار الصورة من الـ API
   * @returns {string} - الـ URL الكامل أو مسار صورة بديلة
   */
  getImageUrl: (posterPath) => {
    if (!posterPath) return '/no-movie.png';
    return `${IMAGE_BASE_URL}${posterPath}`;
  },
};

export default tmdbService;
