/**
 * 📁 src/main.jsx
 *
 * 🎯 الغرض: نقطة دخول التطبيق (Entry Point).
 *   هذا الملف يُشغّل كل شيء — هو أول ما ينفّذه المتصفح.
 *
 * 🧠 BrowserRouter — ما هو ولماذا هنا تحديداً؟
 *
 *   BrowserRouter هو "مزوّد السياق" (Context Provider) لنظام التوجيه.
 *   يُغلّف التطبيق كله ليوفّر لكل المكونات الوصول لمعلومات الـ URL الحالي.
 *
 *   لماذا في main.jsx وليس في App.jsx؟
 *   لأنه يجب أن يكون الـ Root الحقيقي — أعلى شيء في الشجرة.
 *   إذا وضعته داخل App.jsx، قد تواجه مشاكل مع الـ Routes.
 *
 * 🧠 StrictMode:
 *   React.StrictMode يُشغّل كل component مرتين في بيئة التطوير فقط.
 *   لماذا؟ للكشف عن أخطاء شائعة مثل التأثيرات الجانبية غير النظيفة.
 *   في بيئة الإنتاج (npm run build) يعمل كل شيء مرة واحدة فقط.
 *
 * 🧠 createRoot (React 18):
 *   الطريقة الحديثة لتشغيل React — تدعم الـ Concurrent Features.
 *   قبلها كانت: ReactDOM.render() (قديمة ومهجورة)
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './i18n'; // Initialize i18n
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      BrowserRouter يُغلّف التطبيق كله.
      يستخدم HTML5 History API للتنقل بين الصفحات بدون إعادة تحميل.
    */}
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
