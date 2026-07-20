import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../components/Magnetic';

import { Activity } from 'lucide-react';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [dynamicService, setDynamicService] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(id?.startsWith('dynamic-'));

  const staticService = servicesData.find(s => s.id === id);
  const otherServices = servicesData.filter(s => s.id !== id);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id?.startsWith('dynamic-')) {
      const fetchDynamicService = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/activities');
          const realId = parseInt(id.replace('dynamic-', ''));
          const found = response.data.activities.find((a: any) => a.id === realId);
          if (found) {
            setDynamicService({
              id: id,
              title: found.title,
              desc: found.detailed_description || found.description, // Use detailed if available
              img: found.image_url
                ? (found.image_url.startsWith('http') || found.image_url.startsWith('/assets')
                  ? found.image_url
                  : `http://localhost:5000${found.image_url.startsWith('/') ? '' : '/'}${found.image_url}`)
                : 'https://images.unsplash.com/photo-1626785776965-b903e103986a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              Icon: Activity,
              content: "Custom printing solution tailored to your exact specifications.",
              features: [
                "Premium quality materials",
                "Custom design support",
                "Fast turnaround time",
                "Satisfaction guaranteed"
              ]
            });
          }
        } catch (error) {
          console.error("Failed to fetch dynamic service", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDynamicService();
    }
  }, [id]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.gsap-section');
      sections.forEach((section: any) => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="text-center font-montserrat font-bold text-2xl text-gray-400 animate-pulse">Loading Service Details...</div>
      </div>
    );
  }

  const service = dynamicService || staticService;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 font-montserrat">Service Not Found</h2>
          <button onClick={() => navigate('/services')} className="text-[#F47C20] hover:underline font-poppins">
            Return to Services
          </button>
        </div>
      </div>
    );
  }

  const { Icon } = service;

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 overflow-hidden relative" ref={containerRef}>

      {/* Hero Section */}
      <section className="pt-8 pb-8 px-4 md:px-8 relative bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F47C20]/5 to-transparent z-0 pointer-events-none"></div>
        <div className="container mx-auto relative z-10 max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#F47C20] transition-colors mb-10 font-poppins text-sm uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white shadow-xl border border-gray-100 flex items-center justify-center text-[#F47C20] shrink-0"
            >
              <Icon className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-6xl font-montserrat font-extrabold text-gray-900 mb-4 tracking-tighter"
              >
                {service.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl font-poppins text-gray-600 max-w-2xl leading-relaxed"
              >
                {service.desc}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      {service.img && (
        <section className="px-4 md:px-8 relative z-10 -mt-4 mb-12">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-[200px] md:h-[300px]"
            >
              <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Details Section */}
      <section className="pt-4 pb-20 px-4 md:px-8 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-gray-100 gsap-section">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-900 mb-6">Overview</h2>
            <p className="font-poppins text-gray-600 text-lg leading-[1.8] mb-12">
              {service.fullDesc}
            </p>

            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-gray-900 mb-8">Key Features & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="mt-1 shrink-0">
                    <CheckCircle className="w-5 h-5 text-[#F47C20]" />
                  </div>
                  <span className="font-poppins text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div>
                <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-2">Ready to start?</h3>
                <p className="font-poppins text-gray-500">Contact us today to get a quote for this service.</p>
              </div>
              <Magnetic intensity={0.2}>
                <Link to="/contact" className="inline-flex items-center gap-3 bg-[#F47C20] text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#F47C20]/20 uppercase tracking-widest text-xs">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 gsap-section">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 mb-4">Other Services</h2>
            <p className="font-poppins text-gray-600">Explore more of what we have to offer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gsap-section">
            {otherServices.slice(0, 4).map((item, idx) => (
              <Link to={`/services/${item.id}`} key={idx} className="group bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-[#F47C20]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#F47C20]/10 flex items-center justify-center text-[#F47C20] mb-4 group-hover:bg-[#F47C20] group-hover:text-white transition-colors">
                  <item.Icon className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-gray-900 mb-2 group-hover:text-[#F47C20] transition-colors">{item.title}</h3>
                <p className="font-poppins text-sm text-gray-500 line-clamp-2">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetail;

