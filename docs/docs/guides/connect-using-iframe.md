# Connect wallet

You can connect to a specific wallet by using the `useConnect` hook. You can connect to a specific wallet by passing the `walletType` parameter to the `connect` function.

Read more about [wallet types](../types/walletType.md).

### Pass allowed iframe parent origins to `grazOptions` in `GrazProvider`

Graz using [cosmiframe](https://github.com/DA0-DA0/cosmiframe) for establishing a Cosmos wallet connection through an iframe.

It is very important to trust the outer app, since supporting this functionality opens up the possibility for the outer app to manipulate messages before asking the user to sign them.

Cosmiframe enforces security by requiring you to specify allowed origins in the constructor on client instantiation. Not recommended but you can pass '\*' in the param to make it allow all domains.

```tsx
<GrazProvider
  grazOptions={{
    chains,
    allowedIframeParentOrigins: ["https://daodao.zone", "https://dao.daodao.zone"],
  }}
>
  <Component {...pageProps} />
</GrazProvider>
```

### Connect

Here is our list of supported wallets: [WalletType](../types/walletType.md).

```tsx
import { WalletType } from "graz";
const Connect = () => {
  const { connect } = useConnect();
  return (
    <button onClick={() => connect({ chainId: "cosmoshub-4", walletType: WalletType.COSMIFRAME })}>Connect</button>
  );
};
```

### Check if iframe wallet available

```tsx
import { WalletType, checkWallet } from "graz";

const isIframeAvailable = checkWallet(WalletType.COSMIFRAME);

return (
  <>
    {isKeplrSupported && (
      <button onClick={() => connect({ chainId: "cosmoshub-4", walletType: WalletType.KEPLR })}>Connect</button>
    )}
  </>
);
```
