import {
  Container,
  Image,
  Flex,
  SegmentedControl,
  createStyles,
  Box,
  Text,
  Badge,
} from "@mantine/core";
import styled from "@emotion/styled";
import { useState } from "react";
import { ProfileButtonOptions } from "@/data-schema/enums";
import { ContractSelectorData } from "@/data-schema/types";
import { useBlockExplorerByChainId } from "@/web3/useBlockExplorerByChainId";
import { ImageNotFound } from "@/components/ImageNotFound";

// CSS styling for the component
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

const ImageContainer = styled.div`
  margin: 30px auto;
  max-width: 600px;
  min-width: 400px;
  height: 70vh;
  padding: 20px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border-radius: 35px;
`;

const ExternalDataContainer = styled.div`
  margin: 30px auto;
  max-width: 600px;
  min-width: 400px;
  display: grid;
  align-content: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ContractDataContainer = styled.div`
  margin-bottom: 5px;
  margin-left: 40px;
`;

export function Profile({ nftData, width }: { nftData: any; width: number }) {
  // Deconstructing the nftData object
  const { contract_address, contract_name, contract_ticker_symbol } =
    nftData.contractData;
  const { image, token_url } = nftData.metadata;
  const { original_owner, owner } = nftData.owners;

  // React state
  const [selectedButton, setSelectedButton] = useState(
    ProfileButtonOptions.NFT_IMAGE
  );

  const { classes } = useStyles();

  const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
  const hasImage = image;

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
      badgeUrl: useBlockExplorerByChainId(nftData.chainId, contract_address),
    },
    {
      label: "Contract Symbol",
      value: contract_ticker_symbol,
      badge: false,
    },
    {
      label: "Original Owner",
      value: original_owner,
      badge: true,
      badgeUrl: useBlockExplorerByChainId(nftData.chainId, original_owner),
    },
    {
      label: "Current Owner",
      value: owner,
      badge: true,
      badgeUrl: useBlockExplorerByChainId(nftData.chainId, owner),
    },
  ] as ContractSelectorData[];

  const handleImageUrl = () => {
    let url = image;

    if (url.includes("ipfs://")) {
      return url.replace("ipfs://", IPFS_GATEWAY);
    }
    return url || "";
  };

  const handleSelection = (selection: ProfileButtonOptions) => {
    setSelectedButton(selection);
  };

  const handleMetadataViewButton = () => {
    window.open(token_url, "_blank");
  };

  return (
    <>
      {/* Display NFT image */}
      <ImageContainer>
        {selectedButton === ProfileButtonOptions.NFT_IMAGE &&
          (hasImage ? (
            <Image src={handleImageUrl()} alt="Nft-Image" />
          ) : (
            <ImageNotFound />
          ))}

        {/* Display contract data */}
        {selectedButton === ProfileButtonOptions.CONTRACT && (
          <ExternalDataContainer>
            <ContractDataContainer>
              {contract_name ? (
                contractData.map(
                  ({ label, value, badge, badgeUrl }, index) =>
                    value && (
                      <Box key={index}>
                        <Flex align="center">
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
                              onClick={() => window.open(badgeUrl, "_blank")}
                            >
                              VIEW
                            </Badge>
                          )}
                        </Flex>
                        <Text fz={`${width > 600 ? "xl" : "lg"}`} mb={50}>
                          {value}
                        </Text>
                      </Box>
                    )
                )
              ) : (
                // Displaying a message if no contract data is available
                <Text fz="xl">No contract data available</Text>
              )}
            </ContractDataContainer>
          </ExternalDataContainer>
        )}

        {selectedButton === ProfileButtonOptions.METADATA && (
          <ExternalDataContainer>
            <Container mb={100}>
              {/* Displaying the metadata of the NFT */}
              {token_url ? (
                <>
                  <Flex align="center">
                    <Text fz="md" fw="bold">
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
                      VIEW
                    </Badge>
                  </Flex>
                  <Text fz="xl">
                    The metadata of an NFT can describe its characteristics and
                    properties, such as its name, description, transaction
                    history, traits, link to the hosted image, and more.
                    Additionally, the metadata of an NFT can point to the link
                    you use to view the NFT, whether it’s a photo or video.
                  </Text>
                </>
              ) : (
                // Displaying a message if no metadata is available
                <Text fz="xl">No metadata available</Text>
              )}
            </Container>
          </ExternalDataContainer>
        )}
      </ImageContainer>
      <Container>
        <Flex justify="center">
          <SegmentedControl
            radius="xl"
            size="lg"
            data={[
              ProfileButtonOptions.NFT_IMAGE,
              ProfileButtonOptions.CONTRACT,
              ProfileButtonOptions.METADATA,
            ]}
            classNames={classes}
            onChange={(value: ProfileButtonOptions) => handleSelection(value)}
          />
        </Flex>
      </Container>
    </>
  );
}
