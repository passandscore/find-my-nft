export enum ComponentStates {
  INPUTS = "INPUTS",
  GALLERY = "GALLERY",
  PROFILE = "PROFILE",
  METADATA = "METADATA",
}

export type TokenRequest = {
  chainId: number;
  address: string;
  providedTokenId: string;
};
