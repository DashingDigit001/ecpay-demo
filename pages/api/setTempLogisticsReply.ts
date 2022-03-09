import ecpay_payment from "ecpay_aio_nodejs/lib/ecpay_payment.js";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req, res: NextApiResponse) {
  console.log("hello temp");
  console.log("========================================================================================");
  console.log(req.body);
  console.log("========================================================================================");
  res.send({
    htm: "success",
  });
}
