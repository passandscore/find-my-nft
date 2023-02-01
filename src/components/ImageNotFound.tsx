import { Center, Text, Flex } from "@mantine/core";
import styled from "@emotion/styled";
import { IconError404 } from "@tabler/icons-react";

const OuterContainer = styled.div`
  margin: 0 auto;
  max-width: 600px;
  min-width: 400px;
  height: 70vh;
  padding: 20px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 35px;
`;

const InnerContainer = styled.div`
  margin: 0 auto;
  max-width: 600px;
  min-width: 400px;
  display: grid;
  align-content: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

export function ImageNotFound() {
  return (
    <>
      <OuterContainer>
        <InnerContainer>
          <Center>
            <Text
              fz="lg"
              fw="bold"
              color="yellow"
              mb={10}
              align="center"
              transform="uppercase"
            >
              No image found for this NFT
            </Text>
          </Center>
          <Flex justify="center">
            <IconError404 size={100} color="yellow" />
          </Flex>
        </InnerContainer>
      </OuterContainer>
    </>
  );
}
