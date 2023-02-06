export const prepareRequestInitialTokenById = async (
  providedTokenId: string,
  chainId: string,
  address: string,
  handleIsError: (error: boolean) => void
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
      handleIsError(true);
      return { hasInitialData: false, error: "", networkError: true };
    }

    const convalentDataJson = await convalentData.json();
    const { contract_name } = convalentDataJson?.data?.items[0];
    const hasData = Boolean(
      convalentDataJson?.data?.items[0]?.nft_data !== null
    );

    const { error_message } = convalentDataJson;

    if (!hasData || error_message) {
      handleIsError(true);
      return { hasInitialData: false, error: "", contractName: contract_name };
    }

    return { hasInitialData: true, error: "", contractName: contract_name };
  } catch (e) {
    return {
      error: (e as Error).message,
    };
  }
};
