'use client';

import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/218924275555"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors"
      aria-label="تواصل معنا عبر واتساب"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default WhatsAppButton; 