import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
          <link rel="shortcut icon" href="/CleanNoword.svg" />
        {" "}
        <title>EZSwap</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
