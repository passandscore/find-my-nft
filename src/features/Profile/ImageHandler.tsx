import React, { useState } from "react";
import Image from "next/image";
import { IPFS_GATEWAY } from "@/web3/constants";

const handleImageUrl = (image: string) => {
  if (image.includes("ipfs://")) {
    return image.replace("ipfs://", IPFS_GATEWAY);
  }
  return image || "";
};

export const ImageHandler = ({ src }: { src: string }) => {
  const [imageUrl, setImageUrl] = useState(handleImageUrl(src));

  return (
    <Image
      src={imageUrl}
      alt="Nft-Image"
      quality={75}
      width={100}
      height={100}
      style={{ width: "100%", height: "100%" }}
      onError={() => setImageUrl("/imgs/placeholder.png")}
    />
  );
};
