import { ProfileTokenData } from "@/data-schema/types";

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
    console.log("convalentData", convalentData);
    if (!convalentData.ok) {
      return {
        networkError: true,
      };
    }
    const convalentDataJson = await convalentData.json();
    const hasData = Boolean(convalentDataJson?.data?.items[0]?.nft_data);

    // Check if there is an error message
    const { error_message } = convalentDataJson;

    if (!hasData) {
      throw new Error(
        "No external data found. Ensure you have the correct contract address and token id."
      );
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

    const dataByTokenId = {
      metadata: {
        image:
          metadata?.image ||
          metadata?.image_url ||
          metadata?.external_data?.image ||
          tokenData?.ipfs_image ||
          "",
        token_url: tokenData?.token_url || "",
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
