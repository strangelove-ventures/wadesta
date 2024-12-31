import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GrazProvider } from "graz";
import type { AppProps } from "next/app";
import { Layout } from "src/ui/layout";
import { mainnetChains } from "src/utils/graz";

const queryClient = new QueryClient();

const theme = extendTheme({
  semanticTokens: {
    colors: {
      baseBackground: {
        default: "blackAlpha.100",
        _dark: "whiteAlpha.100",
      },
      baseHoverBackground: {
        default: "blackAlpha.200",
        _dark: "whiteAlpha.200",
      },
    },
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GrazProvider
        grazOptions={{
          chains: mainnetChains,
          walletConnect: {
            options: {
              projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
            },
          },
          capsuleConfig: {
            apiKey: process.env.NEXT_PUBLIC_CAPSULE_API_KEY,
            env: process.env.NEXT_PUBLIC_CAPSULE_ENV,
          },
          walletDefaultOptions: {
            sign: {
              preferNoSetFee: true,
            },
          },
          iframeOptions: {
            allowedIframeParentOrigins: ["https://daodao.zone", "https://dao.daodao.zone"],
          },
        }}
      >
        <ChakraProvider resetCSS theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </GrazProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
