import {
  TextInput,
  Select,
  Button,
  Container,
  Flex,
  Switch,
  Box,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import {
  IconAddressBook,
  IconLink,
  Icon123,
  IconInfoCircle,
} from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { ethers } from "ethers";
import { ProfileTokenData } from "@/data-schema/types";
import { ComponentStates, NetworkEnviroments } from "@/data-schema/enums";
import { Loading } from "@/features/Search/Loading";
import { FetchingError } from "@/features/Search/FetchingError";
import {
  prepareRequestByTokenId,
  prepareRequestAllTokens,
  prepareRequestInitialTokenById,
} from "@/BFF";
import { mainnetNetworkNames, testnetNetworkNames } from "@/web3/constants";
import { INITIAL_TOKEN_ID } from "@/web3/constants";

export function InputsWithButton({
  changeComponent,
  handleNftData,
  handleIsError,
  isError,
  handleIsLoading,
  isLoading,
  nftData,
}: {
  changeComponent: (component: ComponentStates) => void;
  handleNftData: (data: any) => void;
  handleIsError: (error: boolean) => void;
  isError: boolean;
  handleIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  nftData: any;
}) {
  const [chainId, setChainId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string>("");
  const [findWithTokenId, setFindWithTokenId] = useState<boolean>(false);
  const [networkType, setNetworkType] = useState<string>(
    NetworkEnviroments.MAINNET
  );

  const { colorScheme } = useMantineColorScheme();

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
        handleIsError: (error: boolean) => void;
      };

      const { networkError, error, data } = response;

      if (networkError) {
        handleIsError(true);
        return;
      }

      if (error) {
        handleIsError(true);
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
      //-----Check the first token id for metadata-----
      const InitialTokenCheck = await prepareRequestInitialTokenById(
        INITIAL_TOKEN_ID,
        chainId!,
        address!,
        handleIsError
      );

      const {
        hasInitialData,
        contractName,
        networkError: fetchError,
      } = InitialTokenCheck;

      if (fetchError) {
        throw new Error("An error occurred while fetching the data");
      }

      if (!hasInitialData) {
        handleIsError(true);
        handleNftData({ contractName });
        return;
      }
      //----------------------------------------------

      handleIsLoading(true);

      const response = (await prepareRequestAllTokens(
        chainId!,
        address!,
        handleIsError
      )) as {
        data: ProfileTokenData;
        error: string;
        networkError?: boolean;
        handleIsError: (error: boolean) => void;
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
      handleIsLoading(true);

      await requestByTokenId(providedTokenId);
    } else {
      await requestAllTokens();
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

    await requestCovalentData();
  };

  if (isError) {
    return (
      <FetchingError
        contractAddress={address!}
        chainId={chainId!}
        handleIsError={handleIsError}
        handleIsLoading={handleIsLoading}
        nftData={nftData}
      />
    );
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

          {/* Add small text to the bottom left */}
          <Flex align="center" mt={10} style={{ cursor: "pointer" }}>
            <IconInfoCircle />

            <Text
              color={`${colorScheme === "dark" ? "#C0C2C5" : "black"}`}
              size="sm"
              ml={10}
            >
              Need to know
            </Text>
          </Flex>

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
