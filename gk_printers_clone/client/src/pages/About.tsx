import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../components/Magnetic';
import { Link } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';

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

const About = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Images
      const parallaxImages = document.querySelectorAll('.parallax-img');
      parallaxImages.forEach((img) => {
        gsap.to(img, {
          yPercent: 20,
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

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 overflow-hidden relative" ref={containerRef}>

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
        <div
          className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-bl from-[#FFC527] to-transparent blur-[120px]"
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#605BE5] to-transparent blur-[150px]"
        />
      </div>

      <div className="relative z-10">
        <motion.section
          className="pt-8 md:pt-8 pb-8 flex items-center justify-center px-4 md:px-8 relative"
        >
          <div className="container mx-auto text-center z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-2 leading-none overflow-hidden">
              <WordReveal delay={0.1}>The</WordReveal>{' '}
              <WordReveal delay={0.2}>Story</WordReveal>{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F47C20] to-[#B33939]">
                <WordReveal delay={0.3}>Behind</WordReveal>{' '}
                <WordReveal delay={0.4}>Us.</WordReveal>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-poppins text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4"
            >
              Discover our journey, our mission, and what makes us the leading choice for high-quality printing and packaging solutions.
            </motion.p>
          </div>
        </motion.section>

        <section className="py-16 px-4 md:px-8 bg-gray-50 relative z-20">
          <div className="container mx-auto mb-16 text-center gsap-section">
            <h3 className="text-[#F47C20] font-montserrat font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4">Our Story</h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
              Commitment to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#f17a3a]">Excellence</span> in Every Print
            </h2>
          </div>

          <div className="container mx-auto flex flex-col md:flex-row items-start gap-12 lg:gap-20">
            <div className="flex-1 w-full relative gsap-section">
              <div className="relative rounded-[2rem] overflow-hidden aspect-square w-full max-w-xl mx-auto md:mx-0 group">
                <div className="absolute inset-0 bg-[#F47C20]/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
                <img
                  src="/assets/premium_photo-1682145481505-80614272c426.avif"
                  alt="About Us"
                  className="w-full h-full object-cover parallax-img scale-125 origin-center"
                  loading="lazy"
                />
              </div>
              {/* Decorative Blur Box */}
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute -bottom-10 -right-10 bg-white shadow-xl border border-gray-100 p-8 rounded-3xl border border-gray-200 hidden md:block"
              >
                <div className="font-montserrat font-bold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#F47C20] to-[#B33939]">
                  10+
                </div>
                <div className="font-poppins text-sm text-gray-600 mt-2 uppercase tracking-widest">
                  Years of Excellence
                </div>
              </motion.div>
            </div>

            <div className="flex-1 space-y-8 gsap-section md:pt-8">

              <div className="space-y-6">
                <p className="font-poppins text-gray-600 text-lg leading-relaxed border-l-2 border-[#10A7FF] pl-6">
                  We were founded with a single mission: to provide unparalleled printing solutions that help brands stand out. We specialize in a wide range of printing services including digital, offset, and large format printing, ensuring that every project meets the highest industry standards.
                </p>
                <p className="font-poppins text-gray-600 text-lg leading-relaxed">
                  With our state-of-the-art in-house facilities, we offer fast, scalable production for businesses of all sizes. From initial design to final print, our expert team is dedicated to bringing your vision to life with precision and vibrant colors.
                </p>
              </div>

              <div className="pt-8">
                <Magnetic intensity={0.4}>
                  <div className="inline-block">
                    <Link to="/contact" className="group relative overflow-hidden inline-flex items-center gap-3 bg-white text-[#B33939] border-2 border-[#B33939] shadow-md font-semibold py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-widest text-sm">
                      <span className="relative z-10 transition-colors group-hover:text-white">Join Our Journey</span>
                      <div className="absolute inset-0 bg-[#B33939] translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                    </Link>
                  </div>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewsSection />

      </div>
    </div>
  );
});

export default About;
