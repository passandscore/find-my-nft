import {
  Container,
  Image,
  Button,
  Flex,
  SegmentedControl,
  createStyles,
  Box,
  Text,
  Badge,
} from "@mantine/core";
import { useState } from "react";
import { ComponentStates } from "@/data-schema";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? `${(theme.colors.gray[6], 0.5)}`
        : theme.white,
    boxShadow: theme.shadows.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
  },

  active: {
    backgroundImage: theme.fn.gradient({ from: "yellow", to: "orange" }),
  },

  control: {
    border: "0 !important",
  },

  labelActive: {
    color: `${theme.white} !important`,
  },
}));

export function Profile({
  nftData,
  changeComponent,
  width,
}: {
  nftData: any;
  changeComponent: (component: ComponentStates) => void;
  width: number;
}) {
  const [selectedButton, setSelectedButton] = useState("NFT Image");
  const { classes } = useStyles();
  const { contract_address, contract_name, contract_ticker_symbol } =
    nftData.contractData;

  const contractData = [
    {
      label: "Contract Name",
      value: contract_name,
      badge: false,
    },
    {
      label: "Contract Address",
      value: contract_address,
      badge: true,
    },
    {
      label: "Contract Symbol",
      value: contract_ticker_symbol,
      badge: false,
    },
    {
      label: "Original Owner",
      value: nftData.original_owner,
      badge: true,
    },
    {
      label: "Current Owner",
      value: nftData.owner,
      badge: true,
    },
  ];

  const handleImageUrl = () => {
    let url = nftData.metadata.image || nftData.metadata.image_url;
    if (url.includes("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url || "";
  };

  const handleSelection = (selection: string) => {
    setSelectedButton(selection);
  };

  const handleMetadataViewButton = () => {
    window.open(nftData.token_url, "_blank");
  };

  return (
    <>
      <Container
        mt={30}
        maw={`${width > 600 && "600px"}`}
        miw={400}
        h="auto"
        px={20}
        style={{
          position: "relative",
          boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
          borderRadius: 35,
        }}
      >
        {handleImageUrl() ? (
          <>
            {selectedButton === "NFT Image" && (
              <Image src={handleImageUrl()} alt="nft-image" />
            )}

            {selectedButton === "Contract" && (
              <Container
                maw={`${width > 600 && "600px"}`}
                miw={400}
                style={{
                  display: "grid",
                  alignContent: "center",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <Container mb={5}>
                  {contractData.map(
                    ({ label, value, badge }, index) =>
                      value && (
                        <Box key={index}>
                          <Flex mb={`${index !== 4 ? "10px" : 0}`}>
                            <Text fz="sm" fw="bold">
                              {label}
                            </Text>
                            {badge && (
                              <Badge
                                sx={{
                                  cursor: "pointer",
                                  marginLeft: 10,
                                }}
                                size="sm"
                                variant="gradient"
                                gradient={{ from: "yellow", to: "orange" }}
                              >
                                view
                              </Badge>
                            )}
                          </Flex>
                          <Text fz={`${width > 600 ? "xl" : "lg"}`} mb={50}>
                            {value}
                          </Text>
                        </Box>
                      )
                  )}
                </Container>
              </Container>
            )}

            {selectedButton === "Metadata" && (
              <Container
                mt={30}
                maw={`${width > 600 && "600px"}`}
                miw={400}
                style={{
                  display: "grid",
                  alignContent: "center",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <Container my="32%">
                  <Flex>
                    <Text fz="md" fw="bold" mb={10}>
                      Metadata
                    </Text>
                    <Badge
                      sx={{
                        cursor: "pointer",
                        marginLeft: 10,
                      }}
                      size="md"
                      variant="gradient"
                      gradient={{ from: "yellow", to: "orange" }}
                      onClick={handleMetadataViewButton}
                    >
                      view
                    </Badge>
                  </Flex>
                  <Text fz="xl">
                    The metadata of an NFT can describe its characteristics and
                    properties, such as its name, description, transaction
                    history, traits, link to the hosted image, and more.
                    Additionally, the metadata of an NFT can point to the link
                    you use to view the NFT, whether it’s a photo or video.
                  </Text>
                </Container>
              </Container>
            )}
          </>
        ) : (
          <>
            <Image src="/imgs/Image_not_available.png" alt="nft-image" />
            <Button
              variant="gradient"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                borderRadius: 0,
              }}
              onClick={() => changeComponent(ComponentStates.INPUTS)}
              sx={{ cursor: "pointer" }}
            >
              Try again
            </Button>
          </>
        )}
      </Container>
      <Container mt={20}>
        <Flex justify="center">
          <SegmentedControl
            radius="xl"
            size="lg"
            data={["NFT Image", "Contract", "Metadata"]}
            classNames={classes}
            onChange={(value) => handleSelection(value)}
          />
        </Flex>
      </Container>
    </>
  );
}
