import { NextApiRequest, NextApiResponse } from "next";
import { TokenRequest } from "@/data-schema/types";
import axios from "axios";

export default async function ContractRequest(
  req: NextApiRequest,
  res: NextApiResponse<TokenRequest | string>
) {
  const { url } = req.body as {
    url: string;
  };

  try {
    const response = await axios.get(url, {
      headers: {
        "Allow-Control-Allow-Origin": "*", // Required for CORS support to work
      },
    });
    const { data } = response;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error");
  }
}
