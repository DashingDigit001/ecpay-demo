import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import HelloWorld from "../components/helloworld";

const Home: NextPage = () => {
  const [order, setOrder] = useState({});
  const [orderState, setOrderState] = useState("");

  return (
    <div className="container">
      <div>0257更新</div>
      <div className=" grid grid-cols-3">
        <button className="" onClick={() => setOrder({ orderId: "001", itemName: "test001", totalAmount: "1", totalPrice: "100" })}>
          購買
        </button>
        <div>購買狀態:{JSON.stringify(order)}</div>
      </div>
      <div className=" grid grid-cols-3">
        <button
          className=""
          onClick={() => {
            setOrderState("已建立");
          }}
        >
          建立訂單
        </button>
        <div>訂單狀態:{orderState}</div>
      </div>
      <div className=" grid grid-cols-3">
        <button className="">確定付款</button>
        <div>付款狀態:</div>
      </div>
      <div className=" grid grid-cols-3">
        <div>SDK已回傳</div>
      </div>
      <div className=" grid grid-cols-3">
        <div>交易結果</div>
      </div>
    </div>
  );
};

export default Home;
