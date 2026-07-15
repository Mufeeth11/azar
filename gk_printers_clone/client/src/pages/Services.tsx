import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../components/Magnetic';

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

const Services = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Memoize the services array so it doesn't get recreated on every render
  const services = useMemo(() => [
    { img: '/assets/premium_photo-1682145481505-80614272c426.avif', title: 'Digital Printing', desc: 'High-speed, high-quality digital printing for business cards, flyers, and short-run projects.' },
    { img: '/assets/premium_photo-1682145497679-e9340895df09.avif', title: 'Offset Printing', desc: 'Cost-effective and premium quality offset printing for bulk orders like catalogs and brochures.' },
    { img: '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif', title: 'Large Format Printing', desc: 'Vibrant, durable flex banners, vinyl prints, and posters that command attention anywhere.' },
    { img: '/assets/premium_photo-1682145481505-80614272c426.avif', title: 'Packaging Solutions', desc: 'Custom printed boxes, product packaging, and cartons that elevate your brand presentation.' },
    { img: '/assets/premium_photo-1682145497679-e9340895df09.avif', title: 'Label & Sticker Printing', desc: 'Precision die-cut labels and stickers for products, packaging, and promotional needs.' },
    { img: '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif', title: 'Corporate Branding', desc: 'Professional letterheads, envelopes, ID cards, and custom merchandise to unify your brand.' }
  ], []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for service cards
      const cards = document.querySelectorAll('.service-card');
      
      // Initial hide
      gsap.set(cards, { y: 100, opacity: 0 });

      ScrollTrigger.batch(cards, {
        interval: 0.1, 
        batchMax: 3,   
        onEnter: batch => gsap.to(batch, {
          opacity: 1, 
          y: 0, 
          stagger: { each: 0.15 },
          duration: 1.2,
          ease: "power3.out"
        }),
        start: "top 85%"
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#020000] text-white overflow-hidden relative" ref={containerRef}>
      
      {/* Background Animated Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen">
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, 100, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#10A7FF] to-transparent blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2], y: [0, -100, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#605BE5] to-transparent blur-[150px]"
        />
      </div>

      <div className="relative z-10">
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="min-h-[70vh] flex items-center justify-center pt-24 px-4 md:px-8 relative"
        >
          <div className="container mx-auto text-center z-10">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-montserrat font-bold mb-6 overflow-hidden">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#10A7FF]">
                <WordReveal delay={0.1}>Elevating</WordReveal>{' '}
                <WordReveal delay={0.2}>Brands</WordReveal>
              </span>
              <span className="block mt-2">
                <WordReveal delay={0.3}>Through</WordReveal>{' '}
                <WordReveal delay={0.4}>Print.</WordReveal>
              </span>
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-poppins text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Comprehensive printing solutions tailored to elevate your brand identity across all industries.
            </motion.p>
          </div>
        </motion.section>

        <section className="py-24 px-4 md:px-8 relative z-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Connecting Background Line - Desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>

              {services.map((item, idx) => (
                <div 
                  key={idx}
                  className="service-card relative z-10"
                >
                  <Magnetic intensity={0.15}>
                    <div className="glass-card h-full p-10 rounded-[2rem] flex flex-col items-start text-left group overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 bg-[#050505]/60 backdrop-blur-md">
                      
                      {/* Hover Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#605BE5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 w-full">
                        <div className="mb-8 w-[90px] h-[90px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        
                        <h3 className="font-montserrat font-bold text-[24px] text-white mb-4 leading-tight group-hover:text-[#FFC527] transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="font-poppins text-[16px] text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          {item.desc}
                        </p>
                      </div>

                      {/* Number Indicator */}
                      <div className="absolute top-8 right-8 font-montserrat font-black text-6xl text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-500">
                        0{idx + 1}
                      </div>
                    </div>
                  </Magnetic>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 md:px-8 relative z-20 border-t border-white/5">
            <div className="container mx-auto">
              <div className="glass-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/10">
                 {/* Internal gradient */}
                 <div className="absolute inset-0 bg-gradient-to-b from-[#605BE5]/20 to-transparent opacity-50"></div>
                 
                 <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-6">
                      Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#10A7FF]">Brand?</span>
                    </h2>
                    <p className="font-poppins text-xl text-gray-400 mb-10">
                      Partner with us for premium printing solutions that leave a lasting impression.
                    </p>
                    <Magnetic intensity={0.3}>
                      <a href="/contact" className="group relative overflow-hidden inline-flex items-center justify-center bg-white text-black font-semibold py-5 px-12 rounded-full transition-all duration-300 uppercase tracking-widest text-sm">
                        <span className="relative z-10 transition-colors group-hover:text-white">Start Your Project</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#605BE5] to-[#10A7FF] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                      </a>
                    </Magnetic>
                 </div>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
});

export default Services;
