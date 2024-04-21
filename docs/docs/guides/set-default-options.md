# Update Wallet Default Options

to set default options for the wallet.

```javascript
<GrazProvider
      grazOptions={{
        chains: mainnetChains,
        walletDefaultOptions: {
          sign: {
            preferNoSetFee: true,
            disableBalanceCheck: true,
            preferNoSetMemo: true
          },
        },
      }}
    >
```
