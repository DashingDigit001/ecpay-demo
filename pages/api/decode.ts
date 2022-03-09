import { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";
import urlencode from "urlencode";

export default async function handler(req, res: NextApiResponse) {
  let lockedData = "uvI4yrErM37XNQkXGAgRgJAgHn2t72jahaMZzYhWL1HmvH4WV18VJDP2i9pTbC+tby5nxVExLLFyAkbjbS2Dvg==";

  let key = CryptoJS.enc.Utf8.parse("ejCk326UnaZWKisg"); // key：必須16個字元
  let iv = CryptoJS.enc.Utf8.parse("q9jcZX8Ib9LM8wYk");
  var bytes = CryptoJS.AES.decrypt(lockedData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  console.log(bytes.toString(CryptoJS.enc.Utf8));
  let data = urlencode.decode(bytes.toString(CryptoJS.enc.Utf8));
  console.log(data);

  res.send({
    htm: "decode",
  });
}
