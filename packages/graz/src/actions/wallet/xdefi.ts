import { useGrazInternalStore } from "../../store";
import type { Wallet } from "../../types/wallet";
import { clearSession } from ".";

/**
 * Function to return xfi object (which is {@link Wallet}) and throws and error if it does not exist on `window`.
 *
 * @example
 * ```ts
 * try {
 *   const xDefi = getXDefi();
 * } catch (error: Error) {
 *   console.error(error.message);
 * }
 * ```
 *
 * @see https://docs.xdefi.io/docs/technical-documentation/xdefi-extension-integration/cosmos
 */
export const getXDefi = (): Wallet => {
  if (typeof window.xfi?.keplr !== "undefined") {
    const xdefi = window.xfi.keplr;
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        clearSession();
        reconnect();
      };
      window.addEventListener("keplr_keystorechange", listener);
      return () => {
        window.removeEventListener("keplr_keystorechange", listener);
      };
    };
    // TODO: CHECK IF THIS IS THE CORRECT WAY TO CAST
    const res = Object.assign(xdefi, {
      subscription,
    }) as unknown as Wallet;

    return res;
  }

  useGrazInternalStore.getState()._notFoundFn();
  throw new Error("window.xfi.keplr is not defined");
};
