/**
 * 📁 src/constants/api.constants.js
 *
 * 🎯 الغرض: تخزين الثوابت (Constants) المتعلقة بـ API في مكان واحد مركزي.
 *
 * 🧠 لماذا نفصل الثوابت؟ (Open/Closed Principle - مبدأ O في SOLID)
 *   - إذا تغير الـ API أو المفتاح، نعدّل في مكان واحد فقط وليس في 10 ملفات.
 *   - أي ملف يحتاج هذه القيم يستوردها (import) من هنا، لا يكتبها من جديد.
 *   - هذا يُقلل من الأخطاء الإملائية (Typos) ويسهّل الصيانة.
 *
 * 📌 ملاحظة: import.meta.env هي طريقة Vite لقراءة متغيرات البيئة من ملف .env.local
 *   المتغيرات التي تبدأ بـ VITE_ فقط هي التي تظهر في الـ Browser (لأمان أكبر).
 */

// عنوان الـ API الأساسي لـ TMDB
export const API_BASE_URL = 'https://api.themoviedb.org/3';

// عنوان الصور في TMDB (يُضاف قبل مسار الصورة)
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// المفتاح السري للـ API (مخزون في .env.local لحمايته)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * خيارات الـ HTTP Request المشتركة لجميع طلبات TMDB.
 * Authorization: Bearer هو نظام مصادقة شائع — يعني "أنا أحمل هذا التوكن كإثبات هوية".
 */
export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};
