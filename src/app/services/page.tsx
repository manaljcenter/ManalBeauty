import Link from 'next/link';
import Image from 'next/image';
import { FaSpa, FaLeaf, FaMagic, FaGem, FaHeart, FaStar, FaMoneyBillWave } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';
import PriceList from '@/components/PriceList';

// Define services with prices
const services = [
  {
    id: 6,
    title: 'نضارة البشرة',
    description: 'جلسات متخصصة لتجديد نضارة البشرة وإشراقها',
    icon: <FaStar className="text-5xl mb-4" />,
    features: [
      'جلسات الميزوثيرابي',
      'جلسات الكولاجين',
      'جلسات الفيتامينات',
      'جلسات التنظيف العميق',
      'جلسات الترطيب المكثف',
    ],
    prices: [
      { name: 'سكين بوستر (Skin Booster)', price: 'حسب الاتفاق' },
      { name: 'ميزوثيرابي (Mesotherapy)', price: 'حسب الاتفاق' },
      { name: 'سلمون DNA', price: 'حسب الاتفاق' },
    ],
    href: '/services/skin-rejuvenation',
    image: '/images/services/service1.png',
  },
  {
    id: 2,
    title: 'إزالة الشعر',
    description: 'تقنيات متطورة لإزالة الشعر بطرق آمنة وفعالة ودائمة',
    icon: <FaLeaf className="text-5xl mb-4" />,
    features: [
      'إزالة الشعر بالليزر',
      'إزالة الشعر بالشمع',
      'علاجات ما بعد إزالة الشعر',
    ],
    prices: [
      { name: 'ليزر اليد', price: '300 د.ل' },
      { name: 'ليزر الوجه', price: '150 د.ل' },
      { name: 'ليزر الأذنين', price: '80 د.ل' },
      { name: 'ليزر المعدة', price: '100 د.ل' },
      { name: 'ليزر الساق', price: '350 د.ل' },
    ],
    href: '/services/hair-removal',
    image: '/images/services/service2.png',
  },
  {
    id: 3,
    title: 'تنظيف البشرة',
    description: 'جلسات تنظيف عميق للبشرة لإزالة الشوائب والخلايا الميتة',
    icon: <FaMagic className="text-5xl mb-4" />,
    features: [
      'تنظيف عميق للمسام',
      'إزالة الرؤوس السوداء',
      'تقشير البشرة',
      'تنظيف الوجه بالموجات فوق الصوتية',
      'تنظيف البشرة بالأكسجين',
    ],
    prices: [
      { name: 'هيدرافيشيال أساسي', price: '150 د.ل' },
      { name: 'تقنية الهيدرافيشيال المتقدمة', price: '250 د.ل' },
      { name: 'ديرما بن (Microneedling)', price: 'حسب الاتفاق' },
    ],
    href: '/services/deep-cleaning',
    image: '/images/services/service3.png',
  },
  {
    id: 4,
    title: 'علاج حب الشباب',
    description: 'برامج متكاملة لعلاج حب الشباب والندبات بأحدث التقنيات',
    icon: <FaGem className="text-5xl mb-4" />,
    features: [
      'علاج حب الشباب النشط',
      'علاج ندبات حب الشباب',
      'تقليل إفراز الزيوت',
      'تقليل الالتهابات',
      'علاجات طبية متخصصة',
    ],
    prices: [
      { name: 'جلسة إكسوسوم', price: '800 د.ل' },
      { name: 'هيدرافيشيال أساسي', price: '150 د.ل' },
    ],
    href: '/services/acne-treatment',
    image: '/images/services/service4.png',
  },
  {
    id: 5,
    title: 'تفتيح البشرة',
    description: 'علاجات فعالة لتفتيح البشرة وتوحيد لونها وإزالة التصبغات',
    icon: <FaHeart className="text-5xl mb-4" />,
    features: [
      'علاج التصبغات',
      'توحيد لون البشرة',
      'تفتيح المناطق الداكنة',
      'علاج الكلف والنمش',
      'علاجات طبيعية للتفتيح',
    ],
    prices: [
      { name: 'ليبوليس الوجه', price: '100 د.ل' },
      { name: 'سكين بوستر (Skin Booster)', price: 'حسب الاتفاق' },
    ],
    href: '/services/skin-lightening',
    image: '/images/services/service6.png',
  },
  {
    id: 1,
    title: 'العناية بالبشرة',
    description: 'علاجات متخصصة للبشرة تناسب جميع أنواع البشرة وتعالج مشاكلها المختلفة',
    icon: <FaSpa className="text-5xl mb-4" />,
    features: [
      'تنظيف عميق للبشرة',
      'علاج حب الشباب',
      'تقشير البشرة',
      'ترطيب وتغذية البشرة',
      'علاج مشاكل البشرة المختلفة',
    ],
    prices: [
      { name: 'جلسة كريو (Cryotherapy)', price: '150 د.ل' },
      { name: 'جلسة كافيتيشن (Cavitation)', price: '120 د.ل' },
      { name: 'حزمة كريو (2 جلسة) + كافيتيشن (5 جلسات)', price: '850 د.ل' },
    ],
    href: '/services/skincare',
    image: '/images/services/service5.png',
  },
];

export default function ServicesPage() {
  return (
    <PageTemplate>
      {/* Hero Section */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">خدماتنا</h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من خدمات العناية بالبشرة وإزالة الشعر بأحدث التقنيات وأيدي خبيرة
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center`}
              >
                <div className="w-full md:w-1/2 bg-secondary/10 p-8 rounded-xl flex flex-col items-center text-center">
                  <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      key={`service-image-${service.id}-${Date.now()}`}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="text-primary">
                    {service.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-4">{service.title}</h2>
                  <p className="text-foreground/80 mb-6">{service.description}</p>
                  <Link
                    href="/booking"
                    className="btn-primary"
                  >
                    احجز موعدك الآن
                  </Link>
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-bold text-primary mb-4">مميزات الخدمة</h3>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="bg-primary/10 text-primary p-1 rounded-full ml-3 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Prices Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                      <FaMoneyBillWave className="ml-2 text-primary" />
                      الأسعار
                    </h3>
                    <div className="bg-secondary/5 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {service.prices.map((price, i) => (
                            <tr 
                              key={i}
                              className={`${
                                i % 2 === 0 ? 'bg-white' : 'bg-secondary/5'
                              }`}
                            >
                              <td className="py-3 px-4 border-b border-gray-100">{price.name}</td>
                              <td className="py-3 px-4 border-b border-gray-100 text-left font-bold text-primary" dir="ltr">
                                {price.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <a
                      href={`https://wa.me/218924275555?text=أرغب في الاستفسار عن خدمة ${service.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:text-accent transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      استفسر عن الخدمة عبر واتساب
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Price List Section */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">قائمة الخدمات والأسعار الكاملة</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              تعرف على جميع خدماتنا وأسعارها التفصيلية
            </p>
          </div>
          
          <PriceList showHeader={false} className="bg-transparent" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">هل أنت مستعدة للحصول على بشرة مثالية؟</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            احجزي موعدك الآن واستمتعي بخدماتنا المتميزة على يد خبراء متخصصين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-white text-primary hover:bg-secondary hover:text-white transition-colors py-3 px-6 rounded-xl font-bold"
            >
              احجزي موعدك الآن
            </Link>
            <Link
              href="/contact"
              className="bg-white/20 hover:bg-white/30 transition-colors py-3 px-6 rounded-xl font-bold"
            >
              تواصلي معنا
            </Link>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
} 