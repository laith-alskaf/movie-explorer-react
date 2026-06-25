import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { toggleLanguage, language } = useLanguage();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center rounded-full bg-white/[0.05] border border-white/10 px-3 py-1.5 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.1] hover:border-white/20 text-white font-medium text-xs sm:text-sm gap-2 shadow-sm cursor-pointer"
    >
      <span>{t('common.switch_lang')}</span>
    </button>
  );
};

export default LanguageSwitcher;
