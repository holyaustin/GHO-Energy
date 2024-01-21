/* eslint-disable no-inline-comments */
// Core
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import { Header } from "../components/Header";

// Others
import Providers from "./Providers";
import Router from "./Router";
import { Footer } from "components/Footer";

import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  //ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { sepolia, avalanche, mainnet } from "viem/chains";

const chains = [sepolia, avalanche, mainnet];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId:
      "https://eth-sepolia.g.alchemy.com/v2/CIYHbQv0n3hOZohiig6cAApQqgnGIpFx", // or infuraId
    walletConnectProjectId: "f66d8bf3b0b7b701ae54ff5adf091b7c",

    // Required
    appName: "Gho-Energy",

    // Optional
    appDescription: "Gho-Energy is a web3 sustainable energy DAO",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains, //adding chains to Family
  })
);

//const wagmiConfig = defaultWagmiConfig({ chains, config });

const App = () => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <BrowserRouter>
          <Providers>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Header />
            <Router />
            <Footer />
          </Providers>
        </BrowserRouter>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
