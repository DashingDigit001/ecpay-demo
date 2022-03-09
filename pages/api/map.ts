import ecpay_logistics from "ecpay_logistics_nodejs/lib/ecpay_logistics.js";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import CryptoJS from "crypto-js";
import urlencode from "urlencode";
export default async function handler(req, res: NextApiResponse) {
  let data = { TempLogisticsID: "0", GoodsAmount: 1000, GoodsName: "測試商品001", SnderName: "Hank", SenderZipCode: "12345", SenderAddress: "台中市南區", ServerReplyURL: "http://localhost:3000/cart", ClientReplyURL: "http://localhost:3000/cart" };
  var temp = {
    TempLogisticsID: "0",
    GoodsAmount: 500,
    IsCollection: "Y",
    GoodsName: "商品名",
    SenderName: "王小明",
    SenderZipCode: "123",
    SenderAddress: "xxxxxxxx",
    Remark: "xxx",
    ServerReplyURL: "https://ecpay-demo.vercel.app/api/hello",
    ClientReplyURL: "https://ecpay-demo.vercel.app/cart?cvs=2",
    Temperature: "0001",
    Specification: "0001",
    ScheduledPickupTime: "4",
    PackageCount: 1,
    LogisticsType: "CVS",
    LogisticsSubType: "UNIMARTC2C",
    ReceiverAddress: "xxxxxxxx",
    ReceiverCellPhone: "09xxxxxxxx",
    ReceiverPhone: "xxxxxxxx",
    ReceiverName: "陳小明",
    EnableSelectDeliveryTime: "Y",
    EshopMemberID: "xxxxyyyy123",
  };
  const encoded = urlencode(JSON.stringify(temp));

  let key = CryptoJS.enc.Utf8.parse("XBERn1YOvpM9nfZc"); // key：必須16個字元
  let iv = CryptoJS.enc.Utf8.parse("h1ONHk4P4yqbl5LK"); // 偏移量：必須16個字元
  let encrypted = CryptoJS.AES.encrypt(encoded, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // console.log(encrypted.toString());
  const response = await fetch("https://logistics-stage.ecpay.com.tw/Express/v2/RedirectToLogisticsSelection", {
    method: "POST",
    body: JSON.stringify({
      MerchantID: "2000933",
      RqHeader: {
        Timestamp: new Date().getTime().toString(),
        Revision: "1.0.0",
      },
      Data: encrypted.toString(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  res.send({
    htm: await response.text(),
  });
}
