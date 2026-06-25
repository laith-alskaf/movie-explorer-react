/**
 * 📁 src/services/appwrite.service.js
 *
 * 🎯 الغرض: طبقة البيانات الخاصة بـ Appwrite (قاعدة البيانات السحابية).
 *   يُحفظ هنا كل تعامل مع Appwrite: القراءة، الكتابة، التحديث.
 *
 * 🧠 لماذا أُنقل من appwrite.js إلى services/appwrite.service.js؟
 *   - التسمية الجديدة (appwrite.service.js) توضح أن هذا الملف هو "Service" = طبقة خدمات.
 *   - مجلد services/ يجمع كل مصادر البيانات الخارجية في مكان واحد.
 *   - إذا أردت استبدال Appwrite بـ Firebase مستقبلاً، تعدّل هذا الملف فقط.
 *
 * 📌 Appwrite SDK المستخدمة:
 *   - Client: الاتصال بالسيرفر
 *   - Databases: للتعامل مع قاعدة البيانات
 *   - ID: لتوليد معرفات فريدة للمستندات
 *   - Query: لبناء استعلامات البحث والترتيب
 */

import { Client, Databases, ID, Query } from 'appwrite';

// معرفات المشروع وقاعدة البيانات — محفوظة في .env.local لحمايتها
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// إنشاء اتصال واحد بـ Appwrite يُعاد استخدامه (Singleton Pattern)
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

/**
 * تحديث عداد عمليات البحث في قاعدة البيانات.
 *
 * المنطق:
 *   1. ابحث هل الكلمة موجودة مسبقاً في الـ DB؟
 *   2. إذا نعم → زد العداد بمقدار 1
 *   3. إذا لا  → أنشئ مستنداً جديداً بعداد = 1
 *
 * @param {string} searchTerm - الكلمة التي بحث عنها المستخدم
 * @param {Movie} movie - الفيلم الأول في نتائج البحث (لحفظ بياناته)
 */
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

    if (result.documents.length > 0) {
      // المستند موجود → حدّث العداد
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      // المستند غير موجود → أنشئ جديداً
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    // نطبع الخطأ فقط — لا نوقف التطبيق بسبب خطأ في الإحصائيات
    console.error('[AppwriteService] updateSearchCount failed:', error);
  }
};

/**
 * جلب أكثر 5 أفلام بحثاً من قاعدة البيانات (Trending).
 *
 * Query.orderDesc("count") → ترتيب تنازلي حسب العداد
 * Query.limit(5) → أول 5 نتائج فقط
 *
 * @returns {Promise<TrendingMovie[]>} - قائمة الأفلام الأكثر بحثاً
 */
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc('count'),
    ]);
    return result.documents;
  } catch (error) {
    console.error('[AppwriteService] getTrendingMovies failed:', error);
    return [];
  }
};
