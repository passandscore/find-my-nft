import React, { useState } from "react";
import Image from "next/image";

export const ImageHandler = ({
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
      style={{
        width: handleDimensions(),
        height: handleDimensions(),
        // objectFit: "contain",
        objectFit: "scale-down",
      }}
      width={100}
      height={350}
      quality={10}
      priority
      onLoadingComplete={() => allImagesLoaded(index + 1)}
    />
  );
};
