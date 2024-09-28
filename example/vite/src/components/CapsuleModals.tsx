import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";

import { CustomCapsuleModalView, TransactionSigningModal } from "@leapwallet/cosmos-social-login-capsule-provider-ui";
import { useCapsule } from "graz";
import React from "react";

const CapsuleModals = () => {
  const { client, modalState, onAfterLoginSuccessful, setModalState, onLoginFailure } = useCapsule();
  return client ? (
    <div className="leap-ui">
      <CustomCapsuleModalView
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
        theme="light"
      />
      <TransactionSigningModal dAppInfo={{ name: "Graz Example" }} />
    </div>
  ) : null;
};

export default CapsuleModals;
