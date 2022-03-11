import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [order, setOrder] = useState({});
  const [orderState, setOrderState] = useState("");

  return (
    <div className="container">
      <button>1140</button>
      <button></button>
    </div>
  );
};

export default Home;
