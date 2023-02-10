export enum ChainIds {
  //Mainnets
  MAIN_NET_ID = 1,
  POLYGON = 137,
  BINANCE_SMART_CHAIN = 56,
  //Testnets
  GOERLI_CHAIN_ID = 5,
  RINKEBY_CHAIN_ID = 4,
  KOVAN_CHAIN_ID = 42,
  ROPSTEN_CHAIN_ID = 3,
  BINANCE_SMART_CHAIN_TESTNET = 97,
  MUMBAI = 80001,
}

export enum ComponentStates {
  INPUTS = "INPUTS",
  COLLECTION = "COLLECTION",
  TOKEN_PROFILE = "TOKEN_PROFILE",
}

export enum ProfileButtonOptions {
  NFT_IMAGE = "NFT Image",
  CONTRACT = "Contract",
  METADATA = "Metadata",
}

export enum NetworkEnviroments {
  MAINNET = "MAINNET",
  TESTNET = "TESTNET",
}

export enum ErrorMessages {
  NETWORK = "An error occurred while fetching the data. Try providing a different API key or version from the `need to know` section.",
  CONTRACT = "No contract found. Check your address and network",
  METADATA = "No metadata found. Check your address and network",
  API_TIMEOUT = "The API is taking too long to respond",
  NETWORK_TOKEN_ERROR = "The API is taking too long to respond. Some tokens may not be displayed. Try again.",
}
