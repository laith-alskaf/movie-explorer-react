/**
 * 📁 src/App.jsx
 *
 * 🎯 الغرض: تعريف مسارات التطبيق (Routes) فقط.
 *
 * 🧠 هذا هو التحول الجوهري في إعادة الهيكلة:
 *   قبل: App.jsx كان 136 سطر يفعل كل شيء
 *   بعد: App.jsx هو ~30 سطر يُعرّف المسارات فقط
 *
 * 🧠 React Router DOM v6 - المفاهيم الأساسية:
 *
 *   <Routes>: الحاوية الرئيسية لجميع المسارات.
 *     تفحص الـ URL الحالي وتُرندر الـ Route المطابق فقط.
 *
 *   <Route path="/" element={<HomePage />}>:
 *     path → الرابط المطابق
 *     element → المكون المُرندَر عند مطابقة الرابط
 *
 *   <Route path="/movie/:id">:
 *     :id → Dynamic Parameter (معامل ديناميكي)
 *     أي رابط بالشكل /movie/أي-شيء سيُطابق هذا الـ Route
 *     ويمكن قراءة القيمة داخل المكون عبر useParams()
 *
 *   <Route path="*">:
 *     يُطابق أي رابط غير موجود (404 Not Found)
 *     * تعني "أي شيء آخر لم يُطابَق"
 *
 * 🧠 Lazy Loading (مفهوم متقدم - مذكور للتعلم):
 *   يمكن تحميل الصفحات بشكل كسول (عند الحاجة فقط):
 *   const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'))
 *   هذا يُقسّم الكود (Code Splitting) ويُسرّع التحميل الأول.
 */

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';

const App = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col text-white">
      {/* شريط التنقل العلوي المشترك */}
      <Navbar />

      {/* مساحة عرض المحتوى الديناميكي للصفحات */}
      <div className="flex-grow">
        <Routes>
          {/* الصفحة الرئيسية */}
          <Route path="/" element={<HomePage />} />

          {/* صفحة تفاصيل الفيلم — :id يُستبدل بمعرف الفيلم الفعلي */}
          <Route path="/movie/:id" element={<MovieDetailPage />} />

          {/* صفحة 404 — لأي مسار غير معرّف */}
          <Route
            path="*"
            element={
              <div className="h-[60vh] flex flex-col items-center justify-center text-white gap-4">
                <h1 className="text-6xl font-bold text-[#AB8BFF]">404</h1>
                <p className="text-light-200">الصفحة غير موجودة</p>
                <a href="/" className="px-6 py-2 bg-[#AB8BFF] rounded-lg font-semibold hover:bg-[#9775e8] transition-colors">
                  العودة للرئيسية
                </a>
              </div>
            }
          />
        </Routes>
      </div>

      {/* التذييل السفلي وبطاقة المطور المشتركة */}
      <Footer />
    </div>
  );
};

export default App;
