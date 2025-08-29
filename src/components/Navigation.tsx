import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500
          ${scrolled ?
            'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl border-b border-white/30 dark:border-slate-700/40'
            : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-transparent'}
        `}
        style={{
          boxShadow: scrolled ?
            '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 2px 8px 0 rgba(245, 158, 11, 0.16)' :
            '0 2px 8px 0 rgba(245, 158, 11, 0.08)',
          background: scrolled
            ? 'linear-gradient(90deg, rgba(255, 247, 237, 0.92) 0%, rgba(255, 237, 213, 0.92) 100%)'
            : 'linear-gradient(90deg, rgba(255, 255, 255, 0.70) 0%, rgba(255, 237, 213, 0.50) 100%)',
          backdropFilter: scrolled ? 'blur(28px)' : 'blur(20px)',
          transition: 'all 0.5s cubic-bezier(.4,0,.2,1)',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Animated Gradient Border at Bottom */}
          <div className="absolute left-0 right-0 bottom-0 h-1 pointer-events-none z-50 overflow-hidden">
            <div className="w-full h-full animate-gradient-x"
              style={{
                background: 'linear-gradient(270deg, #f59e0b, #ea580c, #f59e0b, #fbbf24)',
                backgroundSize: '600% 600%',
                filter: 'blur(2.5px)',
                opacity: 0.7,
                transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)',
              }}
            />
          </div>
          <div className="flex justify-between items-center h-16 relative">
            <motion.div
              className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              Farhan Kabir
            </motion.div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-black hover:text-amber-500 transition-colors duration-200 font-semibold tracking-wide px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-none"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-cursor="pointer"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-black bg-white/70 rounded-full shadow hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 shadow-lg"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    data-cursor="pointer"
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;

// Tailwind animation utility (add to your global CSS if not present):
// .animate-gradient-x {
//   animation: gradient-x 4s ease-in-out infinite;
// }
// @keyframes gradient-x {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }