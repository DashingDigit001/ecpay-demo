import { NextApiRequest, NextApiResponse } from "next";
import urlencode from "urlencode";

import ecpay from "../../utils/ecpay";

export default async function handler(req, res: NextApiResponse) {
  //送出正是訂單前，先把暫存訂單資料解密，TempLogisticsID

  console.log(req);
  console.log(req.body);
  var temp = {
    MerchantID: "2000933",
    LogisticsID: "1888028",
  };

  let key = "XBERn1YOvpM9nfZc"; // key：必須16個字元
  let iv = "h1ONHk4P4yqbl5LK"; // 偏移量：必須16個字元

  res.send(" 1|OK");
}
