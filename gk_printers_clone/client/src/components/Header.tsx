import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Magnetic from './Magnetic';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Dynamic blur/background on scroll
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide navbar on scroll down, show on scroll up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: '-150%', opacity: 0 }
        }}
        animate={hidden && !isOpen ? 'hidden' : 'visible'}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-50 px-4 pt-6 pb-4 flex justify-center pointer-events-none"
      >
        <motion.div 
          animate={{
            backgroundColor: isScrolled ? 'rgba(3, 0, 8, 0.7)' : 'rgba(3, 0, 8, 0.3)',
            backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
            borderColor: isScrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            boxShadow: isScrolled ? '0 10px 40px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.2)'
          }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto h-[60px] md:h-[70px] rounded-full flex items-center justify-center px-6 md:px-3 gap-8 w-max border"
        >
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {navLinks.map((link) => (
              <Magnetic key={link.path} intensity={0.2}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `relative px-6 py-2.5 rounded-full font-poppins font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                      isActive ? 'text-white bg-white/10 shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </Magnetic>
            ))}
          </nav>



          {/* Mobile Toggle */}
          <button 
            className="md:hidden flex items-center gap-4 text-white z-50 relative group px-2 py-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="font-poppins font-bold text-[11px] tracking-[0.2em] uppercase group-hover:text-[#10A7FF] transition-colors">{isOpen ? 'Close' : 'Menu'}</span>
            <div className="flex flex-col justify-center gap-1.5 w-6 h-6 items-end">
              <motion.span animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-6 h-[2px] bg-current transition-transform origin-center"></motion.span>
              <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-4 h-[2px] bg-current transition-opacity"></motion.span>
              <motion.span animate={isOpen ? { rotate: -45, y: -8, width: 24 } : { rotate: 0, y: 0, width: 20 }} className="h-[2px] bg-current transition-all origin-center"></motion.span>
            </div>
          </button>
        </motion.div>
      </motion.header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(30px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#030008]/90 z-40 flex flex-col items-center justify-center"
          >
            {/* Background glowing effects for the overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#605BE5]/20 via-transparent to-transparent pointer-events-none blur-[100px]"></div>

            <div className="flex flex-col items-center gap-8 w-full px-8 relative z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center overflow-hidden"
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => 
                      `font-montserrat font-extrabold text-5xl uppercase tracking-tighter block transition-all duration-300 ${
                        isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#10A7FF]' : 'text-gray-400 hover:text-white hover:tracking-normal'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
