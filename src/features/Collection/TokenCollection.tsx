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
import { ImageHandler } from "@/features/Collection/ImageHandler";

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
  const [showPagination, setShowPagination] = useState(false);

  const { width } = useWindowSize();

  const itemsPerPage = 8;

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

  const allImagesLoaded = useCallback((currentImage: number) => {
    if (currentImage === itemsPerPage) {
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
      setShowPagination(true);
    });
  }, [width]);

  // Used for page change
  const handlePageChange = (selectedPage: number) => {
    if (selectedPage === page) return;

    const currentPage = page;
    setPage(selectedPage);

    setLoadingPage(true);

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
      } else {
        // reload existing page data
        setCurrentPageData(data);
        setPage(selectedPage);
      }
    });
  };

  const handleGridColumns = () => {
    if (width > 0 && width < 768) {
      return 1;
    } else if (width > 768 && width < 1024) {
      return 2;
    } else {
      return 4;
    }
  };

  const handleDimensions = () => {
    if (width > 0 && width < 768) {
      return "475px";
    } else if (width > 768 && width < 1024) {
      return "375px";
    } else {
      return "275px";
    }
  };

  const mappedCards = currentPageData?.map(
    (item: { tokenId: string; image: string }, index: number) => (
      <Card
        key={item.tokenId}
        style={{
          backgroundColor: "transparent",
          width: "100%",
          height: handleDimensions(),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card.Section>
          <Skeleton visible={loadingPage}>
            {item.image ? (
              <>
                <ImageHandler
                  src={item.image}
                  allImagesLoaded={allImagesLoaded}
                  index={index}
                  handleDimensions={handleDimensions}
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
                src="/imgs/placeholder.png"
                style={{
                  width: "275px",
                  height: "275px",
                  objectFit: "cover",
                }}
                width={200}
                height={200}
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
        <SimpleGrid cols={handleGridColumns()} mb={50}>
          {mappedCards}
        </SimpleGrid>
      </Box>

      <Transition
        mounted={showPagination}
        transition="fade"
        duration={1000}
        timingFunction="ease"
      >
        {() => (
          <Box mb={20}>
            <Center>
              <Pagination
                page={page}
                onChange={(p) => handlePageChange(p)}
                total={collectionTotal}
                size="xl"
                boundaries={2}
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
