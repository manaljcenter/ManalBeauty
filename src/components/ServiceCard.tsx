import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  image?: string;
}

const ServiceCard = ({ title, description, icon, href, image }: ServiceCardProps) => {
  return (
    <div className="card group hover:border-primary hover:border transition-all overflow-hidden">
      {image && (
        <div className="w-full h-48 relative mb-4 overflow-hidden rounded-t-lg -mt-4 -mx-4 mb-6">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-500"
            key={`service-card-image-${title}-${Date.now()}`}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      <div className="flex flex-col items-center text-center">
        <div className="text-primary mb-4 text-4xl">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-foreground/80 mb-4">{description}</p>
        <Link
          href={href}
          className="text-primary font-medium hover:text-accent transition-colors"
        >
          المزيد من التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard; 