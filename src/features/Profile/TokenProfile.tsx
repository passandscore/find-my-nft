import styled from "@emotion/styled";
import { useState } from "react";
import { ContractSelectorData } from "@/data-schema/types";
import { useBlockExplorerByChainId } from "@/web3/useBlockExplorerByChainId";
import { TokenImageHandler } from "@/features/Profile/TokenImageHandler";
import { IconWindowMaximize } from "@tabler/icons-react";
import {
  ContractDetails,
  MetadataDetails,
  SegmentedController,
} from "@/features/Profile/";
import { ProfileButtonOptions } from "@/data-schema/enums";
import { Flex, Loader } from "@mantine/core";

const ImageContainer = styled.div`
  margin: 30px auto;
  margin-bottom: 10px;
  max-width: 600px;
  min-width: 400px;
  height: 70vh;
  padding: 20px;
  position: relative;
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

const OpenInWindowButton = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 1;
  cursor: pointer;
  border-radius: 50%;
  color: white;
  background-image: linear-gradient(45deg, #ffb800, #ff6b00);
  padding: 15px;
  padding-bottom: 10px;

  &:hover {
    transform: scale(1.1);
  }
`;

export function TokenProfile({
  nftData,
  width,
  isLoadingProfile,
}: {
  nftData: any;
  width: number;
  isLoadingProfile?: boolean;
}) {
  const { contract_address, contract_name, contract_ticker_symbol } =
    nftData.contractData;
  const { image, token_url } = nftData.metadata;
  const { original_owner, owner } = nftData.owners;

  const [selectedButton, setSelectedButton] = useState(
    ProfileButtonOptions.NFT_IMAGE
  );

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
      badgeUrl: useBlockExplorerByChainId(
        nftData.selectedChainId,
        contract_address
      ),
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
      badgeUrl: useBlockExplorerByChainId(
        nftData.selectedChainId,
        original_owner
      ),
    },
    {
      label: "Current Owner",
      value: owner,
      badge: true,
      badgeUrl: useBlockExplorerByChainId(nftData.selectedChainId, owner),
    },
  ] as ContractSelectorData[];

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
        {selectedButton === ProfileButtonOptions.NFT_IMAGE && hasImage && (
          <>
            {!isLoadingProfile ? (
              <>
                <OpenInWindowButton
                  onClick={() => window.open(image, "_blank")}
                >
                  <IconWindowMaximize />
                </OpenInWindowButton>
                <TokenImageHandler src={image} />
              </>
            ) : (
              <Flex
                justify="center"
                align="center"
                style={{
                  height: "100%",
                }}
              >
                <Loader variant="bars" color="yellow" />
              </Flex>
            )}
          </>
        )}

        {/* Display contract data */}
        {selectedButton === ProfileButtonOptions.CONTRACT && (
          <ExternalDataContainer>
            <ContractDetails
              contractData={contractData}
              contractName={contract_name}
              width={width}
            />
          </ExternalDataContainer>
        )}

        {/* Display metadata */}
        {selectedButton === ProfileButtonOptions.METADATA && (
          <ExternalDataContainer>
            <MetadataDetails
              tokenUrl={token_url}
              handleMetadataViewButton={handleMetadataViewButton}
            />
          </ExternalDataContainer>
        )}
      </ImageContainer>

      {/* Display Button Controls */}
      <SegmentedController handleSelection={handleSelection} />
    </>
  );
}
