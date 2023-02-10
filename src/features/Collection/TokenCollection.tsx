import {
  Pagination,
  Card,
  Box,
  SimpleGrid,
  Center,
  Skeleton,
  Text,
  Transition,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import { prepareRequestByTokenId } from "@/BFF";
import { SelectedTokenCard } from "@/features/Collection/SelectedTokenCard";
import { useWindowSize } from "usehooks-ts";
import { handleUrl } from "@/web3/useHandleImageUrl";
import {
  CollectionImageHandler,
  CollectionImageOverlay,
} from "@/features/Collection";
import { COVALENT_API } from "@/web3/constants";

export function TokenCollection({
  nftData,
  handleIsLoading,
}: {
  nftData: any;
  handleIsLoading: any;
}) {
  const { selectedChainId, selectedContractAddress } = nftData;
  const { items } = nftData.data;
  const collectionTotal = items.length;
  const contractname = nftData.data.items[0].contract_name;

  const [page, setPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]) as any;
  const [openTokenCard, setOpenTokenCard] = useState(false);
  const [selectedCardTokenData, setSelectedCardTokenData] = useState({});
  const [showPagination, setShowPagination] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const { width } = useWindowSize();

  const itemsPerPage = 8;

  const tokenData = async (selectedPage: number) => {
    try {
      const providedApiKey = localStorage.getItem(COVALENT_API);

      const startIndex = (selectedPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      if (!hasLoaded) {
        handleIsLoading(true);
      }

      const data = Promise.all(
        items.slice(startIndex, endIndex).map(async (item: any) => {
          const { token_id } = item;

          const tokenData = await prepareRequestByTokenId(
            token_id,
            selectedChainId,
            selectedContractAddress,
            providedApiKey || ""
          );

          const imageUrl = handleUrl(tokenData?.data?.metadata?.image!);

          const pageData = {
            tokenId: token_id,
            image: imageUrl,
          };

          return pageData || {};
        })
      );

      return data;
    } catch (e) {
      handleIsLoading(false);
      showNotification({
        title: "Error",
        message: (e as Error).message,
        color: "red",
      });
    }
  };

  const handleSelectedToken = (tokenId: string) => () => {
    const providedApiKey = localStorage.getItem(COVALENT_API);

    setIsLoadingProfile(true);
    prepareRequestByTokenId(
      tokenId,
      selectedChainId,
      selectedContractAddress,
      providedApiKey || ""
    )
      .then((tokenData) => {
        setSelectedCardTokenData({ ...tokenData?.data });
        setOpenTokenCard(true);
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  };

  const allImagesLoaded = useCallback((currentImage: number) => {
    // load the first 2 images before displaying
    if (currentImage === 1) {
      handleIsLoading(false);
      setIsLoadingImages(false);

      if (window.scrollY > 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }, []);

  //-----Used for page change-----
  const handlePageChange = (selectedPage: number) => {
    if (selectedPage === page) return;

    const currentPage = page;
    setPage(selectedPage);

    setIsLoadingImages(true);

    //-------Check if page has data, if not, load previous page data-----
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
        // setLoadingPage(false);
        setIsLoadingImages(false);
      } else {
        // reload existing page data
        setCurrentPageData(data);
        setPage(selectedPage);
      }
    });
  };

  const handleGridColumns = () => {
    if (width > 0 && width < 800) {
      return 1;
    } else if (width > 800 && width < 1200) {
      return 2;
    } else {
      return 4;
    }
  };

  const handleDimensions = () => {
    if (width > 0 && width < 800) {
      return "475";
    } else if (width > 800 && width < 1200) {
      return "375";
    } else {
      return "275";
    }
  };

  //-----Used for initial load of page data-----
  useEffect(() => {
    if (width > 0) return;
    tokenData(1).then((data) => {
      setCurrentPageData(data);
      setIsLoadingImages(false);
      setShowPagination(true);
      setHasLoaded(true);
    });
  }, [width]);

  const mappedCards = currentPageData?.map(
    (item: { tokenId: string; image: string }, index: number) => (
      <Card
        key={item.tokenId}
        style={{
          backgroundColor: "transparent",
          width: `${handleDimensions()}px`,
          height: `${handleDimensions()}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card.Section>
          <Skeleton visible={isLoadingImages}>
            {item.image && (
              <>
                <CollectionImageHandler
                  src={item.image}
                  allImagesLoaded={allImagesLoaded}
                  index={index}
                  handleDimensions={handleDimensions}
                />

                <CollectionImageOverlay
                  handleSelectedToken={handleSelectedToken}
                  item={item}
                />
              </>
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
        selectedCardTokenData={selectedCardTokenData}
        width={width}
        isLoadingProfile={isLoadingProfile}
      />
      <Box
        m={20}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
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
                total={Math.ceil(collectionTotal / itemsPerPage)}
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
