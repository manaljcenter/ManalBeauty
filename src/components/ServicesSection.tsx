'use client';

import ServiceCard from './ServiceCard';
import { FaSpa, FaLeaf, FaMagic, FaGem, FaHeart, FaStar } from 'react-icons/fa';

const services = [
  {
    id: 6,
    title: 'نضارة البشرة',
    description: 'جلسات متخصصة لتجديد نضارة البشرة وإشراقها',
    icon: <FaStar />,
    href: '/services/skin-rejuvenation',
    image: '/images/services/service1.png',
  },
  {
    id: 2,
    title: 'إزالة الشعر',
    description: 'تقنيات متطورة لإزالة الشعر بطرق آمنة وفعالة ودائمة',
    icon: <FaLeaf />,
    href: '/services/hair-removal',
    image: '/images/services/service2.png',
  },
  {
    id: 3,
    title: 'تنظيف البشرة',
    description: 'جلسات تنظيف عميق للبشرة لإزالة الشوائب والخلايا الميتة',
    icon: <FaMagic />,
    href: '/services/deep-cleaning',
    image: '/images/services/service3.png',
  },
  {
    id: 4,
    title: 'علاج حب الشباب',
    description: 'برامج متكاملة لعلاج حب الشباب والندبات بأحدث التقنيات',
    icon: <FaGem />,
    href: '/services/acne-treatment',
    image: '/images/services/service4.png',
  },
  {
    id: 5,
    title: 'تفتيح البشرة',
    description: 'علاجات فعالة لتفتيح البشرة وتوحيد لونها وإزالة التصبغات',
    icon: <FaHeart />,
    href: '/services/skin-lightening',
    image: '/images/services/service6.png',
  },
  {
    id: 1,
    title: 'العناية بالبشرة',
    description: 'علاجات متخصصة للبشرة تناسب جميع أنواع البشرة وتعالج مشاكلها المختلفة',
    icon: <FaSpa />,
    href: '/services/skincare',
    image: '/images/services/service5.png',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">خدماتنا</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            نقدم مجموعة متكاملة من خدمات العناية بالبشرة وإزالة الشعر بأحدث التقنيات وأيدي خبيرة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              href={service.href}
              image={service.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 