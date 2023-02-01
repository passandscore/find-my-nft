import { Center, Text, Badge } from "@mantine/core";
import styled from "@emotion/styled";
import { useBlockExplorerByChainId } from "@/web3/useBlockExplorerByChainId";

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

export function FetchingError({
  contractAddress,
  chainId,
}: {
  contractAddress: string;
  chainId: string;
}) {
  const blockchainExplorer = useBlockExplorerByChainId(
    chainId,
    contractAddress
  );

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
              Covalent is unable to fetch data from the blockchain
            </Text>
          </Center>

          <Center>
            <Badge
              sx={{
                cursor: "pointer",
                marginLeft: 10,
              }}
              size="lg"
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              onClick={() => window.open(blockchainExplorer, "_blank")}
            >
              VIEW ON BLOCKCHAIN
            </Badge>
          </Center>
        </InnerContainer>
      </OuterContainer>
    </>
  );
}
