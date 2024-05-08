import { Cosmiframe, isInIframe } from "@dao-dao/cosmiframe";

import { useGrazInternalStore } from "../../store";
import type { Wallet } from "../../types/wallet";

/**
 * Function to return {@link Wallet} object and throws and error if not in an iframe.
 *
 * @example
 * ```ts
 * try {
 *   const daoDao = getDaoDao();
 * } catch (error: Error) {
 *   console.error(error.message);
 * }
 * ```
 *
 *
 */
export const getDaoDao = (): Wallet => {
  if (!isInIframe()) {
    useGrazInternalStore.getState()._notFoundFn();
    throw new Error("not in iframe");
  }

  const keplr = new Cosmiframe(["https://daodao.zone", "https://dao.daodao.zone"]).getKeplrClient();

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
