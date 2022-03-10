import CryptoJS from "crypto-js";
import urlencode from "urlencode";
import { parse, ParsedUrlQuery } from "querystring";

var ecpay = {
  aesEncode: (key: string, iv: string, orderData: any) => {
    const encoded = urlencode(JSON.stringify(orderData));

    var _key = CryptoJS.enc.Utf8.parse(key);
    var _iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(encoded, _key, {
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },

  aesDecode: (key: string, iv: string, lockedData: string) => {
    var _key = CryptoJS.enc.Utf8.parse(key);
    var _iv = CryptoJS.enc.Utf8.parse(iv);
    var bytes = CryptoJS.AES.decrypt(lockedData, _key, {
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(urlencode.decode(bytes.toString(CryptoJS.enc.Utf8)));
  },

  getFormData: async (context) => {
    const streamPromise = new Promise((resolve, reject) => {
      var postBody = "";

      context.req.on("data", (data) => {
        postBody += data.toString();
      });

      context.req.on("end", () => {
        const postData: ParsedUrlQuery = parse(postBody);
        resolve(postData);
      });
    });

    return streamPromise;
  },
};

export default ecpay;
