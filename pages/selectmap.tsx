import type { NextPage } from "next";
import { useState } from "react";

const SelectMap: NextPage = (props: any) => {
  return (
    <div className="container">
      <div dangerouslySetInnerHTML={MyComponent(props.result.htm)} />
    </div>
  );
};

function MyComponent(html) {
  return { __html: html };
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  console.log("this is select map");
  const result = await (await fetch("http://localhost:3000/api/map")).json();
  console.log(result);

  // Pass data to the page via props
  return { props: { result } };
}

export default SelectMap;
