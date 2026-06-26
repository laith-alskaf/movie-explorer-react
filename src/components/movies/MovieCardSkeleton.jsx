/**
 * 📁 src/components/movies/MovieCardSkeleton.jsx
 *
 * 🎯 الغرض: مكون يعرض هيكل تحميل لامع (Skeleton) يطابق شكل بطاقة الفيلم.
 * يظهر أثناء جلب البيانات لتحسين تجربة المستخدم.
 */
const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0f0d23]/30 border border-white/5 overflow-hidden animate-pulse">
      {/* منطقة البوستر (صورة الفيلم) */}
      <div className="relative overflow-hidden aspect-[2/3] bg-white/5" />

      {/* منطقة التفاصيل */}
      <div className="p-4 flex flex-col flex-grow justify-start gap-3 mt-2">
        {/* عنوان الفيلم (هيكل وهمي) */}
        <div className="h-4 bg-white/5 rounded-md w-3/4"></div>
        
        {/* سنة الإصدار واللغة (هيكل وهمي) */}
        <div className="flex items-center gap-2 mt-auto">
          <div className="h-4 bg-white/5 rounded-md w-10"></div>
          <div className="h-4 bg-white/5 rounded-md w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
