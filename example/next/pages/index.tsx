import { Center, HStack, Spacer, Stack, Text, useColorMode } from "@chakra-ui/react";
import { useAccount, getRecentChainIds, useCapsule } from "graz";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { BalanceList } from "ui/balance-list";
import { ChainSwitcher } from "ui/chain-switcher";
import { ChainSigner } from "ui/chain-signer";
import { ConnectButton } from "ui/connect-button";
import { ConnectStatus } from "ui/connect-status";
import { ToggleTheme } from "ui/toggle-theme";

const LeapSocialLogin = dynamic(
  () => import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => m.CustomCapsuleModalView),
  { ssr: false },
);

const HomePage: NextPage = () => {
  const recentChainIds = getRecentChainIds() || [];
  const latestChainId = recentChainIds[recentChainIds.length - 1] || 'cosmoshub-4';
  
  const { data: accountData } = useAccount({
    chainId: latestChainId,
    multiChain: false,
  });
  const { client, modalState, onAfterLoginSuccessful, setModalState, onLoginFailure } = useCapsule();
  const { colorMode } = useColorMode();

  return (
    <Center minH="100vh">
      <Stack bgColor="whiteAlpha.100" boxShadow="md" maxW="md" p={4} rounded="md" spacing={4} w="full">
        <HStack>
          <ConnectStatus />
        </HStack>
        {accountData ? (
          <>
            <Text>
              Wallet name: <b>{accountData.name}</b>
            </Text>
            <Text noOfLines={1} wordBreak="break-all">
              Wallet address: <b>{accountData.bech32Address}</b>
            </Text>

            {latestChainId && <ChainSigner />}

            <BalanceList />
            <ChainSwitcher />
          </>
        ) : null}
        <HStack align="end" pt={4}>
          <ToggleTheme />
          <Spacer />
          <ConnectButton />
        </HStack>
      </Stack>
      <LeapSocialLogin
        capsule={client?.getClient() || undefined}
        onAfterLoginSuccessful={() => {
          void onAfterLoginSuccessful?.();
        }}
        onLoginFailure={() => {
          onLoginFailure();
        }}
        setShowCapsuleModal={setModalState}
        showCapsuleModal={modalState}
        theme={colorMode}
      />
    </Center>
  );
};

export default HomePage;
