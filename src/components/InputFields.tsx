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
  const [networkType, setNetworkType] = useState<string>("mainnet");

  const mainnetNetworkNames = [
    { value: "1", label: "Ethereum" },
    { value: "137", label: "Polygon" },
    { value: "56", label: "Binance Smart Chain" },
    { value: "80001", label: "Mumbai" },
  ];

  const testnetNetworkNames = [
    { value: "5", label: "Goerli" },
    { value: "4", label: "Rinkeby" },
    { value: "42", label: "Kovan" },
    { value: "3", label: "Ropsten" },
    { value: "97", label: "Binance Smart Chain Testnet" },
    { value: "80001", label: "Mumbai" },
  ];

  const requestByTokenId = async (providedTokenId: string) => {
    try {
      const convalentData = await fetch(
        `http://localhost:3000/api/request-by-token-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chainId,
            address,
            providedTokenId,
          }),
        }
      );
      if (!convalentData.ok) {
        throw new Error("Error fetching data");
      }
      const convalentDataJson = await convalentData.json();
      console.log("convalentDataJson", convalentDataJson);
      const hasData = Boolean(convalentDataJson?.data?.items[0]?.nft_data);

      // Check if there is an error message or no external data
      const { error_message } = convalentDataJson;

      if (!hasData) {
        throw new Error(
          "No external data found. Ensure you have the correct contract address and token id."
        );
      }

      if (error_message) {
        throw new Error(error_message);
      }

      // Fetch the metadata from the token_url
      const contractData = convalentDataJson?.data?.items[0];
      const tokenData = convalentDataJson?.data?.items[0]?.nft_data[0];
      const metdata = await fetch(tokenData?.token_url);
      const metadata = await metdata.json();

      console.log({ ...tokenData, metadata, contractData });
      handleNftData({ ...tokenData, metadata, contractData });
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
    try {
      const convalentData = await fetch(
        `http://localhost:3000/api/request-by-contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chainId,
            address,
          }),
        }
      );

      if (!convalentData.ok) {
        throw new Error("Error fetching data");
      }
      const convalentDataJson = await convalentData.json();
      console.log(convalentDataJson);

      handleNftData(convalentDataJson);
      changeComponent(ComponentStates.GALLERY);
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
            mt={200}
            onChange={() => setFindWithTokenId(!findWithTokenId)}
          />
        </Flex>

        <Flex direction="row-reverse">
          <Switch
            labelPosition="left"
            label="Enable Testnets"
            color="yellow"
            my={20}
            onChange={() =>
              setNetworkType(
                `${networkType === "mainnet" ? "testnet" : "mainnet"}`
              )
            }
          />
        </Flex>
        <Select
          icon={<IconLink size={18} stroke={1.5} />}
          mb={30}
          radius="xl"
          size="lg"
          data={
            networkType === "mainnet"
              ? mainnetNetworkNames
              : testnetNetworkNames
          }
          placeholder="Chain id"
          clearable
          value={chainId}
          onChange={setChainId}
        />

        <TextInput
          icon={<IconAddressBook size={18} stroke={1.5} />}
          radius="xl"
          size="lg"
          placeholder="Contract address"
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
            {findWithTokenId ? "Find NFT" : "Find all NFTs"}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
