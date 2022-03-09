import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

const Cart: NextPage = (props: any) => {
  const [result, setResult] = useState("");
  const router = useRouter();
  if (router.query.cvs == "1") {
    return <div dangerouslySetInnerHTML={MyComponent(props.result.htm.toString())} />;
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
  console.log("===============================context===============================");
  console.log(context.req);
  console.log("===============================context===============================");
  // Fetch data from external API
  const result = await (await fetch("https://ecpay-demo.vercel.app/api/map")).json();
  // console.log(result);

  // Pass data to the page via props
  return { props: { result } };
}

export default Cart;
