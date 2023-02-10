import { IPFS_GATEWAY } from "@/web3/constants";

export const handleUrl = (image: string) => {
  try {
    let url = image;

    if (url.includes("ipfs://")) {
      return url.replace("ipfs://", IPFS_GATEWAY);
    }

    return url || "";
  } catch (e) {
    return {
      error: {
        message: "API Error. No metadata found.",
      },
    };
  }
};
