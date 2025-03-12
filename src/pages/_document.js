import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <body>
        <Main />
        <NextScript />
        <style jsx global>{`
          #__next-build-watcher,
          [data-nextjs-dialog-left-right],
          [data-nextjs-dialog],
          [data-nextjs-toast],
          [data-nextjs-refresh] {
            display: none !important;
          }
        `}</style>
      </body>
    </Html>
  )
} 