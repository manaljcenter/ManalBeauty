import Image from 'next/image';
import { FaAward, FaCertificate, FaUserMd } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function AboutPage() {
  return (
    <PageTemplate>
      {/* Hero Section */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">عن العيادة</h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              تعرفي على مركز منال الجمال للعناية بالبشرة وإزالة الشعر
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">مركز منال الجمال</h2>
              <p className="mb-4 text-foreground/80">
                تأسس مركز منال الجمال للعناية بالبشرة وإزالة الشعر بهدف تقديم خدمات متميزة في مجال العناية بالبشرة والجمال، حيث نسعى دائماً لتوفير أحدث التقنيات والعلاجات التي تساعد عملائنا على الحصول على بشرة صحية ومشرقة.
              </p>
              <p className="mb-4 text-foreground/80">
                يضم المركز فريقاً من الخبراء والمتخصصين في مجال العناية بالبشرة، ممن يمتلكون خبرة واسعة وشهادات معتمدة في هذا المجال، ويحرصون على تقديم أفضل الخدمات والنصائح لعملائنا.
              </p>
              <p className="text-foreground/80">
                نفتخر في مركز منال الجمال بتقديم خدمات متكاملة تشمل العناية بالبشرة، وإزالة الشعر بالليزر، وعلاجات حب الشباب، وتفتيح البشرة، وغيرها من الخدمات التي تلبي احتياجات عملائنا المختلفة.
              </p>
            </div>
            <div className="bg-secondary/10 p-8 rounded-xl">
              <div className="aspect-w-4 aspect-h-3 rounded-lg mb-6 overflow-hidden relative h-64">
                <Image 
                  src="/images/about-clinic.jpg"
                  alt="مركز منال الجمال"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">رؤيتنا</h3>
              <p className="text-foreground/80 mb-6">
                أن نكون الوجهة الأولى والمفضلة للعناية بالبشرة وإزالة الشعر في ليبيا، من خلال تقديم خدمات ذات جودة عالية وبأسعار مناسبة.
              </p>
              <h3 className="text-xl font-bold text-primary mb-4">رسالتنا</h3>
              <p className="text-foreground/80">
                تقديم خدمات متميزة في مجال العناية بالبشرة وإزالة الشعر باستخدام أحدث التقنيات والمنتجات العالمية، وبأيدي خبراء متخصصين، لمساعدة عملائنا على الحصول على بشرة صحية وجميلة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Profile */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">فريق الخبراء</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              يضم مركزنا نخبة من الخبراء المتخصصين في مجال العناية بالبشرة
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/3 relative">
                  <div className="h-48 md:h-full relative">
                    <Image 
                      src="/images/u6116355524_An_Arab_woman_doctor_in_a_hijab_wearing_a_white_c_730a1dc9-e8e0-4c4b-9a4f-87f8d897452c_0.png"
                      alt="منال الجمال"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="p-8 md:w-2/3">
                  <div className="flex items-center mb-4">
                    <h3 className="text-2xl font-bold text-primary">منال الجمال</h3>
                    <span className="mr-2 bg-primary/10 text-primary text-sm py-1 px-3 rounded-full">
                      المؤسس والمدير
                    </span>
                  </div>
                  <p className="text-foreground/80 mb-4">
                    خبيرة متخصصة في مجال العناية بالبشرة وإزالة الشعر، تمتلك خبرة واسعة تمتد لأكثر من 10 سنوات في هذا المجال. حاصلة على شهادات معتمدة من أفضل المراكز العالمية.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex flex-col items-center p-3 bg-secondary/10 rounded-lg">
                      <FaUserMd className="text-primary text-2xl mb-2" />
                      <span className="text-sm font-medium">خبرة 10+ سنوات</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-secondary/10 rounded-lg">
                      <FaCertificate className="text-primary text-2xl mb-2" />
                      <span className="text-sm font-medium">شهادات معتمدة</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-secondary/10 rounded-lg">
                      <FaAward className="text-primary text-2xl mb-2" />
                      <span className="text-sm font-medium">جوائز التميز</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">شهاداتنا واعتماداتنا</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              نفتخر بحصولنا على العديد من الشهادات والاعتمادات من جهات محلية وعالمية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FaAward className="text-primary text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  شهادة الجودة العالمية
                </h3>
                <p className="text-foreground/80">
                  حصلنا على شهادة الجودة العالمية في مجال العناية بالبشرة وإزالة الشعر
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTemplate>
  );
} 