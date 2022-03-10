import CryptoJS from "crypto-js";
import urlencode from "urlencode";
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { parse, ParsedUrlQuery } from "querystring";
const Cart: NextPage = (props: any) => {
  const router = useRouter();
  let order = {
    TempLogisticsID: "",
    LogisticsType: "",
    LogisticsSubType: "",
    ScheduledDeliveryTime: "",
    ScheduledDeliveryDate: "",
    ReceiverName: "",
    ReceiverPhone: "",
    ReceiverCellPhone: "",
    ReceiverZipCode: "",
    ReceiverAddress: "",
    ReceiverStoreID: "",
    ReceiverStoreName: "",
    RtnCode: 0,
    RtnMsg: "",
  };

  if (router.query.cvs == "1") {
    return <div dangerouslySetInnerHTML={MyComponent(props.result.htm.toString())} />;
  } else {
    let res = props.result;
    let resultData = JSON.parse(props.result.ResultData);
    let lockedData = resultData.Data;
    console.log("data", lockedData);

    let key = CryptoJS.enc.Utf8.parse("XBERn1YOvpM9nfZc"); // key：必須16個字元
    let iv = CryptoJS.enc.Utf8.parse("h1ONHk4P4yqbl5LK");
    var bytes = CryptoJS.AES.decrypt(lockedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    console.log(bytes.toString(CryptoJS.enc.Utf8));
    let data = urlencode.decode(bytes.toString(CryptoJS.enc.Utf8));
    order = JSON.parse(data);
    // console.log();

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

        <div>超商門市:{order.ReceiverStoreName}</div>
      </div>
    );
  }
};

function MyComponent(html) {
  return { __html: html };
}

// This gets called on every request
export async function getServerSideProps(context) {
  console.log(context.query);
  if (context.query.cvs == 2) {
    // const streamPromise = new Promise((resolve, reject) => {
    //   let postBody = "";

    //   context.req.on("data", (data) => {
    //     // convert Buffer to string
    //     postBody += data.toString();
    //   });

    //   context.req.on("end", () => {
    //     const postData: ParsedUrlQuery = parse(postBody);

    //     resolve(postData);
    //   });
    // });

    // const result = await streamPromise;

    const result = {
      ResultData: JSON.stringify({
        MerchantID: 2000933,
        RqHeader: { Timestamp: "1646818105", Revision: "1.0.0" },
        TransCode: 1,
        TransMsg: "",
        Data: "dRPK29qhaXrO/eceaaAujs8InZOO2yEZtCo/cPk5KCrx+ECe38EmIPuWiJCE+yVQOkcvlgOpPZx4p40oihzbBsgoMj1F0OFSb7wpHZx4MD3NXvFFIoZhAI5keiw6eZ0cVjY6IdtsDABE4BAyGLjaKtOhgIkUjMvrlhPepoPVOkaPpB4uFHAWZnpz6NbALK1uCANvHuKhkI5e80E+8G3q8zInJ0gVSqGYrL28ifn2r4k6IaFszxdNaTnCiU+SoJWTulr6bSmCzc0iazcmRVvqdfw6cV4E0AwLOMZ2KXQv9rJ6Ar/UzT85oAtRb2mWkfUy4+9Qp1CbGAx3eBv7IEqqsd2p48TUAc0fRJYiOQMP7tMzx5Gi1X93Jth4EyQtCWeMlutAknp750siqk6zxEvO4WicMH/uM2nivasdakHEGAMbQsBQJPZru8AigNPJzD6RdRJLPcvhnz5DDnaBtIBC9nsWl9eyKYdlyTvQy3clZatk+FoqEOoinH65q6PgPu9z7/+tzk/JqCkr6VUED0wzqDb0geyut0pzt8OjVmMbnd3aLfmju6yPZcyhsMVoBj58bAjg1Yf7zQybUBa9xaBqvS4yRhSASlTTxjDUpAO78bfZ7L3nv++8fpwUnpb/RUHAllPq3hxnVi3BPVlwkn5UfK5cK7dwflno8DxfuEspcm0JoTzzK0eiAEaOp8ukz+NKhfAa2O7fB5DMRouzrIrniw5XTIEXd+9YQ2B4qTJGRl8a1DHTqfhBCO67x/aRrAa/",
      }),
    };
    return { props: { result } };
  } else {
    const result = await (await fetch("https://ecpay-demo.vercel.app/api/map")).json();
    return { props: { result } };
  }
}

export default Cart;
