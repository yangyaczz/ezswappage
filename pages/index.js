import { useRouter } from "next/router";
import { useEffect } from "react";
import nextConfig from "../next.config.js";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log('router', router)
    if (router.asPath === "/#/launchpadList") {
      const isProd = nextConfig.publicRuntimeConfig.env.API === "dev2";
      if (isProd) {
        window.location.href = 'https://ezswap.io/#/launchpadList'
      } else {
        window.location.href = 'https://test.ezswap.io/#/launchpadList'
      }
    }else if (router.asPath.indexOf("/#/launchpad/mint")!== -1){
      const isProd = nextConfig.publicRuntimeConfig.env.API === "dev2";
      if (isProd) {
        window.location.href = 'https://ezswap.io'+router.asPath
      } else {
        window.location.href = 'https://test.ezswap.io'+router.asPath
      }
    } else {
      router.replace("/swap");
    }
  }, []);

  return null;
}
