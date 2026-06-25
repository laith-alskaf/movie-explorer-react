import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TypingHeader = () => {
  const { t, i18n } = useTranslation();

  const parts = [
    { text: t('home.title1'), className: '' },
    { text: t('home.title2'), className: 'text-gradient' },
    { text: t('home.title3'), className: '' }
  ];

  // حساب إجمالي عدد الحروف في جميع الأجزاء
  const totalLength = parts.reduce((sum, part) => sum + part.text.length, 0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < totalLength) {
      const interval = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 70); // سرعة الكتابة: 70 مللي ثانية لكل حرف
      return () => clearTimeout(interval);
    }
  }, [currentIndex, totalLength]);

  // Reset typing animation when language changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [i18n.language]);

  // متغير لتتبع عدد الحروف المطبوعة أثناء معالجة الأجزاء
  let charCount = 0;

  return (
    <h1 className="mx-auto max-w-4xl text-center text-5xl font-bold leading-tight tracking-[-1%] text-white sm:text-[64px] sm:leading-[76px]">
      {parts.map((part, index) => {
        const startOfPart = charCount;
        charCount += part.text.length;

        // كم حرفاً يجب إظهاره من هذا الجزء بناءً على المؤشر الحالي؟
        const charsToShow = Math.max(0, Math.min(part.text.length, currentIndex - startOfPart));

        if (charsToShow === 0) return null;

        const visibleText = part.text.slice(0, charsToShow);

        if (part.className) {
          return (
            <span key={index} className={part.className}>
              {visibleText}
            </span>
          );
        }

        return <span key={index}>{visibleText}</span>;
      })}
      {/* مؤشر الكتابة الوامض */}
      <span className="inline-block w-[3px] h-[40px] sm:h-[55px] bg-[#AB8BFF] mx-1 align-middle animate-pulse" />
    </h1>
  );
};

export default TypingHeader;
