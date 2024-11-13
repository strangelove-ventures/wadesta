import { Button, ButtonGroup, Stack, Text } from "@chakra-ui/react";
import { useAccount, useConnect, useSuggestChain, useSuggestChainAndConnect, WalletType } from "graz";
import { coreumtestnet } from "graz/chains";
import type { FC } from "react";

export const ChainSwitcher: FC = () => {
  const {
    isConnecting,
    isReconnecting,
    data: account,
  } = useAccount({
    chainId: coreumtestnet.chainId,
  });

  // const { connect, error } = useConnect();
  const { suggestAndConnect, error } = useSuggestChainAndConnect();
  return (
    <Stack spacing={4}>
      <Text>Suggest and connect chain </Text>
      <Text>{ error?.message }</Text>
      {account ? <Text>Address: {account.bech32Address}</Text> : null}
      <ButtonGroup isDisabled={isConnecting || isReconnecting} size="sm">
        <Button
          colorScheme={account ? "green" : "gray"}
          onClick={() =>
            suggestAndConnect({
              chainInfo: coreumtestnet,
              walletType: WalletType.WC_KEPLR_MOBILE,
            })
          }
        >
          {coreumtestnet.chainId}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
