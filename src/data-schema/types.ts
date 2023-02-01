export type TokenRequest = {
  chainId: number;
  address: string;
  providedTokenId?: string;
};

export type ProfileTokenData = {
  metadata: {
    image: string;
  };
  contractData: {
    contract_address: string;
    contract_name: string;
    contract_ticker_symbol: string;
  };
  owners: {
    original_owner: string;
    owner: string;
  };
  selectedChainId: string;
  selectedTokenId: string;
  selectedContractAddress: string;
};

export type ContractSelectorData = {
  label: string;
  value: string;
  badge: boolean;
  badgeUrl: string;
};
