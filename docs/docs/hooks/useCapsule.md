# useCapsule

Hook to interact with [@leapwallet/cosmos-social-login-capsule-provider-ui](https://www.npmjs.com/package/@leapwallet/cosmos-social-login-capsule-provider-ui)

#### Usage

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

#### Return Value

```tsx
{
  setModalState: (state: boolean) => void;
  modalState: boolean;
  client: CapsuleProvider | null;
  onAfterLoginSuccessful: (() => Promise<void>) | undefined;
  onLoginFailure: () => void;
}
```
