import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, chain, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon} from "wagmi/chains";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import NavBar from "@/components/NavBar";

const mantatest = {
  id: 3441005,
  name: 'Manta Testnet L2 Rollup',
  network: 'Manta Testnet L2 Rollup',
  iconBackground: '#008000',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://manta-testnet.calderachain.xyz/http'] },
    default: { http: ['https://manta-testnet.calderachain.xyz/http'] },
  },
  blockExplorers: {
    default: { name: 'pacific', url: 'https://pacific-explorer.manta.network/' },
    etherscan: { name: 'pacific', url: 'https://pacific-explorer.manta.network/' },
  },
  testnet: true,
};

const mantamain = {
  id: 169,
  name: 'Manta Pacific L2 Rollup',
  network: 'Manta Pacific L2 Rollup',
  iconBackground: '#008000',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://pacific-rpc.manta.network/http'] },
    default: { http: ['https://pacific-rpc.manta.network/http'] },
  },
  blockExplorers: {
    default: { name: 'pacific', url: 'https://pacific-explorer.manta.network/' },
    etherscan: { name: 'pacific', url: 'https://pacific-explorer.manta.network/' },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [mantatest, mantamain],
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
        <NavBar></NavBar>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
