import { ErrorMessages } from "@/data-schema/enums";
import { showNotification } from "@mantine/notifications";

export const prepareRequestAllTokens = async (
  chainId: string,
  address: string,
  providedApiKey: string,
  handleIsLoading: (isLoading: boolean) => void
) => {
  try {
    // used to control the fetch request and abort it if it takes too long
    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), 20000); // 20sec

    const covalentData = await fetch(
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

    if (!covalentData.ok) {
      throw new Error(ErrorMessages.NETWORK);
    }

    const covalentDataJson = await covalentData.json();
    const totalItems = covalentDataJson?.data?.items.length;
    const hasData = totalItems > 0;

    const { error_message } = covalentDataJson;
    if (error_message) {
      throw new Error(error_message);
    }

    if (!hasData) {
      throw new Error(ErrorMessages.METADATA);
    }

    return { data: covalentDataJson };
  } catch (e) {
    handleIsLoading(false);

    if ((e as Error).name == "AbortError") {
      showNotification({
        title: "Error",
        message: ErrorMessages.API_TIMEOUT,
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
