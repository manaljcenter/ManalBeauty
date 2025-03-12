'use client';

import { FaQuoteRight, FaStar } from 'react-icons/fa';

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">آراء عملائنا</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            نفتخر بثقة عملائنا ونسعى دائماً لتقديم أفضل خدمة ممكنة
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-secondary/10 p-8 rounded-xl text-center">
            <div className="flex justify-center mb-6 text-primary">
              <FaQuoteRight size={40} />
            </div>
            <p className="text-xl text-foreground/80 mb-6">
              سيتم إضافة آراء عملائنا الحقيقية قريباً
            </p>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className="text-primary mx-1"
                  size={24}
                />
              ))}
            </div>
            <p className="text-lg text-foreground/80">
              نحن نقدر آراء عملائنا ونستخدمها لتحسين خدماتنا باستمرار
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 