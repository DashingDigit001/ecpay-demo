import type { NextPage } from "next";
import { useRef, useEffect } from "react";
import { withRouter } from "next/router";

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

  switch (context.query.value) {
    case "map":
      result = await (await fetch("http://localhost:3000/api/map")).json();
      break;
    case "formalOrder":
      result = await (await fetch("http://localhost:3000/api/formalOrder")).json();

      break;
    case "payment":
      result = await (await fetch("http://localhost:3000/api/payment")).json();
      break;
  }

  // const result = await (await fetch("http://localhost:3000/api/map")).json();

  return { props: { result } };
}

export default Redirect;
