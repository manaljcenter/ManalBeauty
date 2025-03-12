'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Create placeholder SVG elements for the missing images
const crescentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.936 9.936 0 0 0-7.071 2.929c-3.905 3.905-3.905 10.237 0 14.142A9.936 9.936 0 0 0 12 22a9.936 9.936 0 0 0 7.071-2.929c.272-.272.52-.558.753-.853C15.197 17.036 12 14.012 12 10s3.197-7.036 7.824-8.217c-.233-.296-.481-.582-.753-.854A9.936 9.936 0 0 0 12 2z"/></svg>`;

const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.22 6.515 7.19.617-5.205 5.067 1.23 7.169L12 17.315l-6.435 3.053 1.23-7.169L1.59 8.132l7.19-.617L12 1z"/></svg>`;

const RamadanTheme = () => {
  return (
    <>
      {/* Ramadan Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Right Crescent */}
        <div className="absolute top-0 right-0 opacity-10 w-[100px] h-[100px] text-primary">
          <div dangerouslySetInnerHTML={{ __html: crescentSvg }} />
        </div>
        
        {/* Bottom Left Star */}
        <div className="absolute bottom-0 left-0 opacity-10 w-[80px] h-[80px] text-primary">
          <div dangerouslySetInnerHTML={{ __html: starSvg }} />
        </div>
        
        {/* Floating Stars */}
        <div className="absolute top-1/4 left-1/4 opacity-10 w-[50px] h-[50px] text-primary">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: starSvg }} />
          </motion.div>
        </div>
        
        <div className="absolute top-1/3 right-1/3 opacity-10 w-[30px] h-[30px] text-primary">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: starSvg }} />
          </motion.div>
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 opacity-10 w-[40px] h-[40px] text-primary">
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: crescentSvg }} />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RamadanTheme; 