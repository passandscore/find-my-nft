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
import { ProfileTokenData } from "@/data-schema/types";
import { ComponentStates, NetworkEnviroments } from "@/data-schema/enums";
import { Loading } from "@/features/Search/Loading";
import { FetchingError } from "@/features/Search/FetchingError";
import { prepareRequestByTokenId } from "@/BFF/RequestByTokenId";
import { prepareRequestAllTokens } from "@/BFF/RequestAllTokens";

export function InputsWithButton({
  changeComponent,
  handleNftData,
  handleIsError,
  isError,
  handleIsLoading,
  isLoading,
}: {
  changeComponent: (component: ComponentStates) => void;
  handleNftData: (data: any) => void;
  handleIsError: (error: boolean) => void;
  isError: boolean;
  handleIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}) {
  const [chainId, setChainId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string>("");
  const [findWithTokenId, setFindWithTokenId] = useState<boolean>(false);
  const [networkType, setNetworkType] = useState<string>(
    NetworkEnviroments.MAINNET
  );

  const mainnetNetworkNames = [
    { value: "1", label: "Ethereum" },
    { value: "137", label: "Polygon" },
    { value: "56", label: "Binance Smart Chain" },
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
      const response = (await prepareRequestByTokenId(
        providedTokenId,
        chainId!,
        address!
      )) as {
        data: ProfileTokenData;
        error: string;
        networkError?: boolean;
      };

      const { networkError, error, data } = response;

      if (networkError) {
        handleIsError(true);
        return;
      }

      if (error) {
        throw new Error(error!);
      }

      handleNftData({
        ...data,
      });
      changeComponent(ComponentStates.TOKEN_PROFILE);
      handleIsLoading(false);
    } catch (e) {
      showNotification({
        title: "Error",
        message: (e as Error).message,
        color: "red",
      });
      handleIsLoading(false);
    }
  };

  const requestAllTokens = async () => {
    try {
      const response = (await prepareRequestAllTokens(chainId!, address!)) as {
        data: ProfileTokenData;
        error: string;
        networkError?: boolean;
      };

      const { networkError, error, data } = response;

      if (networkError) {
        handleIsError(true);
        return;
      }

      if (error) throw new Error(error!);

      handleNftData({
        ...data,
      });

      changeComponent(ComponentStates.COLLECTION);
    } catch (e) {
      showNotification({
        title: "Error",
        message: (e as Error).message,
        color: "red",
      });
      handleIsLoading(false);
    }
  };

  const requestCovalentData = async () => {
    if (findWithTokenId) {
      const providedTokenId: string = tokenId;
      const tokenData = await requestByTokenId(providedTokenId);
      return tokenData;
    } else {
      const tokenData = await requestAllTokens();
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

    handleIsLoading(true);

    await requestCovalentData();
  };

  if (isError) {
    return <FetchingError contractAddress={address!} chainId={chainId!} />;
  }

  return (
    <Box>
      {!isLoading ? (
        <Container maw={600} px={50}>
          {/* Switch - Find by token id */}

          <Flex direction="row-reverse">
            <Switch
              labelPosition="left"
              label="Find by token id"
              color="yellow"
              mt={200}
              onChange={() => setFindWithTokenId(!findWithTokenId)}
            />
          </Flex>

          {/* Switch - Enable testnets */}
          <Flex direction="row-reverse">
            <Switch
              labelPosition="left"
              label="Enable Testnets"
              color="yellow"
              my={20}
              onChange={() =>
                setNetworkType(
                  `${
                    networkType === NetworkEnviroments.MAINNET
                      ? NetworkEnviroments.TESTNET
                      : NetworkEnviroments.MAINNET
                  }`
                )
              }
            />
          </Flex>

          {/* Select - Chain id */}
          <Select
            icon={<IconLink size={18} stroke={1.5} />}
            mb={30}
            radius="xl"
            size="lg"
            data={
              networkType === NetworkEnviroments.MAINNET
                ? mainnetNetworkNames
                : testnetNetworkNames
            }
            placeholder="Chain id"
            clearable
            value={chainId}
            onChange={setChainId}
          />

          {/* Input - Contract address */}
          <TextInput
            icon={<IconAddressBook size={18} stroke={1.5} />}
            radius="xl"
            size="lg"
            placeholder="Contract address"
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* Input - Token id */}
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

          {/* Button - Find NFT */}
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
      ) : (
        <Loading />
      )}
    </Box>
  );
}
