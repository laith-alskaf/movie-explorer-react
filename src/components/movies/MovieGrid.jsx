/**
 * 📁 src/components/movies/MovieGrid.jsx
 *
 * 🎯 الغرض: مكون لعرض شبكة من بطاقات الأفلام مع إدارة حالات التحميل والخطأ.
 *
 * 🧠 Conditional Rendering (العرض الشرطي) في React:
 *   React يدعم 3 أساليب للعرض الشرطي:
 *
 *   1. الطريقة المباشرة: {condition && <Component />}
 *      → إذا صح الشرط، اعرض المكون
 *
 *   2. Ternary Operator: {condition ? <A /> : <B />}
 *      → إذا صح الشرط اعرض A، وإلا B
 *
 *   3. Early Return: return null (لا تُرندر شيئاً)
 *
 *   نستخدم هنا Ternary المتداخل لمعالجة 3 حالات: تحميل، خطأ، نتائج.
 *
 * @param {Object} props
 * @param {Movie[]} props.movies - قائمة الأفلام
 * @param {boolean} props.isLoading - هل يتم التحميل؟
 * @param {string} props.errorMessage - رسالة الخطأ إن وجدت
 */

import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import ErrorMessage from '../ui/ErrorMessage';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const MovieGrid = ({ movies, isLoading, errorMessage }) => {
  if (isLoading) {
    // عرض 8 هياكل تحميل وهمية (Skeletons) لتحسين شكل التطبيق
    const skeletons = Array.from({ length: 8 }, (_, index) => index);
    
    return (
      <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {skeletons.map((index) => (
          <li key={index}>
            <MovieCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  if (!movies || movies.length === 0) {
    return (
      <p className="text-center text-light-200 py-10">
        لا توجد أفلام للعرض حالياً.
      </p>
    );
  }

  return (
    <motion.ul 
      className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      // Added layout so grid reorganizes smoothly when items are filtered
      layout
    >
      {movies.map((movie) => (
        <motion.li key={movie.id} variants={fadeInUp} layout>
          <MovieCard movie={movie} />
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default MovieGrid;
