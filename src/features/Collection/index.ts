import dynamic from "next/dynamic";

export const CollectionImageHandler = dynamic(() =>
  import("./CollectionImageHandler").then(
    (module) => module.CollectionImageHandler
  )
);

export const CollectionImageOverlay = dynamic(() =>
  import("./CollectionImageOverlay").then(
    (module) => module.CollectionImageOverlay
  )
);

export const TokenCollection = dynamic(() =>
  import("./TokenCollection").then((module) => module.TokenCollection)
);
