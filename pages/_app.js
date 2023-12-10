import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {WagmiConfig, chain, configureChains, createClient, useNetwork} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon } from "wagmi/chains";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import NavBar from "@/components/bar/NavBar";
import { CollectionProvider } from "@/contexts/CollectionContext";
import { StrictMode } from "react";
import nextConfig from "../next.config.js";

const mantatest = {
  id: 3441005,
  name: "Manta Testnet",
  network: "Manta Testnet",
  iconBackground: "#008000",
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
    }
  },
  testnet: true,
};

const eosevmmain = {
  id: 17777,
  name: "EOS EVM",
  network: "EOS EVM",
  iconBackground: "#008000",
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
    }
  },
  testnet: false,
};
//  [mantatest, mantamain, eosevmtest, eosevmmain],
const { chains, provider } = configureChains(
    nextConfig.publicRuntimeConfig.env.API === 'prod' ? [mantamain, eosevmmain] : [mantatest, mantamain, eosevmtest, eosevmmain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "xxx",
  chains,
});

const wagmiClinet = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClinet}>
      <RainbowKitProvider chains={chains}>
        <div className="grid grid-rows-[126px,auto] auto-cols-auto h-full">
          <NavBar></NavBar>
          <CollectionProvider>
            <Component {...pageProps} />
          </CollectionProvider>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
