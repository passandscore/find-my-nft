import { ErrorMessages } from "@/data-schema/enums";
import { showNotification } from "@mantine/notifications";

export const prepareRequestInitialTokenById = async (
  providedTokenId: string,
  chainId: string,
  address: string,
  handleIsLoading: (isLoading: boolean) => void
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
        }),
      }
    );

    if (!covalentData.ok) {
      throw new Error(ErrorMessages.NETWORK);
    }

    const covalentDataJson = await covalentData.json();
    const { contract_name, nft_data } = covalentDataJson?.data?.items[0];

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

    return { hasData };
  } catch (e) {
    handleIsLoading(false);

    showNotification({
      title: "Error",
      message: (e as Error).message,
      color: "red",
    });
  }
};
