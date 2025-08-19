import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface ChatbotIconProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnreadMessages?: boolean;
}

// Simple animation data for the AI assistant
const aiAnimationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "AI Assistant",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { 
          a: 1, 
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { t: 60, s: [360] }
          ] 
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [60, 60] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.2, 0.6, 1, 1] },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
};

const ChatbotIcon: React.FC<ChatbotIconProps> = ({
  isOpen,
  onClick,
  hasUnreadMessages = false
}) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.button
        onClick={onClick}
        className={`relative w-16 h-16 rounded-full shadow-lg backdrop-blur-md border border-white/20 overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'bg-red-500/90 hover:bg-red-600/90'
            : 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600/90 hover:to-purple-700/90'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={hasUnreadMessages ? { 
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.7)",
            "0 0 0 10px rgba(59, 130, 246, 0)",
            "0 0 0 0 rgba(59, 130, 246, 0)"
          ]
        } : {}}
        transition={{ duration: 2, repeat: hasUnreadMessages ? Infinity : 0 }}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-30">
          <Lottie
            animationData={aiAnimationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {isOpen ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-0.5 bg-white absolute"></div>
              <div className="w-6 h-0.5 bg-white absolute rotate-90"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7 text-white" />
              <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </motion.div>
          )}
        </div>

        {/* Notification Badge */}
        {hasUnreadMessages && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </motion.div>
        )}

        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
        >
          Ask me anything about Farhan!
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatbotIcon;