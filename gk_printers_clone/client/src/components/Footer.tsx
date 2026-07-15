import { Link } from 'react-router-dom';
import { ArrowUp, Phone } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020000] text-white pt-[100px] pb-[40px] relative overflow-hidden border-t border-white/5">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[#605BE5]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Company Info */}
          <div className="flex flex-col lg:max-w-xs">
            <Magnetic intensity={0.2}>
              <Link to="/" className="inline-block flex items-center gap-3">
                <span className="font-montserrat font-bold text-xl text-white tracking-wide">GK Printers</span>
              </Link>
            </Magnetic>
            
            <p className="font-poppins text-gray-400 mt-6 mb-8 text-[15px] leading-relaxed">
              Professional printing solutions for businesses. High-quality digital, offset, and large format prints delivered fast. We turn big ideas into powerful visual experiences that drive real growth.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { Icon: FaTwitter, link: '#' },
                { Icon: FaLinkedinIn, link: '#' },
                { Icon: FaFacebook, link: '#' },
                { Icon: FaInstagram, link: '#' },
                { Icon: FaWhatsapp, link: '#' },
                { Icon: FaYoutube, link: '#' }
              ].map((item, idx) => (
                <Magnetic key={idx} intensity={0.5}>
                  <a href={item.link} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all duration-300 group">
                    <item.Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col">
            <h3 className="font-montserrat font-bold text-white text-[18px] mb-6 tracking-wide">Services</h3>
            <nav className="flex flex-col gap-4">
              {[
                'Digital Printing', 
                'Offset Printing', 
                'Business Cards', 
                'Brochures & Flyers', 
                'Large Format Printing',
                'Packaging Solutions'
              ].map((name, idx) => (
                <Link 
                  key={idx}
                  to="/services" 
                  className="font-poppins text-[15px] text-gray-400 hover:text-white transition-colors relative group w-max"
                >
                  {name}
                  <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-white/50 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Column 3: Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-montserrat font-bold text-white text-[18px] mb-6 tracking-wide">Pages</h3>
            <nav className="flex flex-col gap-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Portfolio', path: '/#portfolio' },
                { name: 'Our Process', path: '/about#process' },
                { name: 'Testimonials', path: '/#testimonials' }
              ].map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.path} 
                  className="font-poppins text-[15px] text-gray-400 hover:text-white transition-colors relative group w-max"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-white/50 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="flex flex-col">
             <h3 className="font-montserrat font-bold text-white text-[18px] mb-6 tracking-wide">Get in Touch</h3>
             <nav className="flex flex-col gap-4">
              {[
                { name: 'Contact Us', path: '/contact' },
                { name: 'Support', path: '/contact' },
                { name: 'Get a Quote', path: '/contact' },
                { name: 'Request Callback', path: '/contact' },
                { name: 'Privacy Policy', path: '#' },
                { name: 'Terms of Service', path: '#' }
              ].map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.path} 
                  className="font-poppins text-[15px] text-gray-400 hover:text-white transition-colors relative group w-max"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-white/50 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="w-full h-px bg-white/10 mt-8 mb-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-poppins text-[14px] text-gray-500">
          <p>© {new Date().getFullYear()} <span className="font-semibold text-white">GK Printers</span>. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors relative group">
              Privacy Policy
              <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-white/50 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
            <Link to="#" className="hover:text-white transition-colors relative group">
              Terms & Conditions
              <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-white/50 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
            <Link to="#" className="hover:text-white transition-colors relative group">
              Sitemap
              <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-white/50 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-[30px] right-[30px] flex flex-col gap-4 z-50">
        <Magnetic intensity={0.8}>
          <a href="tel:15551234567" className="w-[50px] h-[50px] bg-gradient-to-tr from-[#FFC527] to-[#f17a3a] rounded-full shadow-[0_0_20px_rgba(255,197,39,0.4)] flex items-center justify-center text-black hover:scale-110 transition-transform duration-300 relative group">
            <Phone className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 rounded-full border-2 border-white/50 scale-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 ease-out"></div>
          </a>
        </Magnetic>

        <AnimatePresence>
          {showScroll && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Magnetic intensity={0.8}>
                <button
                  onClick={scrollToTop}
                  className="w-[50px] h-[50px] glass-dark rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </Magnetic>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
