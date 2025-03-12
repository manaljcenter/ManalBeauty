'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const RamadanPromotion = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-[#1a3a3a] opacity-95 z-0">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: `url('/images/ramadan/pattern.png')`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Side - Decorative Elements */}
          <div className="mb-8 md:mb-0 md:w-1/3 flex justify-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <Image 
                src="/images/ramadan/lantern-gold.png" 
                alt="Ramadan Lantern" 
                width={180} 
                height={250}
                className="drop-shadow-2xl"
              />
            </motion.div>
          </div>
          
          {/* Right Side - Promotion Text */}
          <div className="md:w-2/3 text-center md:text-right text-white">
            <div className="flex justify-center md:justify-end mb-4">
              <Image 
                src="/images/ramadan/crescent-gold.png" 
                alt="Ramadan Crescent" 
                width={40} 
                height={40}
                className="ml-2"
              />
              <h2 className="text-2xl md:text-3xl font-bold text-[#f8d56f]">عروض شهر رمضان المبارك</h2>
            </div>
            
            <p className="text-lg mb-6 max-w-2xl mx-auto md:mr-0 md:ml-auto">
              بمناسبة حلول شهر رمضان المبارك، يسرنا أن نقدم لكم خصومات خاصة على جميع خدماتنا. استمتعي بخصم 30% على جلسات العناية بالبشرة وإزالة الشعر طوال الشهر الكريم.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Link 
                href="/booking" 
                className="bg-[#f8d56f] text-[#1a3a3a] hover:bg-white transition-colors py-3 px-6 rounded-xl font-bold shadow-lg"
              >
                احجزي موعدك الآن
              </Link>
              <Link 
                href="/services" 
                className="bg-transparent border border-[#f8d56f] text-[#f8d56f] hover:bg-[#f8d56f]/10 transition-colors py-3 px-6 rounded-xl font-bold"
              >
                تعرفي على العروض
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Stars */}
      <div className="absolute top-5 left-5 opacity-30">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <Image 
            src="/images/ramadan/star-gold.png" 
            alt="Decorative Star" 
            width={20} 
            height={20}
          />
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 right-10 opacity-30">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Image 
            src="/images/ramadan/star-gold.png" 
            alt="Decorative Star" 
            width={30} 
            height={30}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default RamadanPromotion; 