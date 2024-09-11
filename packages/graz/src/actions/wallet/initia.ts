import type { OfflineAminoSigner, StdSignature } from "@cosmjs/amino";
import type { OfflineDirectSigner } from "@cosmjs/proto-signing";
import type { DeliverTxResponse } from "@cosmjs/stargate";
import type { Chain } from "@initia/initia-registry-types";
import type { ChainInfo } from "@keplr-wallet/types";

import { useGrazInternalStore } from "../../store";
import type { SignAminoParams, SignDirectParams, Wallet } from "../../types/wallet";
import { clearSession } from ".";

export interface InitiaWallet {
  version: string;
  getVersion: () => Promise<string>;
  getAddress: (chainId?: string) => Promise<string>;
  getOfflineSigner: (chainId: string) => OfflineDirectSigner;
  getOfflineSignerOnlyAmino: (chainId: string) => OfflineAminoSigner;
  requestAddInitiaLayer: (chain: Partial<Chain>) => Promise<void>;
  signAndBroadcastSync: (chainId: string, txBody: Uint8Array, gas: number) => Promise<string>;
  signAndBroadcastBlock: (chainId: string, txBody: Uint8Array, gas: number) => Promise<DeliverTxResponse>;
  signArbitrary: (data: string | Uint8Array) => Promise<string>;
  verifyArbitrary: (data: string | Uint8Array, signature: string) => Promise<boolean>;
}

const getDirectSignDoc = (signDoc: SignDirectParams[2]) => {
  const { bodyBytes, authInfoBytes, chainId, accountNumber } = signDoc;

  if (!bodyBytes || !authInfoBytes || !chainId || !accountNumber) {
    throw new Error("Invalid sign doc");
  }

  return {
    bodyBytes,
    authInfoBytes,
    chainId,
    accountNumber,
  };
};

export const getInitia = (): Wallet => {
  if (typeof window.initia !== "undefined") {
    const initia = window.initia;

    const enable = async () => {
      // connects to Initia chain when no chain ID is passed
      await initia.getAddress();
    };

    const getKey = (chainId: string) => {
      // TODO: needs update from initia wallet for the method
      throw new Error("getKey not supported by initia wallet");
    };

    const getOfflineSigner = (chainId: string) => {
      const directSigner = initia.getOfflineSigner(chainId);
      const aminoSigner = initia.getOfflineSignerOnlyAmino(chainId);

      return {
        ...directSigner,
        ...aminoSigner,
      };
    };

    const getOfflineSignerAuto = (chainId: string) => {
      return Promise.resolve(initia.getOfflineSigner(chainId));
    };

    const getOfflineSignerOnlyAmino = (chainId: string) => {
      return initia.getOfflineSignerOnlyAmino(chainId);
    };

    const experimentalSuggestChain = (chain: ChainInfo) => {
      return initia.requestAddInitiaLayer({
        chain_id: chain.chainId,
        chain_name: chain.chainName,
        bech32_prefix: "init",
        bech32_config: chain.bech32Config,
        slip44: chain.bip44.coinType,
        logo_URIs: {
          png: chain.chainSymbolImageUrl,
        },
        fees: {
          fee_tokens: chain.feeCurrencies.map((feeCurrency) => ({
            denom: feeCurrency.coinDenom,
            amount: feeCurrency.coinMinimalDenom,
            low_gas_price: feeCurrency.gasPriceStep?.low,
            average_gas_price: feeCurrency.gasPriceStep?.average,
            high_gas_price: feeCurrency.gasPriceStep?.high,
          })),
        },
        apis: {
          rpc: [
            {
              address: chain.rpc,
            },
          ],
          rest: [
            {
              address: chain.rest,
            },
          ],
        },
      });
    };

    const signDirect = (...args: SignDirectParams) => {
      const [chainId, signer, signDoc] = args;
      const directSigner = initia.getOfflineSigner(chainId);
      return directSigner.signDirect(signer, getDirectSignDoc(signDoc));
    };

    const signAmino = (...args: SignAminoParams) => {
      const [chainId, signer, signDoc] = args;
      const aminoSigner = initia.getOfflineSignerOnlyAmino(chainId);
      return aminoSigner.signAmino(signer, signDoc);
    };

    const signArbitrary = (chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature> => {
      throw new Error("signArbitrary not supported by initia wallet");
      // TODO: needs return type update from initia wallet
      // return initia.signArbitrary(data);
    };

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

    return Object.assign(initia, {
      enable,
      getKey,
      getOfflineSigner,
      getOfflineSignerAuto,
      getOfflineSignerOnlyAmino,
      experimentalSuggestChain,
      signDirect,
      signAmino,
      signArbitrary,
      subscription,
    });
  }
  useGrazInternalStore.getState()._notFoundFn();
  throw new Error("window.initia is not defined");
};
