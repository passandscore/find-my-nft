import {
  Pagination,
  Card,
  Image,
  Flex,
  Box,
  SimpleGrid,
  Center,
  Badge,
  Skeleton,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { prepareRequestByTokenId } from "@/BFF/RequestByTokenId";
import { IPFS_GATEWAY } from "@/web3/constants";
import { SelectedTokenCard } from "@/features/Collection/SelectedTokenCard";

export function TokenCollection({
  nftData,
  width,
  handleIsLoading,
}: {
  nftData: any;
  width: number;
  handleIsLoading: (loading: boolean) => void;
}) {
  const { selectedChainId, selectedContractAddress } = nftData;
  const { items } = nftData.data;
  const collectionTotal = items.length;
  const contractname = nftData.data.items[0].contract_name;

  const [page, setPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]) as any;
  const [loadingPage, setLoadingPage] = useState(true);
  const [openTokenCard, setOpenTokenCard] = useState(false);
  const [selectedCardTokenData, setSelectedCardTokenData] = useState({});

  const tokenData = async () => {
    const data = Promise.all(
      items.slice(startIndex, endIndex).map(async (item: any) => {
        const { token_id } = item;

        const tokenData = await prepareRequestByTokenId(
          token_id,
          selectedChainId,
          selectedContractAddress
        );

        const pageData = {
          tokenId: token_id,
          image: tokenData?.data?.metadata.image,
        };

        return pageData || {};
      })
    );
    return data;
  };

  useEffect(() => {
    setLoadingPage(true);
    tokenData().then((data) => {
      handleIsLoading(false);
      setCurrentPageData(data);
    });
  }, [page]);

  useEffect(() => {
    setLoadingPage(false);
  }, [currentPageData]);

  const itemsPerPage = width > 600 ? 12 : 9;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleImageUrl = (image: string) => {
    let url = image;

    if (url.includes("ipfs://")) {
      return url.replace("ipfs://", IPFS_GATEWAY);
    }
    return url || "";
  };

  const handleSelectedToken = (tokenId: string) => () => {
    prepareRequestByTokenId(
      tokenId,
      selectedChainId,
      selectedContractAddress
    ).then((tokenData) => {
      setSelectedCardTokenData({ ...tokenData.data });
      setOpenTokenCard(true);
    });
  };

  const mappedCards = currentPageData.map(
    (item: { tokenId: string; image: string }) => (
      <Card>
        <Card.Section>
          <Skeleton visible={loadingPage}>
            {item.image ? (
              <>
                <Image
                  src={handleImageUrl(item.image)}
                  height={160}
                  alt="NFT"
                />

                <Flex
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(5px)",
                    color: "white",
                    opacity: 0,
                    transition: "opacity 0.3s ease-in-out",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <>
                    <Badge
                      sx={{
                        cursor: "pointer",
                        marginLeft: 10,
                      }}
                      size="lg"
                      variant="gradient"
                      gradient={{ from: "yellow", to: "orange" }}
                      onClick={handleSelectedToken(item.tokenId)}
                    >
                      {`view token ${item.tokenId}`}
                    </Badge>
                  </>
                </Flex>
              </>
            ) : (
              <Image
                src="https://via.placeholder.com/150"
                height={160}
                alt="NFT"
              />
            )}
          </Skeleton>
        </Card.Section>
      </Card>
    )
  );

  return (
    <>
      <SelectedTokenCard
        openTokenCard={openTokenCard}
        setOpenTokenCard={setOpenTokenCard}
        selectedCardTokenData={selectedCardTokenData || {}}
        width={width}
      />
      <Box m={20}>
        <SimpleGrid cols={width > 600 ? 4 : 3} mb={50}>
          {mappedCards}
        </SimpleGrid>
        <Center>
          <Pagination
            page={page}
            onChange={setPage}
            total={collectionTotal / 10}
            size="xl"
          />
        </Center>
        <Center mt={20}>
          <Text
            color="orange"
            fz="sm"
            fw="bold"
          >{`There are ${collectionTotal} total NFTs on the ${contractname} contract`}</Text>
        </Center>
      </Box>
    </>
  );
}
