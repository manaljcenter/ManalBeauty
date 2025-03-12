'use client';

import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

// Define the price categories and services
export const priceCategories = [
  {
    id: 1,
    title: 'الهيدرافيشيال',
    services: [
      { name: 'هيدرافيشيال أساسي', price: '150 د.ل' },
      { name: 'تقنية الهيدرافيشيال المتقدمة', price: '250 د.ل' },
    ]
  },
  {
    id: 2,
    title: 'الإكسوسوم (Exosomes)',
    services: [
      { name: 'جلسة إكسوسوم', price: '800 د.ل' },
    ]
  },
  {
    id: 3,
    title: 'خدمات أخرى',
    services: [
      { name: 'سكين بوستر (Skin Booster)', price: 'حسب الاتفاق' },
      { name: 'ميزوثيرابي (Mesotherapy)', price: 'حسب الاتفاق' },
      { name: 'سلمون DNA', price: 'حسب الاتفاق' },
      { name: 'ديرما بن (Microneedling)', price: 'حسب الاتفاق' },
    ]
  },
  {
    id: 4,
    title: 'ليبوليس (Lipolysis)',
    services: [
      { name: 'ليبوليس الوجه', price: '100 د.ل' },
      { name: 'ليبوليس المعدة', price: '250 د.ل' },
      { name: 'ليبوليس اليدين', price: '250 د.ل' },
    ]
  },
  {
    id: 5,
    title: 'جلسات التخسيس والعلاج',
    services: [
      { name: 'جلسة كريو (Cryotherapy)', price: '150 د.ل' },
      { name: 'جلسة كافيتيشن (Cavitation)', price: '120 د.ل' },
      { name: 'حزمة كريو (2 جلسة) + كافيتيشن (5 جلسات)', price: '850 د.ل' },
    ]
  },
  {
    id: 6,
    title: 'الليزر',
    services: [
      { name: 'ليزر اليد', price: '300 د.ل' },
      { name: 'ليزر الوجه', price: '150 د.ل' },
      { name: 'ليزر الأذنين', price: '80 د.ل' },
      { name: 'ليزر المعدة', price: '100 د.ل' },
      { name: 'ليزر الساق', price: '350 د.ل' },
    ]
  },
];

interface PriceListProps {
  showHeader?: boolean;
  className?: string;
}

const PriceList = ({ showHeader = true, className = "" }: PriceListProps) => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggleCategory = (categoryId: number) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="section-title">قائمة الخدمات والأسعار</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              نقدم مجموعة متنوعة من الخدمات بأسعار تنافسية وجودة عالية
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {priceCategories.map((category) => (
            <div key={category.id} className="mb-6 bg-secondary/5 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex justify-between items-center p-4 bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <h3 className="text-xl font-bold">{category.title}</h3>
                {expandedCategory === category.id ? (
                  <FaAngleUp className="text-xl" />
                ) : (
                  <FaAngleDown className="text-xl" />
                )}
              </button>
              
              {expandedCategory === category.id && (
                <div className="p-4">
                  <table className="w-full">
                    <tbody>
                      {category.services.map((service, index) => (
                        <tr 
                          key={index}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-secondary/5'
                          }`}
                        >
                          <td className="py-3 px-4 border-b border-gray-100">{service.name}</td>
                          <td className="py-3 px-4 border-b border-gray-100 text-left font-bold text-primary" dir="ltr">
                            {service.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceList; 