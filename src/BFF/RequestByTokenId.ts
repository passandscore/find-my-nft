import { ProfileTokenData } from "@/data-schema/types";
import { handleUrl } from "@/web3/useHandleImageUrl";
import { ErrorMessages } from "@/data-schema/enums";
import { showNotification } from "@mantine/notifications";

export const prepareRequestByTokenId = async (
  providedTokenId: string,
  chainId: string,
  address: string,
  providedApiKey: string,
  handleIsLoading?: (isLoading: boolean) => void
) => {
  try {
    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), 20000); // 10sec

    const covalentData = await fetch(
      `http://localhost:3000/api/request-by-token-id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId,
          address,
          providedTokenId,
          providedApiKey,
        }),
        signal,
      }
    );

    if (!covalentData.ok) {
      throw new Error(ErrorMessages.NETWORK);
    }

    const covalentDataJson = await covalentData.json();
    const {
      contract_name,
      contract_address,
      contract_ticker_symbol,
      nft_data,
    } = covalentDataJson?.data?.items[0];

    const { error_message } = covalentDataJson;
    if (error_message) {
      throw new Error(error_message);
    }

    if (!contract_name) {
      throw new Error(ErrorMessages.CONTRACT);
    }

    const hasData = Boolean(nft_data !== null);
    if (!hasData) {
      throw new Error(ErrorMessages.METADATA);
    }

    const tokenData = nft_data[0];
    const hasExternalData = Boolean(tokenData?.external_data !== null);

    let fetchedMetadata = {} as any;
    if (!hasExternalData) {
      const tokenMetadata = await fetch(
        `http://localhost:3000/api/token-metadata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: handleUrl(tokenData?.token_url),
          }),
        }
      );

      fetchedMetadata = await tokenMetadata.json();
    }

    const handleMetadataImage = () => {
      if (hasExternalData) {
        const metadata = tokenData?.external_data;
        return (
          metadata.image ||
          metadata.image_url ||
          metadata.external_data?.image ||
          metadata.nft.image ||
          metadata.external_url ||
          ""
        );
      }

      if (Object.keys(fetchedMetadata).length > 0) {
        return fetchedMetadata.nft.image || "";
      }

      return (
        tokenData?.ipfs_image ||
        tokenData?.image_url ||
        tokenData?.external_data.image ||
        ""
      );
    };

    const dataByTokenId = {
      metadata: {
        image: handleMetadataImage(),
        token_url: handleUrl(tokenData?.token_url),
      },
      contractData: {
        contract_address,
        contract_name,
        contract_ticker_symbol,
      },
      owners: {
        original_owner: tokenData?.original_owner,
        owner: tokenData?.owner,
      },
      selectedChainId: chainId,
      selectedTokenId: providedTokenId,
      selectedContractAddress: address,
    } as ProfileTokenData;

    return { data: dataByTokenId };
  } catch (e) {
    handleIsLoading && handleIsLoading(false);

    if ((e as Error).name == "AbortError") {
      showNotification({
        title: "Error",
        message: ErrorMessages.NETWORK_TOKEN_ERROR,
        color: "red",
      });
    } else {
      showNotification({
        title: "Error",
        message: (e as Error).message,
        color: "red",
      });
    }
  }
};
