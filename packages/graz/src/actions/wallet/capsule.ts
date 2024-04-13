import { fromBech32, toBech32 } from "@cosmjs/encoding";
import type { Key } from "@keplr-wallet/types";

import { RECONNECT_SESSION_KEY } from "../../constant";
import { useGrazInternalStore, useGrazSessionStore } from "../../store";
import type { Wallet } from "../../types/wallet";
import { WalletType } from "../../types/wallet";

export const getCapsule = (): Wallet => {
  if (!useGrazInternalStore.getState().capsuleConfig?.apiKey || !useGrazInternalStore.getState().capsuleConfig?.env) {
    throw new Error("Capsule configuration is not set");
  }

  const init = async () => {
    const Capsule = (await import("@leapwallet/cosmos-social-login-capsule-provider")).CapsuleProvider;
    const client = new Capsule({
      apiKey: useGrazInternalStore.getState().capsuleConfig?.apiKey,
      env: useGrazInternalStore.getState().capsuleConfig?.env,
    });
    useGrazSessionStore.setState({ capsuleClient: client });
    return client;
  };

  const enable = async (_chainId: string | string[]) => {
    const chainId = typeof _chainId === "string" ? [_chainId] : _chainId;
    let client = useGrazSessionStore.getState().capsuleClient;
    if (!client) {
      client = await init();
    }
    useGrazInternalStore.setState({ capsuleState: { showModal: true, chainId } });
  };

  const onSuccessLogin = async () => {
    const client = useGrazSessionStore.getState().capsuleClient;
    const { chains } = useGrazInternalStore.getState();
    if (!client) throw new Error("Capsule client is not initialized");
    if (!chains) throw new Error("Chains are not set");
    await client.enable();
    const chainIds = useGrazInternalStore.getState().capsuleState?.chainId;
    if (!chainIds) throw new Error("Chain ids are not set");
    const key = await client.getAccount(chainIds[0]!);
    const resultAcccounts: Record<string, Key> = {};
    chainIds.forEach((chainId) => {
      resultAcccounts[chainId] = {
        address: fromBech32(key.address).data,
        bech32Address: toBech32(
          chains.find((x) => x.chainId === chainId)!.bech32Config.bech32PrefixAccAddr,
          fromBech32(key.address).data,
        ),
        algo: key.algo,
        name: key.username || "",
        pubKey: key.pubkey,
        isKeystone: false,
        isNanoLedger: false,
      };
    });
    useGrazSessionStore.setState((prev) => ({
      accounts: { ...(prev.accounts || {}), ...resultAcccounts },
    }));

    useGrazInternalStore.setState((prev) => ({
      recentChainIds: [...(prev.recentChainIds || []), ...chainIds].filter((thing, i, arr) => {
        return arr.indexOf(thing) === i;
      }),
    }));
    useGrazSessionStore.setState((prev) => ({
      activeChainIds: [...(prev.activeChainIds || []), ...chainIds].filter((thing, i, arr) => {
        return arr.indexOf(thing) === i;
      }),
    }));

    useGrazInternalStore.setState({
      walletType: WalletType.CAPSULE,
      _reconnect: false,
      _reconnectConnector: WalletType.CAPSULE,
    });
    useGrazSessionStore.setState({
      status: "connected",
    });
    typeof window !== "undefined" && window.sessionStorage.setItem(RECONNECT_SESSION_KEY, "Active");

    useGrazInternalStore.setState({ capsuleState: null });
  };
  const getKey = async (chainId: string) => {
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    const key = await client.getAccount(chainId);

    return {
      address: fromBech32(key.address).data,
      bech32Address: key.address,
      algo: key.algo,
      name: key.username || "",
      pubKey: key.pubkey,
      isKeystone: false,
      isNanoLedger: false,
    };
  };

  const getOfflineSigner = (chainId: string) => {
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    return client.getOfflineSigner(chainId);
  };

  return {
    init,
    enable,
    onSuccessLogin,
    getKey,
    // @ts-expect-error - CapsuleAminoSigner | OfflineDirectSigner
    getOfflineSigner,
  };
};
