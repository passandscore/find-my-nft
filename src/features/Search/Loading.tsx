import { Center, Text, Flex, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

const OuterContainer = styled.div`
  margin: 30px auto;
  max-width: 600px;
  min-width: 400px;
  height: 70vh;
  padding: 20px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 35px;
`;

const InnerContainer = styled.div`
  margin: 30px auto;
  max-width: 600px;
  min-width: 400px;
  display: grid;
  align-content: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

export const loadingMessages = [
  "EACH NFT IS UNIQUE",
  "FORGERIES DO NOT EXIST IN THE REALM OF NFTS.",
  "NFTS ENABLE ARTISTS TO REACH NEW AUDIENCES",
  "LISTING NFTS ENTAILS MINTING",
  "SMART CONTRACTS ALLOW FOR ANYTHING DIGITAL TO BE CONVERTED INTO AN NFT.",
  "CARDANO IS AN NFT CONTENDER TO ETHEREUM.",
];

export function Loading() {
  const [randomMessage, setRandomMessage] = useState<string>("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    setRandomMessage(loadingMessages[randomIndex]);
  }, []);

  return (
    <>
      <OuterContainer>
        <InnerContainer>
          <Center>
            <Text fz="lg" fw="bold" color="yellow" mb={10} align="center">
              {randomMessage}
            </Text>
          </Center>
          <Flex justify="center">
            <Loader variant="bars" color="yellow" />
          </Flex>
        </InnerContainer>
      </OuterContainer>
    </>
  );
}
