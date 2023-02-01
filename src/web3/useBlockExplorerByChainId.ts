import { useMemo } from "react";
import { ChainIds } from "@/data-schema/enums";

export function useBlockExplorerByChainId(
  chainId: number,
  addressHash: string
): string {
  const blockExplorerByChainId = useMemo(() => {
    switch (chainId) {
      case ChainIds.MAIN_NET_ID:
        return `https://etherscan.io/address/${addressHash}`;
      case ChainIds.POLYGON:
        return `https://polygonscan.com/address/${addressHash}`;
      case ChainIds.BINANCE_SMART_CHAIN:
        return `https://bscscan.com/address/${addressHash}`;
      case ChainIds.GOERLI_CHAIN_ID:
        return `https://goerli.etherscan.io/address/${addressHash}`;
      case ChainIds.RINKEBY_CHAIN_ID:
        return `https://rinkeby.etherscan.io/address/${addressHash}`;
      case ChainIds.KOVAN_CHAIN_ID:
        return `https://kovan.etherscan.io/address/${addressHash}`;
      case ChainIds.ROPSTEN_CHAIN_ID:
        return `https://ropsten.etherscan.io/address/${addressHash}`;
      case ChainIds.BINANCE_SMART_CHAIN_TESTNET:
        return `https://testnet.bscscan.com/address/${addressHash}`;
      case ChainIds.MUMBAI:
        return `https://mumbai.polygonscan.com/address/${addressHash}`;

      default:
        return `https://etherscan.io/address/${addressHash}`;
    }
  }, [chainId, addressHash]);

  return blockExplorerByChainId;
}
