import type { KeplrIntereactionOptions } from "@keplr-wallet/types";

import { useGrazInternalStore } from "../../store";
import type { Wallet } from "../../types/wallet";
import { clearSession } from ".";
/**
 * Function to return okxwallet object (which is {@link Wallet}) and throws and error if it does not exist on `window`.
 *
 * @example
 * ```ts
 * try {
 *   const okxWallet = getOkx();
 * } catch (error: Error) {
 *   console.error(error.message);
 * }
 * ```
 *
 * @see https://www.okx.com/web3/build/docs/sdks/chains/cosmos/provider
 */
export const getOkx = (): Wallet => {
  if (typeof window.okxwallet?.keplr !== "undefined") {
    const okxWallet = window.okxwallet.keplr;
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        clearSession();
        reconnect();
      };
      window.okxwallet?.on("accountsChanged", listener);
      return () => {
        window.okxwallet?.removeListener("accountsChanged", listener);
      };
    };

    const setDefaultOptions = (options: KeplrIntereactionOptions) => {
      okxWallet.defaultOptions = options;
    };

    // TODO: CHECK IF THIS IS THE CORRECT WAY TO CAST
    const res = Object.assign(okxWallet, {
      subscription,
      setDefaultOptions,
    }) as unknown as Wallet;
    return res;
  }

  useGrazInternalStore.getState()._notFoundFn();
  throw new Error("window.okxwallet.keplr is not defined");
};
