import { motion, AnimatePresence } from 'framer-motion';

const ImageModal = ({ isOpen, onClose, imageUrl, altText }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out"
          onClick={onClose}
        >
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="absolute top-6 end-6 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-[#AB8BFF] hover:text-[#030014] hover:border-transparent backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-lg"
            aria-label="Close image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* حاوية الصورة */}
          <motion.img
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            src={imageUrl}
            alt={altText}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_50px_rgba(171,139,255,0.15)] border border-white/10 cursor-default"
            onClick={(e) => e.stopPropagation()} // منع الإغلاق عند النقر على الصورة نفسها
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
