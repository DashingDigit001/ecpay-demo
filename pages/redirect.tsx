import type { NextPage } from "next";
import { useRef, useEffect } from "react";

const Redirect: NextPage = (props: any) => {
  // console.log(props.result.htm);

  const myEl = useRef(null);
  useEffect(() => {
    (myEl.current as HTMLElement).getElementsByTagName("form")[0].submit();
  }, []);

  return (
    <>
      <div ref={myEl} dangerouslySetInnerHTML={{ __html: props.result.htm }} />
    </>
  );
};

// This gets called on every request
export async function getServerSideProps(context) {
  let result = {};
  console.log(process.env.API_URL);
  switch (context.query.value) {
    case "map":
      result = await (await fetch(`${process.env.API_URL}/api/map`)).json();
      break;

    case "payment":
      result = await (await fetch(`${process.env.API_URL}/api/payment`)).json();
      break;
    case "consignmentNote":
      result = await (await fetch(`${process.env.API_URL}/api/getConsignmentNote`)).json();
      break;
  }

  return { props: { result } };
}

export default Redirect;
