import { getCapsule } from "../actions/wallet/capsule";
import { useGrazInternalStore, useGrazSessionStore } from "../store";

export const useCapsule = () => {
  const capsuleState = useGrazInternalStore((state) => state.capsuleState);
  const capsuleClient = useGrazSessionStore((state) => state.capsuleClient);
  const capsule = getCapsule();

  return {
    setModalState: (state: boolean) =>
      useGrazInternalStore.setState({
        capsuleState: {
          showModal: state,
        },
      }),
    modalState: Boolean(capsuleState?.showModal),
    client: capsuleClient,
    onSuccessfulLogin: capsule.onSuccessLogin,
  };
};
