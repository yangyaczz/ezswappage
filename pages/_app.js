import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  bitgetWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  tokenPocketWallet
} from "@rainbow-me/rainbowkit/wallets";
import NavBar from "@/components/bar/NavBar";
import { CollectionProvider } from "@/contexts/CollectionContext";
import { StrictMode } from "react";
import nextConfig from "../next.config.js";
import { Wallet } from "ethers";
import { LanguageProvider } from "@/contexts/LanguageContext.js";
import { mainnet, arbitrum, polygon } from "wagmi/chains";
require("dotenv").config();

const mantatest = {
  id: 3441005,
  name: "Manta Testnet",
  network: "Manta Testnet",
  iconBackground: "#008000",
  iconUrl:"/manta.jpg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://manta-testnet.calderachain.xyz/http"] },
    default: { http: ["https://manta-testnet.calderachain.xyz/http"] },
  },
  blockExplorers: {
    default: {
      name: "pacific",
      url: "https://pacific-explorer.testnet.manta.network/",
    },
    etherscan: {
      name: "pacific",
      url: "https://pacific-explorer.testnet.manta.network/",
    },
  },
  testnet: true,
};

const mantamain = {
  id: 169,
  name: "Manta Pacific",
  network: "Manta Pacific",
  iconBackground: "#008000",
  iconUrl:"/manta.jpg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://pacific-rpc.manta.network/http"] },
    default: { http: ["https://pacific-rpc.manta.network/http"] },
  },
  blockExplorers: {
    default: {
      name: "pacific",
      url: "https://pacific-explorer.manta.network/",
    },
    etherscan: {
      name: "pacific",
      url: "https://pacific-explorer.manta.network/",
    },
  },
  testnet: false,
};

const eosevmtest = {
  id: 15557,
  name: "EOS EVM Testnet",
  network: "EOS EVM Testnet",
  iconBackground: "#008000",
  iconUrl:"/eos_chain.jpg",
  nativeCurrency: {
    decimals: 18,
    name: "EOS",
    symbol: "EOS",
  },
  rpcUrls: {
    public: { http: ["https://api.testnet.evm.eosnetwork.com/"] },
    default: { http: ["https://api.testnet.evm.eosnetwork.com/"] },
  },
  blockExplorers: {
    default: {
      name: "Block Explorer",
      url: "https://explorer.testnet.evm.eosnetwork.com/",
    },
  },
  testnet: true,
};

const eosevmmain = {
  id: 17777,
  name: "EOS EVM",
  network: "EOS EVM",
  iconBackground: "#008000",
  iconUrl:"/eos_chain.jpg",
  nativeCurrency: {
    decimals: 18,
    name: "EOS",
    symbol: "EOS",
  },
  rpcUrls: {
    public: { http: ["https://api.evm.eosnetwork.com/"] },
    default: { http: ["https://api.evm.eosnetwork.com/"] },
  },
  blockExplorers: {
    default: {
      name: "Block Explorer",
      url: "https://explorer.evm.eosnetwork.com/",
    },
  },
  testnet: false,
};


//  [mantatest, mantamain, eosevmtest, eosevmmain],

//old wagmi and rainbow kit versions
//----------------------------------------------------------------------------------

// const { chains, provider } = configureChains(
//     nextConfig.publicRuntimeConfig.env.API === 'prod' ? [mantamain, eosevmmain] : [mantatest, mantamain, eosevmtest, eosevmmain],
//   [publicProvider()]
// );

// const { connectors } = getDefaultWallets({
//   appName: "xxx",
//   chains,
// });

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

//latest wagmi and rainbow kit versions
//----------------------------------------------------------------------
const { chains, publicClient } = configureChains(
  nextConfig.publicRuntimeConfig.env.API === "prod"
    ? [mainnet, arbitrum, mantamain, eosevmmain]
    : [mainnet, arbitrum, mantatest, mantamain, eosevmtest, eosevmmain],
  [publicProvider()]
);

// const { chains, publicClient } = configureChains(
//   nextConfig.publicRuntimeConfig.env.API === "prod"
//     ? [mainnet, arbitrum, manta, mantaTestnet]
//     : [mainnet, arbitrum, manta, mantaTestnet, eos, eosTestnet],
//   [publicProvider()]
// );

console.log(process.env.NEXT_PUBLIC_WALLETCONNECT_ID)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ projectId, chains }),
      metaMaskWallet({ projectId, chains }),
      bitgetWallet({ projectId, chains }),
      tokenPocketWallet({projectId,chains}),
      walletConnectWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <LanguageProvider>
          <div className="grid h-full grid-rows-[80px,auto] sm:grid-rows-[126px,auto] auto-cols-auto">
            <NavBar></NavBar>
            <CollectionProvider>
              <Component {...pageProps} />
            </CollectionProvider>
          </div>
        </LanguageProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
