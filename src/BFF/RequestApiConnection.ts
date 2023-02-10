export const RequestApiConnection = async (
  chainId: string,
  testApiKey: string
) => {
  try {
    const covalentData = await fetch(
      `http://localhost:3000/api/request-api-connection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId,
          testApiKey,
        }),
      }
    );
    if (!covalentData.ok) {
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
