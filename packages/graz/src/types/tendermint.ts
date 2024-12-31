import type { QueryClient } from "@cosmjs/stargate";
import type { Tendermint34Client, Tendermint37Client } from "@cosmjs/tendermint-rpc";

export type ExtensionSetup<P extends object = object> = (queryClient: QueryClient) => P;
export type TendermintClient = Tendermint37Client | Tendermint34Client;
