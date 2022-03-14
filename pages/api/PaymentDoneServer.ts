import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res: NextApiResponse) {
  res.send("1|OK");
}
