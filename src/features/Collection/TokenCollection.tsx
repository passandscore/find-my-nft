import {
  Pagination,
  Card,
  Flex,
  Box,
  SimpleGrid,
  Center,
  Badge,
  Skeleton,
  Text,
  Transition,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { prepareRequestByTokenId } from "@/BFF";
import { SelectedTokenCard } from "@/features/Collection/SelectedTokenCard";
import { useWindowSize } from "usehooks-ts";
import Image from "next/image";
import { handleImageUrl } from "@/web3/useHandleImageUrl";
import { COVALENT_KEY_LOCAL_STORAGE_TITLE } from "@/web3/constants";

export function TokenCollection({
  nftData,
  handleIsLoading,
  handleIsError,
}: {
  nftData: any;
  handleIsLoading: any;
  handleIsError: any;
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
  const [loadingImages, setLoadingImages] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { width } = useWindowSize();

  const itemsPerPage = 12;

  const tokenData = async (selectedPage: number) => {
    try {
      const providedApiKey = localStorage.getItem(
        COVALENT_KEY_LOCAL_STORAGE_TITLE
      );
      const startIndex = (selectedPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const data = Promise.all(
        items.slice(startIndex, endIndex).map(async (item: any) => {
          const { token_id } = item;

          const tokenData = await prepareRequestByTokenId(
            token_id,
            selectedChainId,
            selectedContractAddress,
            providedApiKey || ""
          );

          const imageUrl = handleImageUrl(tokenData?.data?.metadata?.image!);

          const pageData = {
            tokenId: token_id,
            image: imageUrl,
          };

          return pageData || {};
        })
      );
      return data;
    } catch (e) {
      handleIsError(true);
      handleIsLoading(false);
      showNotification({
        title: "Error",
        message: (e as Error).message,
        color: "red",
      });
    }
  };

  const handleSelectedToken = (tokenId: string) => () => {
    const providedApiKey = localStorage.getItem(
      COVALENT_KEY_LOCAL_STORAGE_TITLE
    );
    prepareRequestByTokenId(
      tokenId,
      selectedChainId,
      selectedContractAddress,
      providedApiKey || ""
    ).then((tokenData) => {
      setSelectedCardTokenData({ ...tokenData.data });
      setOpenTokenCard(true);
    });
  };

  const allImagesLoaded = useCallback(() => {
    if (loadingImages === currentPageData.length) {
      setImagesLoaded(true);
      setImagesLoaded(true);
      setLoadingPage(false);
      handleIsLoading(false);
    }
  }, []);

  // Used for initial load
  useEffect(() => {
    if (width > 0) return;
    setLoadingPage(true);
    tokenData(1).then((data) => {
      setCurrentPageData(data);
    });
  }, [width]);

  // Used for page change
  const handlePageChange = (selectedPage: number) => {
    if (selectedPage === page) return;

    const currentPage = page;
    setPage(selectedPage);

    setLoadingPage(true);
    setLoadingImages(0);

    // load new page data
    tokenData(selectedPage).then((data) => {
      // If no data,
      if (data?.length === 0) {
        showNotification({
          title: "Error",
          message: "No minted tokens found",
          color: "red",
        });

        // load previous page data
        tokenData(currentPage).then((data) => {
          setCurrentPageData(data);
        });

        setPage(currentPage);
        setLoadingPage(false);
        setImagesLoaded(true);
      } else {
        // reload existing page data
        setCurrentPageData(data);
        setPage(selectedPage);
      }
    });
  };

  const mappedCards = currentPageData?.map(
    (item: { tokenId: string; image: string }) => (
      <Card key={item.tokenId}>
        <Card.Section>
          <Skeleton visible={loadingPage}>
            {item.image ? (
              <>
                <Image
                  src={item.image}
                  alt="NFT"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                  width={350}
                  height={350}
                  quality={10}
                  onLoad={() => {
                    setLoadingImages((loadedImages) => loadedImages + 1);
                  }}
                  onLoadingComplete={allImagesLoaded}
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
                    zIndex: 1,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box>
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
                  </Box>
                </Flex>
              </>
            ) : (
              <Image
                src="https://via.placeholder.com/150"
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                }}
                width={350}
                height={350}
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
      </Box>

      <Transition
        mounted={imagesLoaded}
        transition="fade"
        duration={1000}
        timingFunction="ease"
      >
        {() => (
          <Box>
            <Center>
              <Pagination
                page={page}
                onChange={(p) => handlePageChange(p)}
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
        )}
      </Transition>
    </>
  );
}
