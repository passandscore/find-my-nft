import React, { useState } from "react";
import Image from "next/image";

export const CollectionImageHandler = ({
  src,
  allImagesLoaded,
  index,
  handleDimensions,
}: {
  src: string;
  allImagesLoaded: (img: number) => void;
  handleDimensions: () => string;

  index: number;
}) => {
  const [imageUrl, setImageUrl] = useState(src);

  return (
    <Image
      src={imageUrl}
      onError={() => setImageUrl("/imgs/placeholder.png")}
      alt="NFT"
      width={Number(handleDimensions())}
      height={Number(handleDimensions())}
      quality={10}
      onLoadingComplete={() => allImagesLoaded(index + 1)}
    />
  );
};
