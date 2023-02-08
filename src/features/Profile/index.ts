import dynamic from "next/dynamic";

export const TokenImageHandler = dynamic(
  () =>
    import("./TokenImageHandler").then((module) => module.TokenImageHandler),
  { ssr: false }
);

export const TokenProfile = dynamic(
  () => import("./TokenProfile").then((module) => module.TokenProfile),
  { ssr: false }
);

export const ContractDetails = dynamic(
  () => import("./ContractDetails").then((module) => module.ContractDetails),
  { ssr: false }
);

export const MetadataDetails = dynamic(
  () => import("./MetadataDetails").then((module) => module.MetadataDetails),
  { ssr: false }
);

export const SegmentedController = dynamic(
  () =>
    import("./SegmentedController").then(
      (module) => module.SegmentedController
    ),
  { ssr: false }
);
