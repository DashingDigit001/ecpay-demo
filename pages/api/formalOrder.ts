import ecpay_logistics from "ecpay_logistics_nodejs/lib/ecpay_logistics.js";
import { NextApiRequest, NextApiResponse } from "next";
import urlencode from "urlencode";

import ecpay from "../../utils/ecpay";

export default async function handler(req, res: NextApiResponse) {
  var temp = {
    TempLogisticsID: "8418",
  };
  const encoded = urlencode(JSON.stringify(temp));

  let key = "XBERn1YOvpM9nfZc"; // key：必須16個字元
  let iv = "h1ONHk4P4yqbl5LK"; // 偏移量：必須16個字元
  let encrypted = ecpay.aesEncode(key, iv, temp);

  console.log("================================encrypted================================");
  console.log(encrypted);
  console.log("================================encrypted================================");
  const response = await fetch("https://logistics-stage.ecpay.com.tw/Express/v2/CreateByTempTrade", {
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
