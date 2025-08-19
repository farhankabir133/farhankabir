import React from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize AdSense ads
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }, []);

  return (
    <footer className="bg-slate-900 text-white py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Farhan Kabir
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Full Stack Developer & UI/UX Designer passionate about creating 
              exceptional digital experiences that make a difference.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-slate-400 mb-8"
          >
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and lots of coffee</span>
          </motion.div>

          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-2 text-slate-400 mb-8 font-semibold text-lg font-mono"
        >
          <span className="text-center">THIS SITE IS STILL UNDER CONSTRUCTING 💪</span>
          <span className="text-center">After completion of site will be available on👇🏼</span>
          <span className="mt-2 text-center text-xl text-slate-300 font-bold">farhankabir.com</span>
         </motion.div>





          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-slate-800 pt-8"
          >
            <p className="text-slate-400">
              © 2025 Farhan Kabir. All rights reserved.
            </p>
          </motion.div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          data-cursor="pointer"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;