import React, { useState } from "react";
import Image from "next/image";
import { IPFS_GATEWAY } from "@/web3/constants";

const handleUrl = (image: string) => {
  if (image.includes("ipfs://")) {
    return image.replace("ipfs://", IPFS_GATEWAY);
  }
  return image || "";
};

export const TokenImageHandler = ({ src }: { src: string }) => {
  const [imageUrl, setImageUrl] = useState(handleUrl(src));

  return (
    <Image
      src={imageUrl}
      alt="Nft-Image"
      quality={100}
      width={100}
      height={100}
      style={{ width: "100%", height: "100%" }}
      onError={() => setImageUrl("/imgs/placeholder-lg.png")}
    />
  );
};
