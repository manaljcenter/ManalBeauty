'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  finishLoading: () => void;
}

const LoadingScreen = ({ finishLoading }: LoadingScreenProps) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 2500);

    return () => clearTimeout(timer);
  }, [finishLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevCounter + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="relative w-64 h-64 mb-8 animate-pulse">
        <Image
          src="/images/logo.png"
          alt="مركز منال الجمال"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
          style={{ width: `${counter}%` }}
        />
      </div>
      
      <p className="mt-4 text-primary font-bold text-lg">
        {counter}%
      </p>
    </div>
  );
};

export default LoadingScreen; 