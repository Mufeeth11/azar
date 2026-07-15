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

  const inputClasses = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#10A7FF] focus:border-transparent outline-none font-poppins transition-all text-white placeholder-gray-500 backdrop-blur-sm";

  return (
    <div className="w-full min-h-screen bg-[#020000] text-white overflow-hidden relative" ref={containerRef}>
      
      {/* Background Animated Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen">
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, -100, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#FFC527] to-transparent blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2], y: [0, 100, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#605BE5] to-transparent blur-[150px]"
        />
      </div>

      <div className="relative z-10">
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="min-h-[60vh] flex items-center justify-center pt-32 px-4 md:px-8 relative"
        >
          <div className="container mx-auto text-center z-10">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-montserrat font-bold mb-6 overflow-hidden">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#10A7FF]">
                <WordReveal delay={0.1}>Let's</WordReveal>{' '}
                <WordReveal delay={0.2}>Talk.</WordReveal>
              </span>
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-poppins text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Get in touch with us for quotes, inquiries, or to discuss your next big printing project.
            </motion.p>
          </div>
        </motion.section>

        <section className="py-24 px-4 md:px-8 relative z-20">
          <div className="container mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Contact Info */}
            <div className="flex-1 space-y-12">
              <div>
                <div className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                  <span className="text-[#10A7FF] font-montserrat font-semibold tracking-wider text-sm uppercase">Get In Touch</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-6 leading-tight">
                  We'd love to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#f17a3a]">hear from you</span>
                </h2>
                <p className="font-poppins text-gray-400 text-lg leading-relaxed max-w-md">
                  Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="contact-item flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl glass-dark border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#FFC527] transition-all duration-300 shadow-lg">
                    <MapPin className="text-[#FFC527] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-xl text-white mb-2">Location</h4>
                    <p className="font-poppins text-gray-400 leading-relaxed">New York, NY, USA</p>
                  </div>
                </div>
                
                <div className="contact-item flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl glass-dark border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#10A7FF] transition-all duration-300 shadow-lg">
                    <Phone className="text-[#10A7FF] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-xl text-white mb-2">Call Us</h4>
                    <a href="tel:+15551234567" className="font-poppins text-gray-400 hover:text-white transition-colors leading-relaxed">+1 (555) 123-4567</a>
                  </div>
                </div>

                <div className="contact-item flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl glass-dark border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#605BE5] transition-all duration-300 shadow-lg">
                    <Mail className="text-[#605BE5] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-xl text-white mb-2">Email Us</h4>
                    <a href="mailto:info@printingcompany.com" className="font-poppins text-gray-400 hover:text-white transition-colors leading-relaxed">info@printingcompany.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex-1 contact-form-container">
              <div className="glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden border border-white/10">
                {/* Decorative glow inside form */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10A7FF]/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                <h3 className="font-montserrat font-bold text-3xl mb-8 text-white relative z-10">Send a Message</h3>
                
                {status.message && (
                  <div className={`p-4 mb-8 rounded-xl font-poppins text-sm relative z-10 border backdrop-blur-md ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-poppins text-sm font-medium text-gray-400 mb-2">First Name *</label>
                      <input 
                        {...register('firstName', { required: 'First name is required' })}
                        className={inputClasses}
                        placeholder="John"
                      />
                      {errors.firstName && <span className="text-red-400 text-xs mt-2 block font-poppins">{(errors.firstName as any).message}</span>}
                    </div>
                    <div>
                      <label className="block font-poppins text-sm font-medium text-gray-400 mb-2">Last Name</label>
                      <input 
                        {...register('lastName')}
                        className={inputClasses}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-poppins text-sm font-medium text-gray-400 mb-2">Email Address *</label>
                    <input 
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                      })}
                      className={inputClasses}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-red-400 text-xs mt-2 block font-poppins">{(errors.email as any).message}</span>}
                  </div>
                  
                  <div>
                    <label className="block font-poppins text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      {...register('phone')}
                      className={inputClasses}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-sm font-medium text-gray-400 mb-2">Message *</label>
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
                      className="w-full group relative overflow-hidden flex items-center justify-center bg-white text-black font-semibold py-5 rounded-xl transition-all duration-300 uppercase tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                      <span className="relative z-10 transition-colors group-hover:text-white">{isLoading ? 'Sending...' : 'Send Message'}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#605BE5] to-[#10A7FF] translate-y-[100%] rounded-xl group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
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
