'use client';

import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import LoadingScreen from './LoadingScreen';
import RamadanTheme from './RamadanTheme';

interface PageTemplateProps {
  children: React.ReactNode;
}

const PageTemplate = ({ children }: PageTemplateProps) => {
  const [loading, setLoading] = useState(true);

  const finishLoading = () => {
    setLoading(false);
  };

  // Prevent scrolling while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loading]);

  return (
    <>
      {loading && <LoadingScreen finishLoading={finishLoading} />}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <RamadanTheme />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default PageTemplate; 