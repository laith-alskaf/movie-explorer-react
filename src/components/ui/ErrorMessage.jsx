/**
 * 📁 src/components/ui/ErrorMessage.jsx
 *
 * 🎯 الغرض: مكون موحّد لعرض رسائل الخطأ في التطبيق.
 *
 * 🧠 لماذا مكون منفصل للخطأ؟ (Don't Repeat Yourself - DRY)
 *   بدلاً من كتابة <p className="text-red-500">...</p> في كل مكان،
 *   نكتبها مرة واحدة هنا ونُعيد استخدام المكون في أي مكان.
 *   إذا أردت تغيير لون الخطأ أو حجمه، تُعدّل هذا الملف فقط.
 *
 * 🧠 مبدأ Interface Segregation (مبدأ I في SOLID):
 *   المكون يقبل فقط ما يحتاجه: نص الرسالة (message).
 *   لا يتدخل في أي شيء آخر.
 *
 * @param {Object} props
 * @param {string} props.message - رسالة الخطأ المُراد عرضها
 */

const ErrorMessage = ({ message }) => {
  // إذا لا توجد رسالة، لا تُرندر المكون أصلاً
  if (!message) return null;

  return (
    <div
      role="alert" // لإمكانية الوصول (Accessibility) — يُخبر قارئات الشاشة أن هذا تنبيه
      className="w-full text-center py-4 px-6 rounded-lg bg-red-500/10 border border-red-500/30"
    >
      <p className="text-red-400 font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;
