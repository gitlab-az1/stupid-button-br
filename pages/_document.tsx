import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';


export default function Document() {
  return (
    <Html lang="pt-BR" dir="ltr">
      <Head>
        {/* <meta charSet="UTF-8" /> */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        <meta httpEquiv="Content-Type" content="text/html" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link
          rel="apple-touch-icon"
          href="/images/logo-icon.svg"
          type="image/svg"
        />
        <link
          rel="shortcut icon"
          href="/images/logo-icon.svg"
          type="image/svg"
        />
      </Head>
      <body className="theme-dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
