import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



const WordReveal = React.memo(({ children, delay = 0 }: { children: string, delay?: number }) => {
  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
});

const Home = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    // Wrap animations in gsap.context for easy cleanup
    const ctx = gsap.context(() => {
      // GSAP ScrollTrigger for Parallax Images
      const parallaxImages = document.querySelectorAll('.parallax-img');
      parallaxImages.forEach((img) => {
        gsap.to(img, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }, 
        });
      });

      // Animate sections
      const sections = document.querySelectorAll('.gsap-section');
      sections.forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 100 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            }
          }
        );
      });
    }, containerRef);
    
    return () => ctx.revert(); // Cleanup on unmount
  }, []);
  const galleryImages = [
    '/assets/premium_photo-1682145481505-80614272c426.avif',
    '/assets/premium_photo-1682145497679-e9340895df09.avif',
    '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif',
    '/assets/premium_photo-1682145481505-80614272c426.avif',
    '/assets/premium_photo-1682145497679-e9340895df09.avif',
    '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif',
    '/assets/premium_photo-1682145481505-80614272c426.avif',
    '/assets/premium_photo-1682145497679-e9340895df09.avif',
  ];

  return (
    <div className="w-full bg-[#030008] min-h-screen text-white overflow-hidden relative" ref={containerRef}>
      
      {/* Premium CSS Gradient Background (Lightweight) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#10A7FF]/10 via-[#030008] to-[#030008]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#605BE5]/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#FFC527]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="min-h-screen pt-[120px] pb-20 px-4 md:px-8 flex items-center justify-center relative"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
            <div className="flex-1 space-y-8 z-20">
              <div className="overflow-hidden">
                <motion.h2 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-xs md:text-sm font-montserrat font-bold tracking-[0.3em] uppercase text-[#10A7FF] mb-2"
                >
                  Premium Quality Printing Services
                </motion.h2>
              </div>
              <h3 className="text-6xl md:text-8xl lg:text-[110px] font-montserrat font-extrabold leading-[0.95] tracking-tighter">
                <WordReveal delay={0.4}>Premium</WordReveal>{' '}
                <WordReveal delay={0.5}>Printing</WordReveal>{' '}
                <WordReveal delay={0.6}>Services</WordReveal>{' '}
                <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] via-[#f17a3a] to-[#605BE5] animate-gradient-x pb-4">
                  <WordReveal delay={0.7}>For</WordReveal>{' '}
                  <WordReveal delay={0.8}>Your</WordReveal>{' '}
                  <WordReveal delay={0.9}>Brand.</WordReveal>
                </span>
              </h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="font-poppins text-lg md:text-xl text-gray-400 max-w-2xl leading-[1.8] font-light"
              >
                We provide high-quality digital, offset, and commercial printing services to help your brand stand out. From business cards to large banners, we print it all.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
                className="flex items-center gap-6"
              >
                <Magnetic intensity={0.4}>
                  <Link to="/contact" className="group relative overflow-hidden inline-flex items-center gap-3 bg-white text-black py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold">
                    <span className="relative z-10 transition-colors group-hover:text-white">Get a Free Quote</span>
                    <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-2 group-hover:text-white" />
                    <div className="absolute inset-0 bg-[#605BE5] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                  </Link>
                </Magnetic>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#605BE5]/20 to-transparent rounded-full blur-[80px] mix-blend-screen animate-pulse"></div>
              
              {/* Floating elements effect */}
              <motion.div
                animate={{ y: [-15, 15, -15], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="relative z-10 w-full max-w-lg"
              >
                <div className="glass p-4 rounded-3xl relative h-full flex flex-col">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFC527] to-[#10A7FF] rounded-3xl blur opacity-30"></div>
                  <div className="relative z-10 w-full h-full min-h-[300px] rounded-2xl overflow-hidden">
                    <img src="/assets/premium_photo-1682145497679-e9340895df09.avif" alt="Print Boxes" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  </div>
                  
                  {/* Glass floating badges */}
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1, ease: 'easeInOut' }}
                    className="absolute -right-10 top-20 glass-card px-6 py-4 rounded-2xl flex items-center gap-3 z-20"
                  >
                    <Star className="text-[#FFC527] fill-[#FFC527]" />
                    <span className="font-montserrat font-bold text-sm">Premium Quality</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Services Grid Section */}
        <section className="py-32 px-4 md:px-8 relative z-10 bg-[#050505]">
          <div className="container mx-auto">
            <div className="text-center mb-20 gsap-section">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#605BE5] to-[#10A7FF] font-montserrat font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm">Our Printing Services</h2>
              <h3 className="text-5xl md:text-7xl font-montserrat font-extrabold tracking-tighter text-white mb-6">Expertise in Every Print</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { img: '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif', title: 'Digital Printing', desc: 'High-speed, high-quality digital printing for business cards, flyers, and short-run projects.' },
                { img: '/assets/premium_photo-1682145481505-80614272c426.avif', title: 'Offset Printing', desc: 'Cost-effective and premium quality offset printing for bulk orders like catalogs and brochures.' },
                { img: '/assets/premium_photo-1682145497679-e9340895df09.avif', title: 'Large Format Printing', desc: 'Vibrant, durable flex banners, vinyl prints, and posters that command attention anywhere.' },
                { img: '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif', title: 'Packaging Solutions', desc: 'Custom printed boxes, product packaging, and cartons that elevate your brand presentation.' },
                { img: '/assets/premium_photo-1682145481505-80614272c426.avif', title: 'Label & Sticker Printing', desc: 'Precision die-cut labels and stickers for products, packaging, and promotional needs.' },
                { img: '/assets/premium_photo-1682145497679-e9340895df09.avif', title: 'Corporate Branding', desc: 'Professional letterheads, envelopes, ID cards, and custom merchandise to unify your brand.' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass-dark p-8 rounded-3xl flex flex-col items-start gap-6 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#10A7FF]/50 transition-colors duration-500 overflow-hidden shrink-0">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-montserrat font-semibold text-2xl text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#10A7FF] transition-all duration-300">{item.title}</h3>
                    <p className="font-poppins text-[15px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reliable Info Section */}
        <section className="py-32 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#605BE5]/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 w-full relative gsap-section">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] group">
                <div className="absolute inset-0 bg-[#FFC527]/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
                <img src="/assets/premium_photo-1682145481505-80614272c426.avif" alt="Quality Printing" className="w-full h-full object-cover parallax-img scale-125 origin-center" loading="lazy" />
              </div>
              
              {/* Decorative elements */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -right-10 w-40 h-40 border border-white/20 rounded-full border-dashed"
              ></motion.div>
            </div>
            
            <div className="flex-1 space-y-8 gsap-section">
              <div className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="text-[#FFC527] font-montserrat font-bold tracking-[0.2em] uppercase text-xs">🟧 WHY CHOOSE US</span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-extrabold text-white leading-tight tracking-tighter">
                Reliable Printing Solutions for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10A7FF] to-[#605BE5]">Your Business</span>
              </h2>
              <p className="font-poppins text-lg text-gray-400 leading-[1.8] font-light max-w-xl">
                Whether you're a startup, retail store, or corporate enterprise — we deliver <strong className="text-white font-medium">precision-driven print solutions</strong> that elevate your packaging, marketing materials, and brand identity.
              </p>
              
              <ul className="space-y-5 pt-4">
                {[
                  'Premium Print Quality with Modern Printing Machines',
                  'Affordable Pricing & Bulk Printing Solutions',
                  'Fast Turnaround Time & Nationwide Delivery',
                  'Expert Custom Design Support for Your Projects'
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-[#10A7FF]/20 flex items-center justify-center shrink-0 group-hover:bg-[#10A7FF] transition-colors duration-300">
                      <CheckCircle className="text-[#10A7FF] group-hover:text-white w-4 h-4 transition-colors duration-300" />
                    </div>
                    <span className="font-poppins text-gray-300 font-medium group-hover:text-white transition-colors duration-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="pt-8">
                <Magnetic intensity={0.3}>
                  <Link to="/contact" className="group relative overflow-hidden inline-flex items-center gap-3 bg-white/10 border border-white/20 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-xs hover:border-[#FFC527]">
                    <span className="relative z-10 transition-colors group-hover:text-black">Start Your Project</span>
                    <div className="absolute inset-0 bg-[#FFC527] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>

        {/* Printing Services Flip Boxes Section */}
        <section className="py-32 px-4 md:px-8 bg-[#050505] relative z-10">
          <div className="container mx-auto">
            <div className="text-center mb-20 gsap-section">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#605BE5] to-[#10A7FF] font-montserrat font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm">Our Products</h2>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-extrabold text-white mb-6 tracking-tighter">Everything You Need Printed</h3>
              <p className="font-poppins text-gray-400 max-w-3xl mx-auto text-lg leading-[1.8] font-light">
                Crafted to <strong className="text-white font-medium">deliver clarity, impact, and brand value</strong> with stunning finishes that make a lasting impression.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
              {[
                { title: 'Business Cards', desc: 'Leave a lasting impression with premium, thick, and custom-finished business cards.', img: '/assets/premium_photo-1682145481505-80614272c426.avif' },
                { title: 'Flyers & Brochures', desc: 'Vibrant and professional marketing materials to promote your business effectively.', img: '/assets/premium_photo-1682145497679-e9340895df09.avif' },
                { title: 'Custom Packaging', desc: 'Tailored boxes and packaging solutions designed to protect and present your products.', img: '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif' },
                { title: 'Banners & Signage', desc: 'Large format flex and vinyl prints for events, storefronts, and outdoor advertising.', img: '/assets/premium_photo-1682145481505-80614272c426.avif' },
                { title: 'Labels & Stickers', desc: 'Custom die-cut labels and stickers for branding, packaging, and promotional use.', img: '/assets/premium_photo-1682145497679-e9340895df09.avif' },
                { title: 'Corporate Stationery', desc: 'Professional letterheads, envelopes, and notebooks tailored for your corporate identity.', img: '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif' }
              ].map((box, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="group h-[300px] relative w-full rounded-3xl cursor-pointer"
                >
                  <div className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-2xl">
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full backface-hidden glass-dark rounded-3xl flex flex-col items-center justify-center p-8 text-center border border-white/10 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                      <div className="w-24 h-24 mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                        <img src={box.img} alt={box.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <h3 className="font-montserrat font-semibold text-2xl text-white relative z-10">{box.title}</h3>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-[#605BE5] to-[#403ba0] text-white rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-[0_0_40px_rgba(96,91,229,0.4)] border border-white/20">
                      <h3 className="font-montserrat font-bold text-2xl mb-4">{box.title}</h3>
                      <p className="font-poppins text-[15px] leading-relaxed opacity-90">{box.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video/Banner Section with heavy Parallax */}
        <section className="relative py-40 overflow-hidden flex items-center justify-center text-center gsap-section">
          <div className="absolute inset-0 w-full h-full z-0">
             <div className="absolute inset-0 bg-black/60 z-10"></div>
             {/* Replace with actual video or keep parallax image */}
             <div className="w-full h-full parallax-img scale-125 origin-center bg-[url('/assets/premium_photo-1682147382418-ddf8c3e1310e.avif')] bg-cover bg-center"></div>
          </div>
          
          <div className="relative z-20 container mx-auto px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-block mb-6 px-6 py-2 border border-white/20 rounded-full glass"
            >
              <h2 className="text-[#FFC527] font-montserrat font-bold tracking-[0.2em] uppercase text-xs">
                Fast & Reliable Printing
              </h2>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-extrabold text-white mb-8 leading-[1.1] tracking-tighter max-w-5xl mx-auto">
              Delivering High-Quality Prints That <br /><span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#10A7FF]">Make Your Brand Shine</span>
            </h1>
            
            <p className="font-poppins text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-[1.8] font-light">
              From business cards to large format banners, we ensure your marketing materials speak volumes with technical accuracy, vibrant colors, and beautiful finishes.
            </p>
            
            <Magnetic intensity={0.5}>
              <Link to="/contact" className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#10A7FF] text-white font-bold py-5 px-12 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(16,167,255,0.4)]">
                <span className="relative z-10 transition-colors group-hover:text-black">Request an Estimate</span>
                <div className="absolute inset-0 bg-white translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
              </Link>
            </Magnetic>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-32 px-4 md:px-8 bg-[#020000]">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gsap-section">
              <div>
                <h2 className="text-[#10A7FF] font-montserrat font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-3">Our Portfolio</h2>
                <h2 className="text-5xl md:text-7xl font-montserrat font-extrabold tracking-tighter text-white">Featured Printing Works</h2>
              </div>
              <Magnetic intensity={0.2}>
                <Link to="/services" className="hidden md:inline-flex items-center gap-2 text-white hover:text-[#FFC527] transition-colors font-montserrat font-bold tracking-[0.2em] uppercase text-xs border-b border-transparent hover:border-[#FFC527] pb-1">
                  View All Works <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </div>
            
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {galleryImages.map((src, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: (idx % 4) * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="relative group overflow-hidden rounded-2xl break-inside-avoid cursor-pointer bg-white/5 border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  <img src={src} alt={`Gallery Image ${idx + 1}`} className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <span className="text-white text-sm font-poppins font-medium uppercase tracking-widest bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      View Project
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

export default Home;
