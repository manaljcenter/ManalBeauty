import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

declare module 'next' {
  export interface PageProps {
    params: Params;
    searchParams: { [key: string]: string | string[] | undefined };
  }
}

// Define common param types
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