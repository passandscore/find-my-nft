import { ProfileTokenData } from "@/data-schema/types";
import { handleImageUrl } from "@/web3/useHandleImageUrl";
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

    // Fetch the metadata from the token_url
    const tokenData = nft_data[0];

    const dataByTokenId = {
      metadata: {
        image: tokenData?.external_data.image || "",
        token_url: handleImageUrl(tokenData?.token_url),
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

    showNotification({
      title: "Error",
      message: (e as Error).message,
      color: "red",
    });
  }
};
