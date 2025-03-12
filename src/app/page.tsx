import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import Testimonials from '@/components/Testimonials';
import PromotionBanner from '@/components/PromotionBanner';
import PageTemplate from '@/components/PageTemplate';

export default function Home() {
  return (
    <PageTemplate>
      <Hero />
      <ServicesSection />
      <PromotionBanner />
      <Testimonials />
    </PageTemplate>
  );
}
