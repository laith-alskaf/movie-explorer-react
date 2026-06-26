/**
 * 📁 src/utils/animations.js
 *
 * 🎯 الغرض: توحيد جميع الحركات (Animations) في التطبيق للحفاظ على هوية بصرية متناسقة.
 * يتم استخدام هذه الحركات مع مكتبة Framer Motion.
 */

// حركة الظهور والانزلاق للأعلى (ممتازة للنصوص والبطاقات)
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

// حركة الظهور والانزلاق للأسفل
export const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

// حاوية لتنسيق حركات الأبناء (تجعل العناصر تظهر تباعاً - Staggering)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // التأخير الزمني بين ظهور كل عنصر
      delayChildren: 0.1
    }
  }
};

// حركة الانزلاق الجانبي (للبوسترات والصور)
export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

// حركة الانبثاق (للنوافذ المنبثقة والفلاتر)
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.6, type: "spring", stiffness: 250, damping: 25 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    transition: { duration: 0.3 } 
  }
};

// حركة التمدد العمودي (للقوائم المنسدلة - Accordions)
export const expandHeight = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: { 
    opacity: 1, 
    height: "auto", 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

// حركة الانتقال بين الصفحات (Page Transition)
export const pageTransition = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    filter: "blur(10px)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};
