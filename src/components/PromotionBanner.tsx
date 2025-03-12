'use client';

import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

const PromotionBanner = () => {
  return (
    <section className="bg-gradient-to-l from-primary to-accent text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-right">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              عروض خاصة لشهر رمضان المبارك
            </h2>
            <p className="text-white/90 text-lg">
              احصلي على خصم 20% على جميع خدمات العناية بالبشرة حتى نهاية الشهر
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/booking"
              className="bg-white text-primary hover:bg-secondary hover:text-white transition-colors py-3 px-6 rounded-xl font-bold text-center"
            >
              احجزي الآن
            </Link>
            <a
              href="https://wa.me/218924275555"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 transition-colors py-3 px-6 rounded-xl font-bold flex items-center justify-center"
            >
              <FaWhatsapp className="ml-2" size={20} />
              تواصلي معنا
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner; 