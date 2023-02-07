import { ProfileTokenData } from "@/data-schema/types";
import { handleImageUrl } from "@/web3/useHandleImageUrl";

export const prepareRequestByTokenId = async (
  providedTokenId: string,
  chainId: string,
  address: string,
  providedApiKey: string
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
          providedApiKey,
        }),
      }
    );
    if (!convalentData.ok) {
      return {
        networkError: true,
      };
    }
    const convalentDataJson = await convalentData.json();
    const hasContractData = Boolean(
      convalentDataJson?.data?.items[0]?.contract_name
    );

    const { error_message } = convalentDataJson;

    if (!hasContractData) {
      return { error: "No contract found. Check your address and network." };
    }

    if (error_message) {
      throw new Error(error_message);
    }

    // Fetch the metadata from the token_url
    const contractData = convalentDataJson?.data?.items[0];
    const tokenData = convalentDataJson?.data?.items[0]?.nft_data[0];

    const dataByTokenId = {
      metadata: {
        image: tokenData?.external_data.image || "",
        token_url: handleImageUrl(tokenData?.token_url),
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
