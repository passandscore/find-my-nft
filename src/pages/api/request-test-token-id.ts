import { NextApiRequest, NextApiResponse } from "next";
import { TokenRequest } from "@/data-schema/types";
import axios from "axios";

export default async function TokenRequestTestById(
  req: NextApiRequest,
  res: NextApiResponse<TokenRequest | string>
) {
  const { chainId, address, providedTokenId, testApiKey, testApiVersion } =
    req.body as {
      chainId: number;
      address: string;
      providedTokenId: string;
      testApiKey: string;
      testApiVersion: string;
    };

  const endpoint = `https://api.covalenthq.com/${testApiVersion}/${chainId}/tokens/${address}/nft_metadata/${providedTokenId}/?key=${testApiKey}`;

  try {
    const response = await axios.get(endpoint);
    const { data } = response;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error");
  }
}
