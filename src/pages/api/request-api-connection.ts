import { NextApiRequest, NextApiResponse } from "next";
import { TokenRequest } from "@/data-schema/types";
import axios from "axios";

export default async function RequestApiConnection(
  req: NextApiRequest,
  res: NextApiResponse<TokenRequest | string>
) {
  const { chainId, testApiKey } = req.body as {
    chainId: number;
    testApiKey: string;
  };

  const endpoint = `https://api.covalenthq.com/v1/11297108109/block_v2/latest/?key=${testApiKey}`;

  try {
    const response = await axios.get(endpoint);
    const { data } = response;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error");
  }
}
