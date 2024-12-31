import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";

import { checkWallet } from "../actions/wallet";
import { useGrazInternalStore } from "../store";
import { WalletType } from "../types/wallet";

/**
 * graz hook to retrieve current active {@link WalletType}
 *
 * @example
 * ```ts
 * import { useActiveWalletType } from "graz";
 * const { walletType } = useActiveWalletType();
 * ```
 */
export const useActiveWalletType = () => {
  return useGrazInternalStore(
    (x) => ({
      walletType: x.walletType,
      isCosmostation: x.walletType === WalletType.COSMOSTATION,
      isCosmostationMobile: x.walletType === WalletType.WC_COSMOSTATION_MOBILE,
      isKeplr: x.walletType === WalletType.KEPLR,
      isKeplrMobile: x.walletType === WalletType.WC_KEPLR_MOBILE,
      isLeap: x.walletType === WalletType.LEAP,
      isLeapMobile: x.walletType === WalletType.WC_LEAP_MOBILE,
      isVectis: x.walletType === WalletType.VECTIS,
      isWalletConnect: x.walletType === WalletType.WALLETCONNECT,
      isMetamaskSnapLeap: x.walletType === WalletType.METAMASK_SNAP_LEAP,
      isStation: x.walletType === WalletType.STATION,
      isCapsule: x.walletType === WalletType.CAPSULE,
      isCosmiframe: x.walletType === WalletType.COSMIFRAME,
    }),
    shallow,
  );
};

/**
 * graz query hook to check whether given {@link WalletType} or default configured wallet is supported
 *
 * @example
 * ```ts
 * import { useCheckWallet } from "graz";
 *
 * const { data: isSupported } = useCheckWallet();
 * const { data: isKeplrSupported } = useCheckWallet("keplr");
 * ```
 */
export const useCheckWallet = (type?: WalletType): UseQueryResult<boolean> => {
  const walletType = useGrazInternalStore((x) => type || x.walletType);

  const queryKey = ["USE_CHECK_WALLET", walletType] as const;
  const query = useQuery({
    queryKey,
    queryFn: ({ queryKey: [, _type] }) => checkWallet(_type),
  });

  return query;
};
