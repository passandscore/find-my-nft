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
  handleIsError,
  handleIsLoading,
  nftData,
}: {
  contractAddress: string;
  chainId: string;
  handleIsError: (error: boolean) => void;
  handleIsLoading: (loading: boolean) => void;
  nftData: any;
}) {
  const blockchainExplorer = useBlockExplorerByChainId(
    chainId,
    contractAddress
  );

  const { contractName } = nftData;

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
              {`Unable to fetch ${contractName} metadata.`}
            </Text>
          </Center>

          <Center
            sx={{
              margin: 10,
            }}
          >
            <Badge
              sx={{
                cursor: "pointer",
              }}
              size="lg"
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              onClick={() => window.open(blockchainExplorer, "_blank")}
            >
              VIEW ON BLOCKCHAIN
            </Badge>
          </Center>

          <Center>
            <Badge
              sx={{
                cursor: "pointer",
                marginTop: 10,
                padding: "0 18px",
              }}
              size="lg"
              variant="gradient"
              gradient={{ from: "yellow", to: "orange" }}
              onClick={() => {
                handleIsError(false);
                handleIsLoading(false);
              }}
            >
              SEARCH BY TOKEN ID
            </Badge>
          </Center>
        </InnerContainer>
      </OuterContainer>
    </>
  );
}
