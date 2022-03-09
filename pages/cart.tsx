import CryptoJS from "crypto-js";
import urlencode from "urlencode";

import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { parse, ParsedUrlQuery } from "querystring";
const Cart: NextPage = (props: any) => {
  const [result, setResult] = useState("");
  const router = useRouter();
  if (router.query.cvs == "1") {
    return <div dangerouslySetInnerHTML={MyComponent(props.result.htm.toString())} />;
  } else if (router.query.cvs == "2") {
    let res = props.result;
    console.log("props.result type:", typeof props.result);
    console.log("props.result type:", props.ResultData);
    console.log("props.result type:", JSON.stringify(props.result.ResultData));
    // console.log("props.result:", props.result.toString());

    // let lockedData = "uvI4yrErM37XNQkXGAgRgJAgHn2t72jahaMZzYhWL1HmvH4WV18VJDP2i9pTbC+tby5nxVExLLFyAkbjbS2Dvg==";

    // let key = CryptoJS.enc.Utf8.parse("ejCk326UnaZWKisg"); // key：必須16個字元
    // let iv = CryptoJS.enc.Utf8.parse("q9jcZX8Ib9LM8wYk");
    // var bytes = CryptoJS.AES.decrypt(lockedData, key, {
    //   iv: iv,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7,
    // });
    // console.log(bytes.toString(CryptoJS.enc.Utf8));
    // let data = urlencode.decode(bytes.toString(CryptoJS.enc.Utf8));
    // console.log(data);
  }

  return (
    <div className="container">
      <button
        onClick={async () => {
          location.href = "https://ecpay-demo.vercel.app/cart?cvs=1";
          // router.p
        }}
      >
        aasdad
      </button>
    </div>
  );
};

function MyComponent(html) {
  return { __html: html };
}

// This gets called on every request
export async function getServerSideProps(context) {
  console.log(context.query);
  if (context.query.cvs == 2) {
    const streamPromise = new Promise((resolve, reject) => {
      let postBody = "";

      context.req.on("data", (data) => {
        // convert Buffer to string
        postBody += data.toString();
      });

      context.req.on("end", () => {
        const postData: ParsedUrlQuery = parse(postBody);

        resolve(postData);
      });
    });

    const result = await streamPromise;
    return { props: { result } };
  } else {
    const result = await (await fetch("https://ecpay-demo.vercel.app/api/map")).json();
    return { props: { result } };
  }
}

export default Cart;
