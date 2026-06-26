/**
 * 📁 src/components/movies/WatchProviders.jsx
 *
 * 🎯 الغرض: عرض منصات المشاهدة المتاحة للفيلم/المسلسل (Netflix, Amazon, الخ)
 */

import tmdbService from '../../services/tmdb.service';
import { useTranslation } from 'react-i18next';

const WatchProviders = ({ providersData }) => {
  const { t } = useTranslation();

  if (!providersData || !providersData.results) return null;

  // محاولة جلب مزودي الخدمة في دول معينة كأولوية (السعودية، الإمارات، أمريكا)
  const priorityCountries = ['SA', 'AE', 'EG', 'US'];
  let providers = null;

  for (const country of priorityCountries) {
    if (providersData.results[country]) {
      providers = providersData.results[country];
      break;
    }
  }

  // إذا لم نجد في الدول المفضلة، نجلب أول دولة متاحة
  if (!providers && Object.keys(providersData.results).length > 0) {
    const firstCountry = Object.keys(providersData.results)[0];
    providers = providersData.results[firstCountry];
  }

  // إذا لم يتوفر مزودون على الإطلاق
  if (!providers || (!providers.flatrate && !providers.buy && !providers.rent)) {
    return null;
  }

  // نفضل عرض منصات البث (Streaming/Flatrate) ثم الشراء (Buy)
  const availableOptions = providers.flatrate || providers.buy || providers.rent || [];
  
  // لإزالة التكرار (أحياناً المنصة تتوفر كبث وشراء معاً)
  const uniqueProviders = Array.from(new Map(availableOptions.map(p => [p.provider_id, p])).values());

  if (uniqueProviders.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#AB8BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('features.watch_providers')}
      </h3>
      <div className="flex flex-wrap gap-3">
        {uniqueProviders.map((provider) => (
          <div 
            key={provider.provider_id}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 pr-4 hover:bg-white/10 transition-colors cursor-pointer group"
            title={provider.provider_name}
          >
            <img
              src={tmdbService.getImageUrl(provider.logo_path, 'w92')}
              alt={provider.provider_name}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-sm font-medium text-light-200 group-hover:text-white transition-colors">
              {provider.provider_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchProviders;
