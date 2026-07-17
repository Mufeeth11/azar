import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star, Printer, Layers, Maximize, Package, Tag, Briefcase, ChevronRight, Download, CheckCircle2, Menu, X, Play, Quote } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesData } from '../data/servicesData';

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

const Typewriter = () => {
  const words = ["For Your Brand.", "For Your Business.", "For Your Projects.", "For Your Vision."];
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (subIndex === words[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1200);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 30 : 60); // fast typing/deleting speed

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  return (
    <span className="inline-block text-[#F47C20] whitespace-nowrap min-w-[280px]">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse border-r-4 border-[#F47C20] ml-1"></span>
    </span>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

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
    return mappedDynamic.slice(0, 6); // Max 6 on home page
  }, [dynamicServices]);

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
    '/assets/premium_photo-1682147382418-ddf8c3e1310e.avif',
    '/assets/premium_photo-1682145497679-e9340895df09.avif',
    '/assets/gallery_img_2.jpg',
    '/assets/gallery_img_5.jpg',
    '/assets/gallery_img_4.jpg',
  ];

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 overflow-hidden relative" ref={containerRef}>

      {/* Premium CSS Gradient Background (Lightweight) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#10A7FF]/10 via-[#030008] to-[#030008]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#605BE5]/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#B33939]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="pt-[110px] pb-12 px-4 md:px-8 flex items-center justify-center relative"
        >
          {/* Clear Background Image with dark gradient overlay for text readability */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img src="/assets/premium_photo-1682145481505-80614272c426.avif" alt="Hero Background" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30"></div>
          </div>
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
            <div className="flex-1 space-y-6 z-20">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-xs md:text-sm font-montserrat font-bold tracking-[0.3em] uppercase text-[#F47C20] mb-2"
                >
                  Premium Quality Printing Services
                </motion.h2>
              </div>
              <h3 className="text-5xl md:text-6xl lg:text-[75px] font-montserrat font-extrabold leading-[1.05] tracking-tighter text-white">
                <WordReveal delay={0.4}>Premium</WordReveal>{' '}
                <WordReveal delay={0.5}>Printing Services</WordReveal>
                <br />
                <span className="relative inline-block mt-2">
                  <Typewriter />
                </span>
              </h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="text-base md:text-lg text-gray-200 font-poppins max-w-2xl leading-relaxed mt-6 mb-8"
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
                  <Link to="/services" className="group relative overflow-hidden inline-flex items-center gap-3 bg-white text-[#B33939] border-2 border-[#B33939] py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold shadow-lg hover:shadow-xl hover:shadow-[#B33939]/20">
                    <span className="relative z-10 transition-colors group-hover:text-white">Our Services</span>
                    <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-2 group-hover:text-white" />
                    <div className="absolute inset-0 bg-[#B33939] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                  </Link>
                </Magnetic>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Services Grid Section */}
        <section className="py-32 px-4 md:px-8 relative z-10 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-20 gsap-section">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C20] to-[#B33939] font-montserrat font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm">Our Printing Services</h2>
              <h3 className="text-5xl md:text-7xl font-montserrat font-extrabold tracking-tighter text-gray-900 mb-6">Expertise in Every Print</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allServices.map((item, idx) => (
                <Link
                  to={`/services/${item.id}`}
                  key={idx}
                  className="group h-[320px] relative w-full rounded-3xl cursor-pointer [perspective:1000px] z-10 block"
                >
                  <div className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-3xl">
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl flex flex-col overflow-hidden group/front">
                      {/* Image Top Half */}
                      <div className="relative h-[60%] w-full overflow-hidden bg-gray-50">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover/front:opacity-100 transition-opacity duration-500"></div>
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover/front:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                      </div>

                      {/* Content Bottom Half */}
                      <div className="relative h-[40%] w-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#F47C20]/5 via-white to-[#FFC527]/10">
                        {/* Decorative Line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#F47C20] to-[#FFC527] rounded-b-full"></div>

                        <h3 className="font-montserrat font-bold text-xl text-gray-900 mt-2 mb-1">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-2 opacity-0 translate-y-2 group-hover/front:opacity-100 group-hover/front:translate-y-0 transition-all duration-300">
                          <span className="text-xs font-bold text-[#F47C20] uppercase tracking-wider">Hover to flip</span>
                          <ArrowRight className="w-3 h-3 text-[#F47C20]" />
                        </div>
                      </div>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-[#605BE5] to-[#403ba0] text-gray-900 rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-[0_0_40px_rgba(96,91,229,0.4)] border border-gray-200">
                      <h3 className="font-montserrat font-bold text-xl mb-3 text-white">{item.title}</h3>
                      <p className="font-poppins text-[14px] leading-relaxed opacity-90 text-white/90">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Magnetic intensity={0.5}>
                <Link to="/services" className="inline-flex items-center gap-3 bg-white text-[#B33939] border-2 border-[#B33939] font-bold py-4 px-10 rounded-full hover:bg-[#B33939] hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(179,57,57,0.3)] tracking-[0.1em] uppercase text-sm">
                  See More Services <ArrowRight className="w-5 h-5" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* Reliable Info Section */}
        <section className="py-10 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#605BE5]/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
            <div className="flex-1 w-full relative gsap-section">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] group">
                <div className="absolute inset-0 bg-[#B33939]/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
                <img src="/assets/premium_photo-1682145497679-e9340895df09.avif" alt="Quality Printing" className="w-full h-full object-cover parallax-img scale-125 origin-center" loading="lazy" />
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -right-10 w-40 h-40 border border-gray-200 rounded-full border-dashed"
              ></motion.div>
            </div>

            <div className="flex-1 space-y-5 gsap-section">
              <div className="inline-block px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm backdrop-blur-sm">
                <span className="text-[#B33939] font-montserrat font-bold tracking-[0.2em] uppercase text-xs">🟧 WHY CHOOSE US</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[50px] font-montserrat font-extrabold text-gray-900 leading-tight tracking-tighter">
                Reliable Printing Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B33939] to-[#F47C20]">Your Business</span>
              </h2>
              <p className="font-poppins text-lg text-gray-600 leading-[1.8] font-light max-w-xl">
                Whether you're a startup, retail store, or corporate enterprise — we deliver <strong className="text-gray-900 font-medium">precision-driven print solutions</strong> that elevate your packaging, marketing materials, and brand identity.
              </p>

              <ul className="space-y-3 pt-2">
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
                    <div className="mt-1 w-6 h-6 rounded-full bg-[#F47C20]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F47C20] transition-colors duration-300">
                      <CheckCircle className="text-[#F47C20] group-hover:text-gray-900 w-4 h-4 transition-colors duration-300" />
                    </div>
                    <span className="font-poppins text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-8">
                <Magnetic intensity={0.3}>
                  <Link to="/contact" className="group relative overflow-hidden inline-flex items-center gap-3 bg-white text-[#B33939] border-2 border-[#B33939] shadow-md font-bold py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-xs">
                    <span className="relative z-10 transition-colors group-hover:text-white">Start Your Project</span>
                    <div className="absolute inset-0 bg-[#B33939] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                  </Link>
                </Magnetic>
              </div>
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
              className="inline-block mb-6 px-6 py-2 border border-gray-200 rounded-full bg-white shadow-lg border border-gray-100"
            >
              <h2 className="text-[#B33939] font-montserrat font-bold tracking-[0.2em] uppercase text-xs">
                Fast & Reliable Printing
              </h2>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-extrabold text-white mb-8 leading-[1.1] tracking-tighter max-w-5xl mx-auto">
              Delivering High-Quality Prints That <br /><span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#F47C20] to-[#B33939]">Make Your Brand Shine</span>
            </h1>

            <p className="font-poppins text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-[1.8] font-light">
              From business cards to large format banners, we ensure your marketing materials speak volumes with technical accuracy, vibrant colors, and beautiful finishes.
            </p>

            <Magnetic intensity={0.5}>
              <Link to="/contact" className="group relative overflow-hidden inline-flex items-center gap-3 bg-white text-[#B33939] border-2 border-[#B33939] font-bold py-5 px-12 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-[0_0_30px_rgba(179,57,57,0.4)]">
                <span className="relative z-10 transition-colors group-hover:text-white">Request an Estimate</span>
                <div className="absolute inset-0 bg-[#B33939] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
              </Link>
            </Magnetic>
          </div>
        </section>


      </div>
    </div>
  );
}
