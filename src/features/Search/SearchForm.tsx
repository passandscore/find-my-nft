import {
  Button,
  Container,
  Flex,
  Box,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import { IconQuestionMark } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { ethers } from "ethers";
import { ProfileTokenData } from "@/data-schema/types";
import { ComponentStates, NetworkEnviroments } from "@/data-schema/enums";
import { Loading } from "@/features/Search/Loading";
import {
  prepareRequestByTokenId,
  prepareRequestAllTokens,
  prepareRequestInitialTokenById,
} from "@/BFF";
import styled from "@emotion/styled";
import { INITIAL_TOKEN_ID, COVALENT_API } from "@/web3/constants";
import { InputFields } from "@/features/Search";

const StyledBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  margin-left: 12px;

  &:hover #need-to-know-icon {
    color: orange;
  }

  &:hover #need-to-know {
    color: orange;
  }
`;

export function SearchForm({
  changeComponent,
  handleNftData,
  handleIsLoading,
  isLoading,
  setOpenNeedToKnow,
}: {
  changeComponent: (component: ComponentStates) => void;
  handleNftData: (data: any) => void;
  handleIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  setOpenNeedToKnow: (open: boolean) => void;
}) {
  const [chainId, setChainId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string>("");
  const [findWithTokenId, setFindWithTokenId] = useState<boolean>(false);
  const [networkType, setNetworkType] = useState<NetworkEnviroments>(
    NetworkEnviroments.MAINNET
  );

  const { colorScheme } = useMantineColorScheme();

  const requestByTokenId = async () => {
    const providedApiKey = localStorage.getItem(COVALENT_API);
    const response = (await prepareRequestByTokenId(
      tokenId,
      chainId!,
      address!,
      providedApiKey || "",
      handleIsLoading
    )) as {
      data: ProfileTokenData;
    };

    const data = response?.data;
    if (!data) return;

    handleNftData({
      ...data,
    });

    changeComponent(ComponentStates.TOKEN_PROFILE);
    handleIsLoading(false);
  };

  const requestAllTokens = async () => {
    handleIsLoading(true);

    const providedApiKey = localStorage.getItem(COVALENT_API);

    //-----Check the first token id for metadata-----
    const tokenTest = await prepareRequestInitialTokenById(
      INITIAL_TOKEN_ID,
      chainId!,
      address!,
      handleIsLoading
    );

    if (!tokenTest?.hasData) return;

    //-----Return all token ids------
    const response = (await prepareRequestAllTokens(
      chainId!,
      address!,
      providedApiKey || "",
      handleIsLoading
    )) as {
      data: ProfileTokenData;
    };

    const data = response?.data;
    if (!data) return;

    //-----Store all token ids in the state-----
    handleNftData({
      ...data,
    });

    changeComponent(ComponentStates.COLLECTION);
  };

  const requestCovalentData = async () => {
    if (findWithTokenId) {
      await requestByTokenId();
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

  return (
    <Box>
      {!isLoading ? (
        <Container maw={600} px={50}>
          <InputFields
            findWithTokenId={findWithTokenId}
            setFindWithTokenId={setFindWithTokenId}
            networkType={networkType}
            setNetworkType={setNetworkType}
            chainId={chainId}
            setChainId={setChainId}
            setAddress={setAddress}
            setTokenId={setTokenId}
          />

          {/* Need To Know*/}
          <StyledBox>
            <IconQuestionMark size="22px" id="need-to-know-icon" />

            <Text
              id="need-to-know"
              color={`${colorScheme === "dark" ? "#C0C2C5" : "black"}`}
              size="sm"
              ml={5}
              onClick={() => setOpenNeedToKnow(true)}
            >
              Need to know
            </Text>
          </StyledBox>

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
