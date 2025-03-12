'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/images/u6116355524_A_beautiful_young_libyan_woman_wearing_a_pink_hij_f851cd08-74b4-4e42-b4ec-5ff885cdc1b3_1.png',
  '/images/u6116355524_A_skincare_clinic_with_hair_removal_machine_with__5955fbb3-3828-4ee5-94fc-afe021a7098b_2.png',
  '/images/u6116355524_A_skincare_clinic_with_hair_removal_machine_with__d88a8059-4f5f-4e7a-9223-c494ded83083_3.png',
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImage}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-10" />
              <div className="w-full h-full relative">
                <Image 
                  src={images[currentImage]}
                  alt={`صورة عرض ${currentImage + 1}`}
                  fill
                  sizes="100vw"
                  priority={currentImage === 0}
                  className="object-cover object-center animate-slow-zoom"
                  quality={90}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Image 
            src="/images/logo-white.png" 
            alt="مركز منال الجمال" 
            width={300} 
            height={100} 
            className="h-auto w-auto drop-shadow-lg"
          />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-2xl font-light drop-shadow-md"
        >
          للعناية بالبشرة وإزالة الشعر
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            href="/booking" 
            className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            احجز موعدك الآن
          </Link>
          <Link 
            href="/services" 
            className="bg-white text-primary hover:bg-secondary hover:text-white transition-all text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            خدماتنا
          </Link>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
        <div className="flex space-x-reverse space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImage 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`عرض الصورة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero; 