import {
  TextInput,
  Select,
  Button,
  Container,
  Flex,
  Switch,
  Box,
} from "@mantine/core";
import { useState } from "react";
import { IconAddressBook, IconLink, Icon123 } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { ethers } from "ethers";
import { ComponentStates } from "@/data-schema";

export function InputsWithButton({
  changeComponent,
  handleNftData,
}: {
  changeComponent: (component: ComponentStates) => void;
  handleNftData: (data: any) => void;
}) {
  const [chainId, setChainId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string>("");
  const [findWithTokenId, setFindWithTokenId] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestByTokenId = async (providedTokenId: string) => {
    const endpoint = `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${providedTokenId}/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`;

    try {
      const response = await fetch(endpoint);
      const convalentData = await response.json();
      console.log("convalentData", convalentData);
      const hasData = Boolean(convalentData?.data?.items[0]?.nft_data);

      // Check if there is an error message or no external data
      const { error_message } = convalentData;

      if (!hasData) {
        throw new Error(
          "No external data found. Ensure you have the correct contract address and token id."
        );
      }

      if (error_message) {
        throw new Error(error_message);
      }

      // Fetch the metadata from the token_url
      const tokenData = convalentData?.data?.items[0]?.nft_data[0];
      const metdata = await fetch(tokenData?.token_url);
      const metadata = await metdata.json();

      handleNftData({ ...tokenData, metadata });
      changeComponent(ComponentStates.PROFILE);
      setIsLoading(false);
    } catch (e) {
      showNotification({
        title: "Error",
        message: e.message,
        color: "red",
      });
      setIsLoading(false);
    }
  };

  const requestAllTokenIds = async () => {
    const endpoint = `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`;

    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  };

  const requestCovalentData = async () => {
    if (findWithTokenId) {
      const providedTokenId: string = tokenId;
      const tokenData = await requestByTokenId(providedTokenId);
      return tokenData;
    } else {
      const tokenData = await requestAllTokenIds();
      return tokenData;
    }
  };

  const handleSubmitValidation = async () => {
    if (!chainId || !address) {
      showNotification({
        title: "Error",
        message: "Please fill all fields",
        color: "red",
      });
      return;
    }

    if (!ethers.utils.isAddress(address)) {
      showNotification({
        title: "Error",
        message: "Please enter a valid address",
        color: "red",
      });
      return;
    }

    if (findWithTokenId && !tokenId) {
      showNotification({
        title: "Error",
        message: "Please enter a token id",
        color: "red",
      });
      return;
    }

    setIsLoading(true);

    if (findWithTokenId) {
      await requestCovalentData();
    } else {
      await requestAllTokenIds();
    }
  };

  return (
    <Box>
      <Container maw={600} px={50}>
        <Flex direction="row-reverse">
          <Switch
            labelPosition="left"
            label="Find by token id"
            color="yellow"
            style={{ margin: "200px 0 30px 0" }}
            onChange={() => setFindWithTokenId(!findWithTokenId)}
          />
        </Flex>
        <Select
          icon={<IconLink size={18} stroke={1.5} />}
          mb={30}
          radius="xl"
          size="lg"
          data={[
            { value: "1", label: "Ethereum" },
            { value: "137", label: "Polygon" },
            { value: "56", label: "Binance Smart Chain" },
          ]}
          placeholder="Chain id"
          clearable
          value={chainId}
          onChange={setChainId}
        />

        <TextInput
          icon={<IconAddressBook size={18} stroke={1.5} />}
          radius="xl"
          size="lg"
          placeholder="Contract or wallet address"
          onChange={(e) => setAddress(e.target.value)}
        />

        {findWithTokenId && (
          <TextInput
            icon={<Icon123 size={18} stroke={1.5} />}
            mt={30}
            radius="xl"
            size="lg"
            placeholder="Token id"
            onChange={(e) => setTokenId(e.target.value)}
          />
        )}

        <Flex direction="row-reverse">
          <Button
            color="yellow"
            radius="lg"
            size="lg"
            compact
            mt={30}
            onClick={handleSubmitValidation}
            loading={isLoading}
          >
            Find My NFTS
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
