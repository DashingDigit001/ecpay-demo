import ecpay_payment from "ecpay_aio_nodejs/lib/ecpay_payment.js";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req, res: NextApiResponse) {
  console.log("========================================================================================");
  console.log(req);
  console.log("========================================================================================");
  res.send({
    htm: "success",
  });
}