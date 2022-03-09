import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { parse } from "querystring";
const Cart: NextPage = (props: any) => {
  const [result, setResult] = useState("");
  const router = useRouter();
  if (router.query.cvs == "1") {
    return <div dangerouslySetInnerHTML={MyComponent(props.result.htm.toString())} />;
  } else if (router.query.cvs == "2") {
    console.log(props.result);
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
        const postData = parse(postBody);
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
