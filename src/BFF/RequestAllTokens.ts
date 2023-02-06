export const prepareRequestAllTokens = async (
  chainId: string,
  address: string,
  handleIsError: (error: boolean) => void,
  providedApiKey: string
) => {
  try {
    // used to control the fetch request and abort it if it takes too long
    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), 10000); // 10sec

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
          providedApiKey,
        }),
        signal,
      }
    );

    if (!convalentData.ok) {
      return {
        networkError: true,
      };
    }

    const convalentDataJson = await convalentData.json();

    const totalItems = convalentDataJson?.data?.items.length;
    const hasData = totalItems > 0;

    const { error_message } = convalentDataJson;

    if (!hasData) {
      throw new Error("No metadata found.");
    }

    if (error_message) {
      throw new Error(error_message);
    }

    return { data: convalentDataJson, error: "", networkError: false };
  } catch (e) {
    if ((e as Error).name == "AbortError") {
      handleIsError(true);
      return {
        error: "Covalent API timed out.",
      };
    }

    return {
      error: (e as Error).message,
    };
  }
};
