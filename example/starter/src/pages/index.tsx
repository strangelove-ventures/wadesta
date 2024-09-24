import { Stack, useColorMode } from "@chakra-ui/react";
import { useCapsule } from "graz";
import dynamic from "next/dynamic";
import { Card } from "src/ui/card/chain";
import { mainnetChains } from "src/utils/graz";
import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";

const LeapSocialLogin = dynamic(
  () => import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => m.CustomCapsuleModalView),
  { ssr: false },
);

const HomePage = () => {
  const { client, modalState, onAfterLoginSuccessful, setModalState, onLoginFailure } = useCapsule();

  const { colorMode } = useColorMode();
  return (
    <>
      <Stack spacing={4}>
        {mainnetChains.map((chain) => (
          <Card key={chain.chainId} chain={chain} />
        ))}
      </Stack>
      <div className='leap-ui'>
        <LeapSocialLogin
          capsule={client?.getClient() || undefined}
          // @ts-expect-error - type error
          oAuthMethods={["GOOGLE", "FACEBOOK", "TWITTER", "DISCORD", "APPLE"]}
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
      </div>
    </>
  );
};

export default HomePage;
