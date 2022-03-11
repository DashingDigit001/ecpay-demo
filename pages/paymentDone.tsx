import type { NextPage } from "next";
import { useRouter } from "next/router";
import ecpay from "../utils/ecpay";
const PaymentDone: NextPage = (props: any) => {
  const router = useRouter();
  // console.log("props.order:", props.order);
  // let order = props.result.order ?? {};
  console.log("props.result: ", props.result);

  return (
    <div className="container">
      <div>付款完成</div>
    </div>
  );
};

export async function getServerSideProps(context) {
  let result: any = {};

  switch (context.query.from) {
    case "ecpay":
      let res: any = await ecpay.getFormData(context);
      console.log(res);
      console.log("res.CheckMacValue:", res.CheckMacValue);
      result = JSON.stringify(res);
      break;
    default:
      break;
  }

  return { props: { result } };
}

export default PaymentDone;
