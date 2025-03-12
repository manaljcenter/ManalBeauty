import PriceList from '@/components/PriceList';
import PageTemplate from '@/components/PageTemplate';

export default function PricesPage() {
  return (
    <PageTemplate>
      {/* Hero Section */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">قائمة الخدمات والأسعار</h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              تعرف على خدماتنا المتميزة وأسعارها التنافسية
            </p>
          </div>
        </div>
      </section>

      {/* Price List */}
      <PriceList />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">هل أنت مستعدة للحصول على بشرة مثالية؟</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            احجزي موعدك الآن واستمتعي بخدماتنا المتميزة على يد خبراء متخصصين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="bg-white text-primary hover:bg-secondary hover:text-white transition-colors py-3 px-6 rounded-xl font-bold"
            >
              احجزي موعدك الآن
            </a>
            <a
              href="https://wa.me/218924275555"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 transition-colors py-3 px-6 rounded-xl font-bold"
            >
              تواصلي معنا عبر واتساب
            </a>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
} 