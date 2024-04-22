import { disconnect } from "../actions/account";
import { getCapsule } from "../actions/wallet/capsule";
import { useGrazInternalStore, useGrazSessionStore } from "../store";

export const useCapsule = () => {
  const capsuleState = useGrazInternalStore((state) => state.capsuleState);
  const capsuleClient = useGrazSessionStore((state) => state.capsuleClient);
  const capsule = getCapsule();

  return {
    setModalState: (state: boolean) => {
      useGrazInternalStore.setState((prev) => ({
        capsuleState: {
          showModal: state,
          chainId: prev.capsuleState?.chainId,
        },
      }));
    },
    modalState: Boolean(capsuleState?.showModal),
    client: capsuleClient,
    onAfterLoginSuccessful: capsule.onAfterLoginSuccessful,
    onLoginFailure: () => {
      void disconnect();
    },
  };
};
