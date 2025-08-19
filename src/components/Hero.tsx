import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  // Matrix Rain Effect
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    const fontSize = 18;
    let columns = Math.floor(w / fontSize);
    let drops: number[] = Array(columns).fill(1);
    // Use Python or React code snippets as falling text
    const codeSnippets = [
      'def hello_world():',
      '  print("Hello, World!")',
      'for i in range(10):',
      '  print(i)',
      'import React from "react";',
      'const App = () => {',
      '  return <div>Hello React</div>;',
      '}',
      'if __name__ == "__main__":',
      '  hello_world()',
      'function greet() {',
      '  console.log("Hi!");',
      '}',
      'useEffect(() => {',
      '  // ...',
      '}, []);',
    ];

    // Interactive mouse effect
    let mouseX = -1;
    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
    }
    function handleMouseLeave() {
      mouseX = -1;
    }
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Responsive canvas
    function handleResize() {
      w = window.innerWidth;
      h = window.innerHeight;
      if (canvas) {
        canvas.width = w;
        canvas.height = h;
      }
      columns = Math.floor(w / fontSize);
      drops = Array(columns).fill(1);
    }
    window.addEventListener('resize', handleResize);

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(20, 30, 20, 0.15)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        // Pick a random code snippet and a random character from it
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        const char = snippet[Math.floor(Math.random() * snippet.length)];
        // Highlight columns near mouse
        if (mouseX !== -1 && Math.abs(i * fontSize - mouseX) < fontSize * 2) {
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#fff';
          ctx.shadowBlur = 20;
        } else {
          ctx.fillStyle = '#39ff14';
          ctx.shadowColor = '#39ff14';
          ctx.shadowBlur = 10;
        }
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        ctx.shadowBlur = 0;
        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Matrix Rain Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" style={{ zIndex: 1, pointerEvents: 'none' }} />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hi, I'm{' '}
            <motion.span
              className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Farhan Kabir
            </motion.span>
          </motion.h1>
          
          <motion.div
            className="text-xl md:text-2xl text-slate-300 mb-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              key="text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Full Stack Developer & UI/UX Designer
            </motion.span>
          </motion.div>

          <motion.p
            className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            I craft digital experiences that blend beautiful design with powerful functionality. 
            Let's build something amazing together.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full overflow-hidden shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore My Work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.a
              href="https://farhankabir133.github.io/fkhub/Resume_of_FK.pdf"
              download
              className="group flex items-center gap-2 px-8 py-4 border-2 border-amber-400 text-amber-400 font-semibold rounded-full hover:bg-amber-400 hover:text-slate-900 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
              Download Resume
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.button
            onClick={scrollToNext}
            className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;