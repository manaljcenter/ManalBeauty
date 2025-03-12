import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaMapMarkerAlt, FaMoon, FaStar } from 'react-icons/fa';

// Create placeholder SVG elements for the missing images
const crescentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.936 9.936 0 0 0-7.071 2.929c-3.905 3.905-3.905 10.237 0 14.142A9.936 9.936 0 0 0 12 22a9.936 9.936 0 0 0 7.071-2.929c.272-.272.52-.558.753-.853C15.197 17.036 12 14.012 12 10s3.197-7.036 7.824-8.217c-.233-.296-.481-.582-.753-.854A9.936 9.936 0 0 0 12 2z"/></svg>`;

const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.22 6.515 7.19.617-5.205 5.067 1.23 7.169L12 17.315l-6.435 3.053 1.23-7.169L1.59 8.132l7.19-.617L12 1z"/></svg>`;

const Footer = () => {
  return (
    <footer className="bg-[#FF69B4] text-white py-8 relative overflow-hidden">
      {/* Ramadan Decoration */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#3b5441] via-[#f8d56f] to-[#3b5441]"></div>
      
      {/* Ramadan Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-20 w-[60px] h-[60px] text-white">
        <div dangerouslySetInnerHTML={{ __html: crescentSvg }} />
      </div>
      
      <div className="absolute bottom-10 left-10 opacity-20 w-[40px] h-[40px] text-white">
        <div dangerouslySetInnerHTML={{ __html: starSvg }} />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Image 
                src="/images/logo-white.png" 
                alt="مركز منال الجمال" 
                width={180} 
                height={60} 
                className="h-12 w-auto"
              />
            </div>
            <p className="mb-4">
              مركز متخصص في العناية بالبشرة وإزالة الشعر، نقدم خدمات متميزة بأيدي خبراء متخصصين.
            </p>
            <div className="flex space-x-reverse space-x-4">
              <a 
                href="https://www.facebook.com/manaljcenter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#FFB6C1] transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/manaljcenter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#FFB6C1] transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://wa.me/218924275555" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#FFB6C1] transition-colors"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaMoon className="ml-2 text-white/80" />
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#FFB6C1] transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FFB6C1] transition-colors">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link href="/prices" className="hover:text-[#FFB6C1] transition-colors">
                  الأسعار
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFB6C1] transition-colors">
                  عن العيادة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFB6C1] transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-[#FFB6C1] transition-colors">
                  احجز موعدك
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaStar className="ml-2 text-white/80" />
              اتصل بنا
            </h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <FaPhone className="ml-2" />
                <a href="tel:+218924275555" className="hover:text-[#FFB6C1] transition-colors" dir="ltr">
                  +218 924 275 555
                </a>
              </p>
              <p className="flex items-center">
                <FaWhatsapp className="ml-2" />
                <a href="https://wa.me/218924275555" className="hover:text-[#FFB6C1] transition-colors" dir="ltr">
                  +218 924 275 555
                </a>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="ml-2" />
                <a 
                  href="https://www.google.com/maps/dir/32.8970189,13.2548055/%D9%85%D8%B1%D9%83%D8%B2+%D9%85%D9%86%D8%A7%D9%84+%D8%A7%D9%84%D8%AC%D9%85%D8%A7%D9%84+%D9%84%D9%84%D8%B9%D9%86%D8%A7%D9%8A%D8%A9+%D8%A8%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D8%A9%E2%80%AD%E2%80%AD/@32.8927537,13.192922,13z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x40d0066a2695431f:0x2d57ba9e4e211bb6!2m2!1d13.2134379!2d32.8885078?hl=en&entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFB6C1] transition-colors"
                >
                  موقعنا على الخريطة
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p>© {new Date().getFullYear()} مركز منال الجمال - جميع الحقوق محفوظة</p>
          <p className="mt-2">
            <a href="https://mjcenter.ly" className="hover:text-[#FFB6C1] transition-colors">
              mjcenter.ly
            </a>
          </p>
          <p className="mt-4">رمضان كريم</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 