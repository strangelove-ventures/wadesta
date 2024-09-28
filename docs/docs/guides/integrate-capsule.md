# Integrate Capsule

### Install Leap Login Capsule UI

```bash
yarn add @leapwallet/cosmos-social-login-capsule-provider-ui
```

### Fill your Capsule Config in `GrazProvider`

```javascript
<GrazProvider
  grazOptions={{
    chains,
    capsuleConfig: {
      apiKey: process.env.NEXT_PUBLIC_CAPSULE_API_KEY,
      env: process.env.NEXT_PUBLIC_CAPSULE_ENV,
    },
  }}
/>
```

### Add the stylesheets from `@leapwallet/cosmos-social-login-capsule-provider-ui` and add `leap-ui` class to parent container of imported Modals.

This will ensure proper styling and you will be able to customize the modals using css-variables as shown in [this doc](https://docs.leapwallet.io/cosmos/elements/theming/using-css-variables#customisation).

```javascript
import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";

<div className="leap-ui">
  <LeapSocialLogin
  // params
  />
  <TransactionSigningModal
  // params
  />
</div>;
```

## Next JS Usage

For Next JS we recommend to load the module dynamically to avoid SSR issues. And use `useCapsule` hook to get the client and other capsule related states.

```javascript
import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";

const LeapSocialLogin = dynamic(
  () => import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => m.CustomCapsuleModalView),
  { ssr: false },
);

const TransactionSigningModal = dynamic(
  () => import("@leapwallet/cosmos-social-login-capsule-provider-ui").then((m) => m.TransactionSigningModal),
  { ssr: false },
);

const HomePage = () => {
  const { client, modalState, onAfterLoginSuccessful, setModalState, onLoginFailure } = useCapsule();

  return client ? (
    <div className="leap-ui">
      <LeapSocialLogin
        capsule={client.getClient()}
        oAuthMethods={["GOOGLE", "FACEBOOK", "TWITTER", "DISCORD", "APPLE"]}
        onAfterLoginSuccessful={() => {
          void onAfterLoginSuccessful?.();
        }}
        onLoginFailure={() => {
          onLoginFailure();
        }}
        setShowCapsuleModal={setModalState}
        showCapsuleModal={modalState}
      />
      <TransactionSigningModal dAppInfo={{ name: "Your dApp Name" }} />
    </div>
  ) : null;
};
```

Thats it, now you can use capsule as your wallet provider.
