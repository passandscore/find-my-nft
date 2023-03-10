import { NextApiRequest, NextApiResponse } from "next";
import { TokenRequest } from "@/data-schema/types";
import axios from "axios";

export default async function ContractRequest(
  req: NextApiRequest,
  res: NextApiResponse<TokenRequest | string>
) {
  const { chainId, address, providedApiKey } = req.body as {
    chainId: number;
    address: string;
    providedApiKey: string;
  };

  const apiKey = providedApiKey || process.env.COVALENT_API_KEY;

  const endpoint = `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/?key=${apiKey}`;

  try {
    const response = await axios.get(endpoint);
    let { data } = response;

    data = {
      ...data,
      selectedChainId: chainId,
      selectedContractAddress: address,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error");
  }
}
