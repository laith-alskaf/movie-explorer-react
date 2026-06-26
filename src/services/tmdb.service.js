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
   * جلب الأعمال الأكثر شعبية (أفلام أو مسلسلات) مع فلاتر.
   * @param {string} [mediaType='movie']
   * @param {number|string} [genreId='']
   * @param {string} [sortBy='popularity.desc']
   * @param {number} [page=1]
   * @param {string} [filterYear='']
   * @param {number|string} [filterRating=0]
   * @param {string} [filterLanguage='']
   * @returns {Promise<{results: any[], totalPages: number}>}
   */
  fetchPopularMedia: async (mediaType = 'movie', genreId = '', sortBy = 'popularity.desc', page = 1, filterYear = '', filterRating = 0, filterLanguage = '') => {
    const genreQuery = genreId ? `&with_genres=${genreId}` : '';
    // لتفادي ظهور أعمال مقيمة 10/10 بتقييم واحد، نضع حداً أدنى للأصوات عند الترتيب بالتقييم
    const voteCountQuery = (sortBy.includes('vote_average') || filterRating > 0) ? '&vote_count.gte=300' : '';
    const yearQuery = filterYear ? (mediaType === 'movie' ? `&primary_release_year=${filterYear}` : `&first_air_date_year=${filterYear}`) : '';
    const ratingQuery = filterRating > 0 ? `&vote_average.gte=${filterRating}` : '';
    const languageQuery = filterLanguage ? `&with_original_language=${filterLanguage}` : '';
    
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/discover/${mediaType}?sort_by=${sortBy}${genreQuery}${voteCountQuery}${yearQuery}${ratingQuery}${languageQuery}&page=${page}`
    );
    return { results: data.results ?? [], totalPages: data.total_pages };
  },

  /**
   * جلب قائمة التصنيفات الرسمية.
   * @param {string} [mediaType='movie'] - نوع العمل
   * @returns {Promise<Genre[]>}
   */
  fetchGenres: async (mediaType = 'movie') => {
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/genre/${mediaType}/list`
    );
    return data.genres ?? [];
  },

  /**
   * البحث عن أعمال بكلمة مفتاحية.
   * @param {string} query - نص البحث
   * @param {string} [mediaType='movie'] - نوع العمل
   * @param {number} [page=1] - رقم الصفحة
   * @returns {Promise<{results: any[], totalPages: number}>}
   */
  searchMedia: async (query, mediaType = 'movie', page = 1) => {
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/search/${mediaType}?query=${encodeURIComponent(query)}&page=${page}`
    );
    return { results: data.results ?? [], totalPages: data.total_pages };
  },

  /**
   * جلب تفاصيل عمل معين بالـ ID الخاص به.
   * @param {string} mediaType - نوع العمل (movie أو tv)
   * @param {number|string} id - معرف العمل
   * @returns {Promise<any>}
   */
  fetchMediaDetails: async (mediaType, id) => {
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/${mediaType}/${id}?append_to_response=credits,similar,videos,watch/providers,images&include_image_language=en,null`
    );
    return data;
  },

  /**
   * جلب تفاصيل الممثل/الشخص مع أعماله
   * @param {number|string} id - معرف الشخص
   * @returns {Promise<any>}
   */
  fetchPersonDetails: async (id) => {
    const data = await _fetchFromTMDB(
      `${API_BASE_URL}/person/${id}?append_to_response=combined_credits,images`
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
