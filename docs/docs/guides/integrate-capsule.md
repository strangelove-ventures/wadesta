# Integrate Capsule

## Install Leap Login Capsule UI

```bash
yarn add @leapwallet/cosmos-social-login-capsule-provider-ui
```

## Example Next JS

For Next JS we recommend to load the module dynamically to avoid SSR issues. And use `useCapsule` hook to get the client and other capsule related states.

```javascript
const LeapSocialLogin = dynamic(
  () => import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => m.CustomCapsuleModalView),
  { ssr: false },
);

const HomePage = () => {
  const { client, modalState, onAfterLoginSuccessful, setModalState, onLoginFailure } = useCapsule();

  return (
    <div>
      <LeapSocialLogin
        capsule={client?.getClient() || undefined}
        onAfterLoginSuccessful={() => {
          onAfterLoginSuccessful?.();
        }}
        onLoginFailure={() => {
          onLoginFailure();
        }}
        setShowCapsuleModal={setModalState}
        showCapsuleModal={modalState}
      />
    </div>
  );
};
```

Thats it, now you can use capsule as your wallet provider.
