import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Calendar, Eye, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequestJson } from '../utils/api';

interface IP {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

const IPShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ips, setIps] = useState<IP[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch IP projects from API
  useEffect(() => {
    const fetchIPProjects = async () => {
      try {
        setLoading(true);
        // Use the full URL without query params and filter on frontend for now
        const response = await apiRequestJson<{projects: IP[]}>('/api/projects');
        console.log('All projects:', response.projects);
        const ipProjects = response.projects?.filter(project => project.category === 'IP') || [];
        console.log('Filtered IP projects:', ipProjects);
        setIps(ipProjects);
      } catch (error) {
        console.error('Error fetching IP projects:', error);
        setIps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIPProjects();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ips.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ips.length) % ips.length);
  };

  const handleIPClick = (ip: IP) => {
    navigate(`/ip/${ip._id}`, { state: { ip } });
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [ips.length]);

  if (loading) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded-full w-64 mx-auto mb-8"></div>
            <div className="h-16 bg-gray-700 rounded-lg w-96 mx-auto mb-12"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-700 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary text-sm font-medium tracking-wider uppercase">Our Latest Content</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured IP's
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover our latest intellectual properties - from groundbreaking series to innovative formats 
            that captivate audiences worldwide.
          </p>
        </div>

        {/* Main Slideshow */}
        <div className="relative mb-16">
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              {ips.length > 0 && (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer group"
                  onClick={() => handleIPClick(ips[currentSlide])}
                >
                  <img
                    src={ips[currentSlide].image}
                    alt={ips[currentSlide].title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-12">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                        {ips[currentSlide].category}
                      </span>
                    </div>
                    
                    <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                      {ips[currentSlide].title}
                    </h3>
                    
                    <div className="flex items-center gap-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>{new Date(ips[currentSlide].createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Play size={32} className="text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="absolute top-8 right-8">
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                      <span className="text-sm font-medium">View Details</span>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary/20 hover:border-primary/30 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary/20 hover:border-primary/30 transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            {ips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-primary scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Scrolling Thumbnail Navigation */}
        <div className="relative">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {ips.map((ip, index) => (
                <motion.div
                  key={ip._id}
                  className={`relative aspect-video w-80 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                    index === currentSlide 
                      ? 'border-primary shadow-lg shadow-primary/25' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => {
                    setCurrentSlide(index);
                    handleIPClick(ip);
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={ip.image}
                    alt={ip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-white text-sm font-semibold truncate mb-1">
                      {ip.title}
                    </h4>
                    <p className="text-gray-300 text-xs truncate">
                      {ip.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Scroll indicators */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            <span>Scroll →</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IPShowcase;

