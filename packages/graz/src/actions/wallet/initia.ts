import type { OfflineDirectSigner } from "@cosmjs/proto-signing";
import type { DeliverTxResponse } from "@cosmjs/stargate";
import type { Chain } from "@initia/initia-registry-types";

import { useGrazInternalStore } from "../../store";
import type { SignAminoParams, SignDirectParams, Wallet } from "../../types/wallet";
import { clearSession } from ".";

export interface InitiaWallet {
  version: string;
  getAddress: (chainId: string) => Promise<string>;
  signAndBroadcast: (chainId: string, txBody: Uint8Array) => Promise<DeliverTxResponse>;
  getOfflineSigner: (chainId: string) => OfflineDirectSigner;
  requestAddInitiaLayer: (chain: Partial<Chain>) => Promise<void>;
  signArbitrary: (data: string | Uint8Array) => Promise<string>;
  verifyArbitrary: (data: string | Uint8Array, signature: string) => Promise<boolean>;
}

export const getInitia = (): Wallet => {
  if (typeof window.initia !== "undefined") {
    const initia = window.initia;

    const enable = async () => {};
    const getKey = async (chainId: string) => {};
    const getOfflineSigner = (chainId: string) => {};
    const getOfflineSignerAuto = async (chainId: string) => {};
    const getOfflineSignerOnlyAmino = (chainId: string) => {};
    const experimentalSuggestChain = (chain: Partial<Chain>) => {};
    const signDirect = async (...args: SignDirectParams) => {};
    const signAmino = async (...args: SignAminoParams) => {};

    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        clearSession();
        reconnect();
      };
      window.addEventListener("initia_keystorechange", listener);
      return () => {
        window.removeEventListener("initia_keystorechange", listener);
      };
    };
  }
  useGrazInternalStore.getState()._notFoundFn();
  throw new Error("window.initia is not defined");
};
