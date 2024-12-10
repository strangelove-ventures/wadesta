import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GrazProvider } from "graz";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { chains } from "utils/graz";

const queryClient = new QueryClient();

const theme = extendTheme();

const CustomApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
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
            iframeOptions: {
              allowedIframeParentOrigins: ["https://daodao.zone", "https://dao.daodao.zone", "http://localhost:3000"],
            },
          }}
        >
          <Component {...pageProps} />
        </GrazProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default CustomApp;
