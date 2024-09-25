import {
  type AminoSignResponse,
  encodeEd25519Pubkey,
  encodeSecp256k1Pubkey,
  pubkeyType,
  StdSignature,
} from "@cosmjs/amino";
import { fromBech32 } from "@cosmjs/encoding";
import type { DirectSignResponse } from "@cosmjs/proto-signing";
import type { Keplr, Key } from "@keplr-wallet/types";

import { RECONNECT_SESSION_KEY } from "../../constant";
import { useGrazInternalStore, useGrazSessionStore } from "../../store";
import type { SignAminoParams, SignDirectParams, Wallet } from "../../types/wallet";
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

  const onAfterLoginSuccessful = async () => {
    const client = useGrazSessionStore.getState().capsuleClient;
    const { chains } = useGrazInternalStore.getState();
    if (!client) throw new Error("Capsule client is not initialized");
    if (!chains) throw new Error("Chains are not set");
    await client.enable();
    const chainIds = useGrazInternalStore.getState().capsuleState?.chainId;
    if (!chainIds) throw new Error("Chain ids are not set");
    const resultAcccounts = Object.fromEntries(
      await Promise.all(
        chainIds.map(async (chainId): Promise<[string, Key]> => {
          const account = await client.getAccount(chainId);
          return [
            chainId,
            {
              address: fromBech32(account.address).data,
              bech32Address: account.address,
              algo: account.algo,
              name: account.username || "",
              pubKey: account.pubkey,
              isKeystone: false,
              isNanoLedger: false,
            },
          ];
        }),
      ),
    );
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

  const getOfflineSignerAmino = (chainId: string) => {
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    return client.getOfflineSignerAmino(chainId);
  };

  const getOfflineSignerDirect = (chainId: string) => {
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    return client.getOfflineSignerDirect(chainId);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const getOfflineSignerAuto = async (chainId: string) => {
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    return client.getOfflineSignerDirect(chainId);
  };

  const signDirect = async (...args: SignDirectParams): Promise<DirectSignResponse> => {
    const [chainId, signer, signDoc] = args;
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    return client.signDirect(chainId, signer, {
      bodyBytes: signDoc.bodyBytes!,
      authInfoBytes: signDoc.authInfoBytes!,
      chainId: signDoc.chainId!,
      accountNumber: signDoc.accountNumber!,
    }) as Promise<DirectSignResponse>;
  };

  const signAmino = async (...args: SignAminoParams): Promise<AminoSignResponse> => {
    const [chainId, signer, signDoc, signOptions] = args;
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    return client.signAmino(chainId, signer, signDoc, signOptions) as Promise<AminoSignResponse>;
  };

  const signArbitrary = async (chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature> => {
    const client = useGrazSessionStore.getState().capsuleClient;
    if (!client) throw new Error("Capsule client is not initialized");
    const account = await client.getAccount(chainId);
    if (!account) {
      throw new Error(`Wallet not connected to account ${signer}`);
    }
    const pubkey = (() => {
      switch (account.algo) {
        case "secp256k1":
          return encodeSecp256k1Pubkey(account.pubkey);
        case "ed25519":
          return encodeEd25519Pubkey(account.pubkey);
        default:
          throw new Error("sr25519 public key algorithm is not supported");
      }
    })();

    const signature = await client.signArbitrary(chainId, signer, data);

    return {
      signature,
      pub_key: {
        type: account.algo === "secp256k1" ? pubkeyType.secp256k1 : pubkeyType.ed25519,
        value: pubkey.value,
      },
    };
  };

  const experimentalSuggestChain = async (..._args: Parameters<Keplr["experimentalSuggestChain"]>) => {
    await Promise.reject(new Error("Capsule does not support experimentalSuggestChain"));
  };

  return {
    init,
    enable,
    onAfterLoginSuccessful,
    getKey,
    getOfflineSignerAuto,
    getOfflineSignerDirect,
    signDirect,
    signAmino,
    signArbitrary,
    experimentalSuggestChain,
    // @ts-expect-error - CapsuleAminoSigner | OfflineDirectSigner
    getOfflineSigner,
    getOfflineSignerAmino,
  };
};
