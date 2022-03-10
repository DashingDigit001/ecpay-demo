import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { parse, ParsedUrlQuery } from "querystring";
import ecpay from "../utils/ecpay";
const SendOrder: NextPage = (props: any) => {
  const router = useRouter();
  let order = {
    LogisticsID: "",
    RtnCode: 0,
    RtnMsg: "",
  };

  switch (router.query.cvs) {
    case "3":
      return <div dangerouslySetInnerHTML={MyComponent(props.result.htm.toString())} />;
    case "1":
      // return <div dangerouslySetInnerHTML={MyComponent(props.result.htm.toString())} />;

      let resultData = JSON.parse(props.result.htm);
      console.log(resultData);
      let lockedData = resultData.Data;

      let key = "XBERn1YOvpM9nfZc";
      let iv = "h1ONHk4P4yqbl5LK";

      order = ecpay.aesDecode(key, iv, lockedData);
      console.log("order:", order);
      return (
        <div className="container">
          {/* <div>超商門市:{order.ReceiverStoreName}</div>
          <div>超商門市:{order.TempLogisticsID}</div> */}

          <button
            onClick={async () => {
              location.href = "/sendOrder?cvs=1";
              // router.p
            }}
          >
            選擇門市
          </button>
          <div></div>
        </div>
      );
    default:
      return (
        <div className="container">
          <button
            onClick={async () => {
              location.href = "/sendOrder?cvs=1";
              // router.p
            }}
          >
            送出訂單
          </button>
        </div>
      );
  }
};

function MyComponent(html) {
  return { __html: html };
}

// This gets called on every request
export async function getServerSideProps(context) {
  console.log(typeof context.query.cvs);
  var result;
  switch (context.query.cvs) {
    case "1":
      result = await (await fetch("http://localhost:3000/api/formalOrder")).json();
      return { props: { result } };

    default:
      console.log("default");
      return { props: {} };
  }
}

export default SendOrder;
