/**
 * 📁 src/components/movies/TrendingMoviesList.jsx
 *
 * 🎯 الغرض: مكون يعرض قائمة الأفلام الأكثر بحثاً (Trending).
 *
 * 🧠 التصميم والمميزات:
 *   - مؤشر جانبي بنفسجي متدرج بجانب العنوان.
 *   - حواف دائرية أنيقة للبوسترات مع رفع وتوهج بنفسجي عند التحويم.
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const TrendingMoviesList = ({ movies }) => {
  const { t } = useTranslation();
  if (!movies || movies.length === 0) return null;

  return (
    <section className="trending mb-16">
      {/* عنوان القسم مع المؤشر البنفسجي */}
      <div className="flex items-center gap-3 mb-10">
        <span className="w-1.5 h-7 rounded-full bg-linear-to-b from-[#D6C7FF] to-[#AB8BFF]" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          {t('home.trending')}
        </h2>
      </div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {movies.map((movie, index) => (
          <motion.li key={movie.$id} variants={fadeInUp} className="relative group">
            {/* الرقم التسلسلي الفاخر */}
            <p className="select-none">{index + 1}</p>

            {/* بوستر الفيلم الشائع */}
            <Link to={`/movie/${movie.movie_id}`} className="block relative">
              <img
                src={movie.poster_url}
                alt={movie.title ?? 'Trending movie'}
                className="w-[127px] h-[163px] rounded-xl object-cover -ml-3.5 border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-[#AB8BFF]/40 group-hover:shadow-[0_8px_20px_rgba(171,139,255,0.2)]"
              />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default TrendingMoviesList;
