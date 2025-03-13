import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

// Extend the Next.js module to fix the PageProps interface
declare module 'next' {
  export interface PageProps {
    params?: Params;
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}

// Define common param types for use in page components
export interface IdParams {
  params: {
    id: string;
  };
}

export interface SlugParams {
  params: {
    slug: string;
  };
}

export interface CategoryParams {
  params: {
    category: string;
  };
}

// Define common search params type
export interface SearchParamsProps {
  searchParams: { [key: string]: string | string[] | undefined };
} 