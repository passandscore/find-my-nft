export const RequestTestTokenId = async (
  providedTokenId: string,
  chainId: string,
  address: string,
  testApiKey: string
) => {
  try {
    const convalentData = await fetch(
      `http://localhost:3000/api/request-test-token-id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId,
          address,
          providedTokenId,
          testApiKey,
        }),
      }
    );
    if (!convalentData.ok) {
      return {
        networkError: true,
      };
    }

    return {
      networkError: false,
    };
  } catch (e) {
    return {
      error: (e as Error).message,
    };
  }
};
