import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import ThemeToggle from './components/ThemeToggle';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';

function App() {
  useEffect(() => {
    // Always scroll to top (Hero section) on initial load
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);

    // Initialize AdSense
    const initializeAds = () => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };

    // Delay ad initialization to ensure DOM is ready
    const timer = setTimeout(initializeAds, 1000);

  clearTimeout(timer);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <CustomCursor />
      <ThemeToggle />
      <Navigation />
      
      <AnimatePresence>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
          <About />
          <Skills />
          <Portfolio />
          <Testimonials />
          <Blog />
          <Contact />
        </motion.main>
      </AnimatePresence>
      
      <Footer />
      <Chatbot />
      <AdminDashboard />
    </div>
  );
}

export default App;