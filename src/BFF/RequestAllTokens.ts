// import { ProfileTokenData } from "@/data-schema/types";
import { prepareRequestByTokenId } from "@/BFF/RequestByTokenId";

export const prepareRequestAllTokens = async (
  chainId: string,
  address: string
) => {
  try {
    const convalentData = await fetch(
      `http://localhost:3000/api/request-by-contract`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId,
          address,
        }),
      }
    );

    if (!convalentData.ok) {
      return {
        networkError: true,
      };
    }

    const convalentDataJson = await convalentData.json();
    console.log("convalentDataJson", convalentDataJson);
    const totalItems = convalentDataJson?.data?.items.length;
    const hasData = totalItems > 0;

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

    // Fetch the metadata for each token
    // const tokenData = await Promise.all(
    //   convalentDataJson?.data?.items.map(async (item: any) => {
    //     const tokenMetadata = await fetch(
    //       `http://localhost:3000/api/token-metadata`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           url: item?.nft_data[0]?.token_url,
    //         }),
    //       }
    //     );

    //     const tokenMetadataJson = await tokenMetadata.json();

    //     return {
    //       ...item,
    //       metadata: tokenMetadataJson,
    //     };
    //   })
    // );

    // const Metadata = tokenData;
    // console.log("Metadata", Metadata);

    return { data: convalentDataJson, error: "" };
  } catch (e) {
    return {
      error: (e as Error).message,
    };
  }
};
