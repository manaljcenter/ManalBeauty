import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "مركز منال الجمال للعناية بالبشرة وإزالة الشعر",
  description: "مركز متخصص في العناية بالبشرة وإزالة الشعر في ليبيا، نقدم خدمات متميزة بأيدي خبراء متخصصين",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    apple: {
      url: '/images/logo.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <style>{`
          #__next-build-watcher,
          [data-nextjs-dialog-left-right],
          [data-nextjs-dialog],
          [data-nextjs-toast],
          [data-nextjs-refresh] {
            display: none !important;
          }
        `}</style>
      </head>
      <body
        className={`${almarai.variable} font-almarai antialiased`}
      >
        {children}
        <Script id="remove-nextjs-icon" strategy="afterInteractive">
          {`
            (function() {
              function removeNextJsElements() {
                const elements = document.querySelectorAll('#__next-build-watcher, [data-nextjs-dialog-left-right], [data-nextjs-dialog], [data-nextjs-toast], [data-nextjs-refresh]');
                elements.forEach(el => el.remove());
              }
              
              // Run immediately
              removeNextJsElements();
              
              // Also run after a short delay to catch elements that might be added later
              setTimeout(removeNextJsElements, 1000);
              
              // Set up a mutation observer to catch any future additions
              const observer = new MutationObserver(function(mutations) {
                removeNextJsElements();
              });
              
              observer.observe(document.body, { childList: true, subtree: true });
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
