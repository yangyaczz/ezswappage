import {Html, Head, Main, NextScript} from "next/document";
import Link from "next/link";

export default function Document() {
    return (
        <Html lang="en" data-theme="light">
            <Head>
                <script async src={"https://www.googletagmanager.com/gtag/js?id=G-YS5GX3MSFL"}></script>
                <script>
                    {`
                    window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                
                        gtag('config', 'G-7P5EDRDXWH');
                    `}
                </script>
                <link rel="shortcut icon" href="/CleanNoword.svg"/>
                {" "}
                <title>EZSwap</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}
