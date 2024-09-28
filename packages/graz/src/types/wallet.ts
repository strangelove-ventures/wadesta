import type { Keplr, KeplrIntereactionOptions, Key } from "@keplr-wallet/types";

export enum WalletType {
  KEPLR = "keplr",
  LEAP = "leap",
  VECTIS = "vectis",
  COSMOSTATION = "cosmostation",
  WALLETCONNECT = "walletconnect",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  WC_KEPLR_MOBILE = "wc_keplr_mobile",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  WC_LEAP_MOBILE = "wc_leap_mobile",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  WC_COSMOSTATION_MOBILE = "wc_cosmostation_mobile",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  WC_CLOT_MOBILE = "wc_clot_mobile",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  METAMASK_SNAP_LEAP = "metamask_snap_leap",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  METAMASK_SNAP_COSMOS = "metamask_snap_cosmos",
  STATION = "station",
  XDEFI = "xdefi",
  CAPSULE = "capsule",
  COSMIFRAME = "cosmiframe",
  COMPASS = "compass",
  INITIA = "initia",
  OKX = "okx",
}

export const WALLET_TYPES = [
  WalletType.KEPLR,
  WalletType.LEAP,
  WalletType.VECTIS,
  WalletType.COSMOSTATION,
  WalletType.WALLETCONNECT,
  WalletType.WC_KEPLR_MOBILE,
  WalletType.WC_LEAP_MOBILE,
  WalletType.WC_COSMOSTATION_MOBILE,
  WalletType.WC_CLOT_MOBILE,
  WalletType.METAMASK_SNAP_LEAP,
  WalletType.STATION,
  WalletType.XDEFI,
  WalletType.CAPSULE,
  WalletType.METAMASK_SNAP_COSMOS,
  WalletType.COSMIFRAME,
  WalletType.COMPASS,
  WalletType.INITIA,
  WalletType.OKX,
];

export type Wallet = Pick<
  Keplr,
  | "enable"
  | "getKey"
  | "getOfflineSigner"
  | "getOfflineSignerAuto"
  | "getOfflineSignerOnlyAmino"
  | "experimentalSuggestChain"
  | "signDirect"
  | "signAmino"
> & {
  signArbitrary?: Keplr["signArbitrary"];
  subscription?: (reconnect: () => void) => () => void;
  init?: () => Promise<unknown>;
  disable?: (chainIds?: string | undefined) => Promise<void>;
  setDefaultOptions?: (options: KeplrIntereactionOptions) => void;
  onAfterLoginSuccessful?: () => Promise<void>;
};

export type SignDirectParams = Parameters<Wallet["signDirect"]>;
export type SignAminoParams = Parameters<Wallet["signAmino"]>;

export type KnownKeys = Record<string, Key>;
