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
import { handleImageUrl } from "@/web3/useHandleImageUrl";
import {
  CollectionImageHandler,
  CollectionImageOverlay,
} from "@/features/Collection";
import { COVALENT_API } from "@/web3/constants";

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
      const providedApiKey = localStorage.getItem(COVALENT_API);

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
    const providedApiKey = localStorage.getItem(COVALENT_API);

    prepareRequestByTokenId(
      tokenId,
      selectedChainId,
      selectedContractAddress,
      providedApiKey || ""
    ).then((tokenData) => {
      setSelectedCardTokenData({ ...tokenData?.data });
      setOpenTokenCard(true);
    });
  };

  const allImagesLoaded = useCallback((currentImage: number) => {
    const totalPages = Math.ceil(collectionTotal / itemsPerPage);
    const itemsOnFinalPage = collectionTotal % itemsPerPage;
    const currentPage = page;

    const items =
      currentPage === totalPages
        ? itemsPerPage
        : itemsOnFinalPage || itemsPerPage;

    if (currentImage === items) {
      // if not at top of screeen, scroll to top
      if (window.scrollY > 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        setLoadingPage(false);
        handleIsLoading(false);
      }, 1000);
    }
  }, []);

  //-----Used for page change-----
  const handlePageChange = (selectedPage: number) => {
    if (selectedPage === page) return;

    const currentPage = page;
    setPage(selectedPage);

    setLoadingPage(true);

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
      return "475";
    } else if (width > 768 && width < 1024) {
      return "375";
    } else {
      return "275";
    }
  };

  //-----Used for initial load of page data-----
  useEffect(() => {
    if (width > 0) return;
    setLoadingPage(true);
    tokenData(1).then((data) => {
      setCurrentPageData(data);
      setShowPagination(true);
    });
  }, [width]);

  const mappedCards = currentPageData?.map(
    (item: { tokenId: string; image: string }, index: number) => (
      <Card
        key={item.tokenId}
        style={{
          backgroundColor: "transparent",
          width: "100%",
          height: `${handleDimensions()}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card.Section>
          <Skeleton visible={loadingPage}>
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
