import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesData } from '../data/servicesData';
import Magnetic from '../components/Magnetic';
import { ArrowRight } from 'lucide-react';

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
  const [showAll, setShowAll] = useState(false);
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);

  const allServices = useMemo(() => {
    const mappedDynamic = dynamicServices.map(item => ({
      id: `dynamic-${item.id}`,
      title: item.title,
      desc: item.description,
      img: item.image_url 
        ? (item.image_url.startsWith('http') || item.image_url.startsWith('/assets') 
            ? item.image_url 
            : `http://localhost:5000${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`) 
        : 'https://images.unsplash.com/photo-1626785776965-b903e103986a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'dynamic'
    }));
    return [...servicesData, ...mappedDynamic];
  }, [dynamicServices]);

  const displayedServices = showAll ? allServices : allServices.slice(0, 3);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/activities');
        setDynamicServices(response.data.activities);
      } catch (error) {
        console.error('Failed to fetch dynamic services:', error);
      }
    };
    fetchServices();
  }, []);

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

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 overflow-hidden relative" ref={containerRef}>

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen">
        <div
          className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#10A7FF] to-transparent blur-[120px]"
        />
        <div
          className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#605BE5] to-transparent blur-[150px]"
        />
      </div>

      <div className="relative z-10">
        <motion.section
          className="flex flex-col items-center justify-center pt-8 pb-4 px-4 md:px-8 relative"
        >
          <div className="container mx-auto text-center z-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-4 leading-none overflow-hidden flex flex-col gap-2">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F47C20] to-[#B33939]">
                <WordReveal delay={0.1}>Elevating</WordReveal>{' '}
                <WordReveal delay={0.2}>Brands</WordReveal>
              </span>
              <span className="block">
                <WordReveal delay={0.3}>Through</WordReveal>{' '}
                <WordReveal delay={0.4}>Print.</WordReveal>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-poppins text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Comprehensive printing solutions tailored to elevate your brand identity across all industries.
            </motion.p>
          </div>
        </motion.section>

        <section className="pt-4 pb-24 px-4 md:px-8 relative z-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Connecting Background Line - Desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>

              {displayedServices.map((item, idx) => (
                <Link
                  to={`/services/${item.id}`}
                  key={idx}
                  className="service-card block relative z-10"
                >
                  <Magnetic intensity={0.15}>
                    <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full rounded-[2rem] flex flex-col group overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-500 cursor-pointer">

                      {/* Image Top Half */}
                      <div className="relative h-[220px] w-full overflow-hidden bg-gray-50 shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />

                        {/* Number Indicator moved to image overlay */}
                        <div className="absolute top-4 right-4 z-20 font-montserrat font-black text-5xl text-white/20 group-hover:text-white/40 transition-colors duration-500 pointer-events-none mix-blend-overlay">
                          0{idx + 1}
                        </div>
                      </div>

                      {/* Content Bottom Half */}
                      <div className="relative p-8 flex flex-col items-start text-left flex-1 bg-gradient-to-br from-[#F47C20]/5 via-white to-white">
                        {/* Decorative Line */}
                        <div className="absolute top-0 left-8 w-12 h-1 bg-gradient-to-r from-[#F47C20] to-[#FFC527] rounded-b-full"></div>

                        <h3 className="font-montserrat font-bold text-[24px] text-gray-900 mt-2 mb-3 leading-tight group-hover:text-[#B33939] transition-colors duration-300">
                          {item.title}
                        </h3>

                        <p className="font-poppins text-[15px] text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-1">
                          {item.desc}
                        </p>

                        <div className="mt-6 flex items-center gap-2 text-[#F47C20] font-bold text-sm tracking-wider uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Explore Service <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Magnetic>
                </Link>
              ))}
            </div>

            {allServices.length > 3 && (
              <div className="mt-20 text-center relative z-20">
                <Magnetic intensity={0.5}>
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-3 bg-white text-[#B33939] border-2 border-[#B33939] font-bold py-4 px-10 rounded-full hover:bg-[#B33939] hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(179,57,57,0.3)] tracking-[0.1em] uppercase text-sm group"
                  >
                    {showAll ? 'Show Less' : 'View All Services'} <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${showAll ? '-rotate-90' : ''}`} />
                  </button>
                </Magnetic>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-8 pb-24 px-4 md:px-8 relative z-20 border-t border-gray-200/50 gsap-section">
          <div className="container mx-auto">
            <div className="bg-white shadow-xl rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-gray-200">
              {/* Internal gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#605BE5]/20 to-transparent opacity-50"></div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-gray-900 mb-6">
                  Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C20] to-[#B33939]">Brand?</span>
                </h2>
                <p className="font-poppins text-xl text-gray-600 mb-10">
                  Partner with us for premium printing solutions that leave a lasting impression.
                </p>
                <Magnetic intensity={0.3}>
                  <a href="/contact" className="group relative overflow-hidden inline-flex items-center justify-center bg-white text-[#B33939] border-2 border-[#B33939] font-semibold py-5 px-12 rounded-full transition-all duration-300 uppercase tracking-widest text-sm">
                    <span className="relative z-10 transition-colors group-hover:text-white">Start Your Project</span>
                    <div className="absolute inset-0 bg-[#B33939] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
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
