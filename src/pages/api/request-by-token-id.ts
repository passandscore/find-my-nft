import { NextApiRequest, NextApiResponse } from "next";
import { TokenRequest } from "@/data-schema";
import axios from "axios";

export default async function TokenRequestById(
  req: NextApiRequest,
  res: NextApiResponse<TokenRequest | string>
) {
  const { chainId, address, providedTokenId } = req.body as {
    chainId: number;
    address: string;
    providedTokenId: string;
  };

  const endpoint = `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${providedTokenId}/?key=${process.env.COVALENT_KEY}`;

  try {
    const response = await axios.get(endpoint);
    const { data } = response;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error");
  }
}
