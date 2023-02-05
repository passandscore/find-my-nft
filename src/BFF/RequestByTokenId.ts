import { ProfileTokenData } from "@/data-schema/types";
import { handleImageUrl } from "@/web3/useHandleImageUrl";

export const prepareRequestByTokenId = async (
  providedTokenId: string,
  chainId: string,
  address: string
) => {
  try {
    const convalentData = await fetch(
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
        }),
      }
    );
    if (!convalentData.ok) {
      return {
        networkError: true,
      };
    }
    const convalentDataJson = await convalentData.json();
    const hasData = Boolean(
      convalentDataJson?.data?.items[0]?.nft_data !== null
    );

    const { error_message } = convalentDataJson;

    if (!hasData) {
      throw new Error("No metadata found.");
    }

    if (error_message) {
      throw new Error(error_message);
    }

    // Fetch the metadata from the token_url
    const contractData = convalentDataJson?.data?.items[0];
    const tokenData = convalentDataJson?.data?.items[0]?.nft_data[0];

    const tokenMetadata = await fetch(
      `http://localhost:3000/api/token-metadata`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: tokenData?.token_url,
        }),
      }
    );

    const metadata = await tokenMetadata.json();
    const imageUrl = handleImageUrl(tokenData?.data?.metadata?.image!);

    const dataByTokenId = {
      metadata: {
        image:
          metadata?.image ||
          metadata?.image_url ||
          metadata?.external_data?.image ||
          tokenData?.ipfs_image ||
          tokenData?.image_url ||
          tokenData?.external_data.image ||
          "",
        token_url: imageUrl,
      },
      contractData: {
        contract_address: contractData?.contract_address,
        contract_name: contractData?.contract_name,
        contract_ticker_symbol: contractData?.contract_ticker_symbol,
      },
      owners: {
        original_owner: tokenData?.original_owner,
        owner: tokenData?.owner,
      },
      selectedChainId: chainId,
      selectedTokenId: providedTokenId,
      selectedContractAddress: address,
    } as ProfileTokenData;

    return { data: dataByTokenId, error: "" };
  } catch (e) {
    return {
      error: (e as Error).message,
    };
  }
};
