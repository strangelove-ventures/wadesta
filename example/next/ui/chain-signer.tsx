import { Button } from "@chakra-ui/react";
import { useAccount, useActiveChains, getRecentChainIds, useCosmWasmSigningClient } from "graz";
import type { ChainInfo } from "@keplr-wallet/types";
import { GasPrice } from '@cosmjs/stargate';
import type { FC } from "react";

export const ChainSigner: FC = () => {
  const activeChains: ChainInfo[] | undefined = useActiveChains();
  const recentChainIds = getRecentChainIds() || [];
  const latestChainId = recentChainIds[recentChainIds.length - 1] || 'cosmoshub-4';
  if (!activeChains) return;
  const activeChain = activeChains?.find(chain => chain.chainId === latestChainId);
  if (!activeChain) return;
  const { coinMinimalDenom: coinAmountDenom } = activeChain?.currencies[0];

  const { data: accountData } = useAccount({
    chainId: latestChainId,
    multiChain: false,
  });

  const { data: signingCosmwasmClient } = useCosmWasmSigningClient({
    chainId: latestChainId,
    opts: {
      gasPrice: GasPrice.fromString('0ustars'),
    },
  });

  const signTx = async () => {
    // Send 1 micro amount of the current chain account
    const { coinMinimalDenom } = activeChain.feeCurrencies[0];
    const msgs = [{"typeUrl":"/cosmos.bank.v1beta1.MsgSend","value":{"fromAddress":accountData.bech32Address,"toAddress":accountData.bech32Address,"amount":[{"amount":"1","denom":coinAmountDenom}]}}]
    const fee = {
      amount: [{amount: '80828', denom: coinMinimalDenom}],
      gas: '80828',
    };

    try {
      await signingCosmwasmClient
        .signAndBroadcast(accountData.bech32Address, msgs, fee, '')
        .then((res: any) => {
          console.log('SUCCESS', res);
        })
    } catch (error: unknown) {
      console.log('ERROR', error);
    }
  }

  return (
    <Button onClick={() => signTx()}>SIGN TX: SEND 1{coinAmountDenom} to {`${accountData.bech32Address}`.substring(0, 10)}...</Button>
  );
};