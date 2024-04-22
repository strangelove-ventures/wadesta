import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { GrazProvider } from "graz";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { chains } from "utils/graz";

const theme = extendTheme();

const CustomApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <GrazProvider
        grazOptions={{
          chains,
          onReconnectFailed: () => {
            console.log("reconnect failed");
          },
          autoReconnect: false,
          walletConnect: {
            options: {
              projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
            },
          },
          capsuleConfig: {
            apiKey: process.env.NEXT_PUBLIC_CAPSULE_API_KEY,
            env: process.env.NEXT_PUBLIC_CAPSULE_ENV,
          },
        }}
      >
        <Component {...pageProps} />
      </GrazProvider>
    </ChakraProvider>
  );
};

export default CustomApp;
