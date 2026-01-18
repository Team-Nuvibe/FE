import { motion } from 'framer-motion';
import Xbutton from "@/assets/icons/icon_xbutton.svg?react"
import Xbutton24 from "@/assets/icons/icon_xbutton_24.svg?react"
import Downloadbutton from "@/assets/icons/icon_imagesave.svg?react"

interface ModelItem {
  id: string;
  tag: string;
  thumbnail?: string;
}

interface ImageDetailModalProps {
  item: ModelItem;
  onClose: () => void;
}

export const ImageDetailModal = ({ item, onClose }: ImageDetailModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-black/90 selection:bg-none"
    >
      {/* Background Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt="background blur"
            className="w-full h-full object-cover blur-[50px] opacity-60 scale-110"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 pt-6 pb-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 -ml-2 text-white">
          <Xbutton24 />
        </button>
        <button className="p-2 -mr-2 text-white">
          <Downloadbutton />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 min-h-0">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full h-full max-h-[70vh] flex items-center justify-center"
        >
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.tag}
              className="w-full h-full object-cover rounded-[20px] shadow-2xl max-w-full max-h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-[20px] flex items-center justify-center">
              No Image
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Info */}
      <div className="relative z-10 px-6 pb-12 pt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-gray-300 text-sm font-medium mb-1">Model &gt;</p>
          <div className="flex items-center gap-2">
            <h2 className="text-[28px] font-semibold text-white leading-tight">#{item.tag}</h2>
            {/* Delete Icon placeholder */}
            <button className="text-gray-400 hover:text-white transition-colors">
              <Xbutton />
            </button>
          </div>
          <p className="text-gray-300 text-[12px] mt-2 font-light italic opacity-80">
            2025.11.24 <span className="mx-2">|</span> 09:41
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
