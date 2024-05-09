import { Cosmiframe, isInIframe } from "@dao-dao/cosmiframe";

import { useGrazInternalStore } from "../../store";
import type { Wallet } from "../../types/wallet";

/**
 * Function to return {@link Wallet} object and throws and error if not in an iframe.
 *
 * @example
 * ```ts
 * try {
 *   const cosmiframe = getCosmiframe();
 * } catch (error: Error) {
 *   console.error(error.message);
 * }
 * ```
 *
 *
 */
export const getCosmiframe = (): Wallet => {
  const state = useGrazInternalStore.getState();

  if (!state.iframeOptions) {
    state._notFoundFn();
    throw new Error("no iframe options set");
  }

  if (!isInIframe()) {
    state._notFoundFn();
    throw new Error("not in iframe");
  }

  if (!state.iframeOptions.allowedIframeParentOrigins.length) {
    state._notFoundFn();
    throw new Error("no iframe allowed origins");
  }

  const keplr = new Cosmiframe(state.iframeOptions.allowedIframeParentOrigins).getKeplrClient();

  return {
    enable: keplr.enable.bind(keplr),
    getKey: keplr.getKey.bind(keplr),
    getOfflineSigner: keplr.getOfflineSigner.bind(keplr),
    getOfflineSignerAuto: keplr.getOfflineSignerAuto.bind(keplr),
    getOfflineSignerOnlyAmino: keplr.getOfflineSignerOnlyAmino.bind(keplr),
    experimentalSuggestChain: keplr.experimentalSuggestChain.bind(keplr),
    signDirect: keplr.signDirect.bind(keplr),
    signAmino: keplr.signAmino.bind(keplr),
  };
};
