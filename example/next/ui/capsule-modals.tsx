import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";

import { useColorMode } from "@chakra-ui/react";
import { useCapsule } from "graz";
import dynamic from "next/dynamic";
import React from "react";

const LeapSocialLogin = dynamic(
  () => import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => m.CustomCapsuleModalView),
  { ssr: false },
);

const TransactionSigningModal = dynamic(
  () => import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => m.TransactionSigningModal),
  { ssr: false },
);

const CapsuleModals = () => {
  const { client, modalState, onAfterLoginSuccessful, setModalState, onLoginFailure } = useCapsule();
  const { colorMode } = useColorMode();

  return client ? (
    <div className="leap-ui">
      <LeapSocialLogin
        // @ts-expect-error - use capsule version mismatch error
        capsule={client.getClient()}
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
      <TransactionSigningModal dAppInfo={{ name: "Graz Example" }} />
    </div>
  ) : null;
};

export default CapsuleModals;
