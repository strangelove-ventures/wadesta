import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GrazProvider } from "graz";
import { cosmoshub } from "graz/chains";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GrazProvider
        grazOptions={{
          chains: [cosmoshub],
          capsuleConfig: {
            apiKey: import.meta.env.VITE_CAPSULE_API_KEY as string,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            env: (import.meta.env.VITE_CAPSULE_ENV as "DEV" | "SANDBOX" | "BETA" | "PROD") || "DEV",
          },
        }}
      >
        <App />
      </GrazProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
