import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function ContactPage() {
  return (
    <PageTemplate>
      {/* Hero Section */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">اتصل بنا</h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              نحن هنا للإجابة على استفساراتك ومساعدتك في حجز موعدك
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title">معلومات الاتصال</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <FaPhone className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">رقم الهاتف</h3>
                    <a href="tel:+218924275555" className="text-foreground/80 hover:text-primary transition-colors" dir="ltr">
                      +218 924 275 555
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <FaWhatsapp className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">واتساب</h3>
                    <a href="https://wa.me/218924275555" className="text-foreground/80 hover:text-primary transition-colors" dir="ltr">
                      +218 924 275 555
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">العنوان</h3>
                    <a 
                      href="https://www.google.com/maps/dir/32.8970189,13.2548055/%D9%85%D8%B1%D9%83%D8%B2+%D9%85%D9%86%D8%A7%D9%84+%D8%A7%D9%84%D8%AC%D9%85%D8%A7%D9%84+%D9%84%D9%84%D8%B9%D9%86%D8%A7%D9%8A%D8%A9+%D8%A8%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D8%A9%E2%80%AD%E2%80%AD/@32.8927537,13.192922,13z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x40d0066a2695431f:0x2d57ba9e4e211bb6!2m2!1d13.2134379!2d32.8885078?hl=en&entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-primary transition-colors"
                    >
                      طرابلس، ليبيا
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <FaFacebook className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">فيسبوك</h3>
                    <a 
                      href="https://www.facebook.com/manaljcenter" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-primary transition-colors"
                    >
                      @manaljcenter
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <FaInstagram className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">انستغرام</h3>
                    <a 
                      href="https://www.instagram.com/manaljcenter" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-primary transition-colors"
                    >
                      manaljcenter
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-primary mb-4">ساعات العمل</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex justify-between">
                    <span>السبت - الخميس:</span>
                    <span>10:00 صباحاً - 8:00 مساءً</span>
                  </li>
                  <li className="flex justify-between">
                    <span>الجمعة:</span>
                    <span>مغلق</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="section-title">موقعنا على الخريطة</h2>
              <div className="bg-secondary/10 rounded-xl overflow-hidden h-[400px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3351.8881671116447!2d13.211249075548636!3d32.88850767523456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d0066a2695431f%3A0x2d57ba9e4e211bb6!2z2YXYsdmD2LIg2YXZhtin2YQg2KfZhNis2YXYp9mEINmE2YTYudmG2KfZitipINio2KfZhNio2LTYsdip!5e0!3m2!1sen!2sus!4v1709999999999!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-primary mb-4">ارسل لنا رسالة</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-foreground/80 mb-1">
                      الاسم
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-foreground/80 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-foreground/80 mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-foreground/80 mb-1">
                      الرسالة
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    إرسال
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
} 