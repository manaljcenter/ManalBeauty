'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaPhone, FaBars, FaTimes, FaMoon, FaStar } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Ramadan Decoration */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#3b5441] via-[#f8d56f] to-[#3b5441]"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-row-reverse justify-between items-center h-20">
          {/* Logo - Now on the left side in RTL and bigger */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.png" 
                alt="مركز منال الجمال" 
                width={200} 
                height={70} 
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Phone Number - Added for direct calling */}
          <div className="hidden md:flex items-center ml-auto mr-8">
            <a href="tel:+218924275555" className="flex items-center text-primary hover:text-accent transition-colors">
              <FaPhone className="ml-2" />
              <span className="font-medium" dir="ltr">+218 924 275 555</span>
            </a>
          </div>

          {/* Desktop Navigation - Now on the right side in RTL */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            <Link href="/" className={`${pathname === '/' ? 'text-accent font-medium' : 'text-primary'} hover:text-accent transition-colors`}>
              الرئيسية
            </Link>
            <Link href="/services" className={`${pathname === '/services' ? 'text-accent font-medium' : 'text-primary'} hover:text-accent transition-colors`}>
              خدماتنا
            </Link>
            <Link href="/prices" className={`${pathname === '/prices' ? 'text-accent font-medium' : 'text-primary'} hover:text-accent transition-colors`}>
              الأسعار
            </Link>
            <Link href="/about" className={`${pathname === '/about' ? 'text-accent font-medium' : 'text-primary'} hover:text-accent transition-colors`}>
              عن العيادة
            </Link>
            <Link href="/contact" className={`${pathname === '/contact' ? 'text-accent font-medium' : 'text-primary'} hover:text-accent transition-colors`}>
              اتصل بنا
            </Link>
            <Link 
              href="/booking" 
              className={`flex items-center ${pathname === '/booking' ? 'bg-accent' : 'bg-primary'} text-white py-2 px-4 rounded-xl hover:bg-accent transition-colors`}
            >
              <FaMoon className="ml-1 text-white/80" />
              <span>احجز موعدك الآن</span>
              <FaStar className="mr-1 text-white/80 text-xs" />
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-primary hover:text-accent focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Now at the bottom of the screen */}
        {isMenuOpen && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
            <div className="px-2 pt-3 pb-4 space-y-2 sm:px-3">
              {/* Phone Number for Mobile */}
              <a
                href="tel:+218924275555"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary hover:text-accent"
                onClick={toggleMenu}
              >
                <FaPhone className="ml-2" />
                <span dir="ltr">+218 924 275 555</span>
              </a>
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/' ? 'text-accent' : 'text-primary'} hover:text-accent`}
                onClick={toggleMenu}
              >
                الرئيسية
              </Link>
              <Link
                href="/services"
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/services' ? 'text-accent' : 'text-primary'} hover:text-accent`}
                onClick={toggleMenu}
              >
                خدماتنا
              </Link>
              <Link
                href="/prices"
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/prices' ? 'text-accent' : 'text-primary'} hover:text-accent`}
                onClick={toggleMenu}
              >
                الأسعار
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/about' ? 'text-accent' : 'text-primary'} hover:text-accent`}
                onClick={toggleMenu}
              >
                عن العيادة
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/contact' ? 'text-accent' : 'text-primary'} hover:text-accent`}
                onClick={toggleMenu}
              >
                اتصل بنا
              </Link>
              <Link
                href="/booking"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${pathname === '/booking' ? 'bg-accent' : 'bg-primary'} text-white`}
                onClick={toggleMenu}
              >
                <FaMoon className="ml-1 text-white/80" />
                <span>احجز موعدك الآن</span>
                <FaStar className="mr-1 text-white/80 text-xs" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 