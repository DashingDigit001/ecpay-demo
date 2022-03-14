import { NextApiRequest, NextApiResponse } from "next";
import ecpay from "../../utils/ecpay";

export default async function handler(req, res: NextApiResponse) {
  var temp = {
    MerchantID: "2000933",
    LogisticsID: ["1888028"],
    LogisticsSubType: "UNIMARTC2C",
  };

  let key = "XBERn1YOvpM9nfZc";
  let iv = "h1ONHk4P4yqbl5LK";
  let encrypted = ecpay.aesEncode(key, iv, temp);

  const response = await fetch("https://logistics-stage.ecpay.com.tw/Express/v2/PrintTradeDocument", {
    method: "POST",
    body: JSON.stringify({
      MerchantID: "2000933",
      RqHeader: {
        Timestamp: new Date().getTime().toString(),
        Revision: "1.0.0",
      },
      Data: encrypted,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  res.send({
    htm: await response.text(),
  });
}
