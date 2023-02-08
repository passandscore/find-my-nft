import dynamic from "next/dynamic";

export const TokenImageHandler = dynamic(() =>
  import("./TokenImageHandler").then((module) => module.TokenImageHandler)
);

export const TokenProfile = dynamic(() =>
  import("./TokenProfile").then((module) => module.TokenProfile)
);

export const ContractDetails = dynamic(() =>
  import("./ContractDetails").then((module) => module.ContractDetails)
);

export const MetadataDetails = dynamic(() =>
  import("./MetadataDetails").then((module) => module.MetadataDetails)
);

export const SegmentedController = dynamic(() =>
  import("./SegmentedController").then((module) => module.SegmentedController)
);
