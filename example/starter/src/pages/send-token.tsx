import { Box, Button, FormControl, FormLabel, Heading, Input, Select, Stack, useToast } from "@chakra-ui/react";
import { useStargateSigningClient } from "graz";
import { useAccount, useActiveChains, useSendTokens } from "graz";
import type { FormEvent } from "react";
import { useState } from "react";

const SendToken = () => {
  const { data: accountData, isConnected } = useAccount();
  const activeChains = useActiveChains();
  const toast = useToast();
  const { data: signingClient } = useStargateSigningClient();

  const { sendTokensAsync, isLoading } = useSendTokens({
    onError: (_, data) => {
      const args = data;
      toast({
        status: "error",
        title: "Send token fail",
        description: `Failed send token to ${args.recipientAddress}`,
      });
    },
  });

  const [formData, setFormData] = useState({
    coin: "",
    recipientAddress: "",
    amount: "",
    memo: "",
  });

  const handleSubmit = (event: FormEvent) => {
    const fee = {
      gas: "150000",
      amount: [{ denom: formData.coin, amount: "30000" }],
    };
    event.preventDefault();

    const sendToken = async () => {
      try {
        if (!signingClient) throw new Error("signingClient is not ready");
        const result = await sendTokensAsync({
          signingClient,
          recipientAddress: formData.recipientAddress,
          amount: [
            {
              denom: formData.coin,
              amount: formData.amount,
            },
          ],
          fee,
          memo: formData.memo,
        });

        toast({
          status: "success",
          title: "Send token success",
          description: (
            <Box
              as="button"
              bg="green.700"
              borderRadius={4}
              color="white"
              noOfLines={1}
              onClick={() => {
                void navigator.clipboard.writeText(result.transactionHash);
                toast({
                  status: "success",
                  title: "coppied transactionHash to clipboard",
                });
              }}
              px={2}
              py={1}
              textAlign="left"
              wordBreak="break-all"
            >
              Copy transactionHash: {result.transactionHash}
            </Box>
          ),
        });
      } catch (error) {
        console.error(error);
      }
    };

    void sendToken();
  };

  return (
    <Stack spacing={6} w="full">
      <Heading>Send Token</Heading>
      {isConnected ? (
        <Stack as="form" onSubmit={handleSubmit} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Coin</FormLabel>
            <Select
              onChange={(event) =>
                setFormData({
                  ...formData,
                  coin: event.currentTarget.value,
                })
              }
              placeholder="Select option"
              value={formData.coin}
            >
              {activeChains?.[0]?.currencies.map((currency) => (
                <option key={currency.coinMinimalDenom} value={currency.coinMinimalDenom}>
                  {currency.coinMinimalDenom}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Sender address</FormLabel>
            <Input isDisabled type="text" value={accountData?.bech32Address ?? ""} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Recipient address</FormLabel>
            <Input
              onChange={(event) =>
                setFormData({
                  ...formData,
                  recipientAddress: event.currentTarget.value,
                })
              }
              type="text"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Amount</FormLabel>
            <Input
              onChange={(event) =>
                setFormData({
                  ...formData,
                  amount: event.currentTarget.value,
                })
              }
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Memo</FormLabel>
            <Input
              onChange={(event) =>
                setFormData({
                  ...formData,
                  memo: event.currentTarget.value,
                })
              }
              type="text"
            />
          </FormControl>
          <Button isLoading={isLoading} mt={4} type="submit" width="full">
            Send
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default SendToken;
