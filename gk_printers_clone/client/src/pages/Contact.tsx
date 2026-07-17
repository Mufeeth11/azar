import { motion, useScroll, useTransform } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
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

const Contact = React.memo(() => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate contact items
      const contactItems = document.querySelectorAll('.contact-item');
      gsap.set(contactItems, { x: -50, opacity: 0 });

      ScrollTrigger.batch(contactItems, {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => gsap.to(batch, {
          opacity: 1,
          x: 0,
          stagger: { each: 0.15 },
          duration: 1,
          ease: "power3.out"
        }),
        start: "top 85%"
      });

      // Form reveal
      gsap.fromTo('.contact-form-container',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.contact-form-container',
            start: "top 85%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = useCallback(async (data: any) => {
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    try {
      await axios.post('http://localhost:5000/api/contact', data);
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      reset();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  const inputClasses = "w-full px-3 py-2 bg-white shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#10A7FF] focus:border-transparent outline-none font-poppins text-xs transition-all text-gray-900 placeholder-gray-400 backdrop-blur-sm";

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 overflow-hidden relative" ref={containerRef}>

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen">
        <div
          className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#FFC527] to-transparent blur-[120px]"
        />
        <div
          className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#605BE5] to-transparent blur-[150px]"
        />
      </div>

      <div className="relative z-10">
        <motion.section
          className="flex flex-col items-center justify-center pt-8 pb-4 px-4 md:px-8 relative"
        >
          <div className="container mx-auto text-center z-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-4 overflow-hidden">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F47C20] to-[#B33939]">
                <WordReveal delay={0.1}>Let's</WordReveal>{' '}
                <WordReveal delay={0.2}>Talk.</WordReveal>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-poppins text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Get in touch with us for quotes, inquiries, or to discuss your next big printing project.
            </motion.p>
          </div>
        </motion.section>

        <section className="pt-4 pb-16 px-4 md:px-8 relative z-20">
          <div className="container mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* Contact Info */}
            <div className="flex-1 space-y-10">
              <div>
                <div className="inline-block px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm backdrop-blur-sm mb-4">
                  <span className="text-[#F47C20] font-montserrat font-semibold tracking-wider text-xs uppercase">Get In Touch</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-gray-900 mb-4 leading-tight">
                  We'd love to <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#f17a3a]">hear from you</span>
                </h2>
                <p className="font-poppins text-gray-600 text-base leading-relaxed max-w-md">
                  Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-8">


                <a 
                  href="https://www.google.com/maps/search/?api=1&query=2nd+St,+near+BALAJI+INTERNATIONAL+HOTEL,+Cross+Cut,+Coimbatore,+Tamil+Nadu+641012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item flex items-start gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#B33939] transition-all duration-300">
                    <MapPin className="text-[#B33939] w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-lg text-gray-900 mb-1 group-hover:text-[#B33939] transition-colors">Location</h4>
                    <p className="font-poppins text-gray-600 text-sm leading-relaxed max-w-[280px]">
                      2nd St, near BALAJI INTERNATIONAL HOTEL, Cross Cut, Coimbatore, Tamil Nadu 641012
                    </p>
                  </div>
                </a>

                <div className="contact-item flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#10A7FF] transition-all duration-300">
                    <Phone className="text-[#F47C20] w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-lg text-gray-900 mb-1">Call Us</h4>
                    <a href="tel:+919072483642" className="font-poppins text-gray-600 text-sm hover:text-gray-900 transition-colors leading-relaxed">
                      090724 83642
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex-1 contact-form-container">
              <div className="bg-white shadow-lg border border-gray-100 p-5 md:p-6 rounded-2xl relative overflow-hidden border border-gray-200">
                {/* Decorative glow inside form */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F47C20]/10 blur-[100px] rounded-full pointer-events-none"></div>

                <h3 className="font-montserrat font-bold text-xl mb-4 text-gray-900 relative z-10">Send a Message</h3>

                {status.message && (
                  <div className={`p-4 mb-8 rounded-xl font-poppins text-sm relative z-10 border backdrop-blur-md ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-poppins text-xs font-medium text-gray-600 mb-1">First Name *</label>
                      <input
                        {...register('firstName', { required: 'First name is required' })}
                        className={inputClasses}
                        placeholder="John"
                      />
                      {errors.firstName && <span className="text-red-400 text-xs mt-1 block font-poppins">{(errors.firstName as any).message}</span>}
                    </div>
                    <div>
                      <label className="block font-poppins text-xs font-medium text-gray-600 mb-1">Last Name</label>
                      <input
                        {...register('lastName')}
                        className={inputClasses}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                      })}
                      className={inputClasses}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-red-400 text-xs mt-1 block font-poppins">{(errors.email as any).message}</span>}
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className={inputClasses}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-medium text-gray-600 mb-1">Message *</label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={5}
                      className={`${inputClasses} resize-none`}
                      placeholder="How can we help you?"
                    ></textarea>
                    {errors.message && <span className="text-red-400 text-xs mt-2 block font-poppins">{(errors.message as any).message}</span>}
                  </div>

                  <Magnetic intensity={0.2}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full group relative overflow-hidden flex items-center justify-center bg-white text-[#B33939] border-2 border-[#B33939] font-semibold py-2.5 rounded-lg transition-all duration-300 uppercase tracking-widest text-xs disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                      <span className="relative z-10 transition-colors group-hover:text-white">{isLoading ? 'Sending...' : 'Send Message'}</span>
                      <div className="absolute inset-0 bg-[#B33939] translate-y-[100%] rounded-xl group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                    </button>
                  </Magnetic>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

export default Contact;
