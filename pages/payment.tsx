import type { NextPage } from "next";
import { useState } from "react";

const Payment: NextPage = (props: any) => {
  return (
    <div className="container">
      <div dangerouslySetInnerHTML={MyComponent(props.result.htm)} />;
    </div>
  );
};

function MyComponent(html) {
  return { __html: html };
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const result = await (await fetch("https://ecpay-demo.vercel.app/api/createOrder")).json();
  console.log(result);

  // Pass data to the page via props
  return { props: { result } };
}

export default Payment;
