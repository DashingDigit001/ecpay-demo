import type { NextPage } from "next";
import { useRouter } from "next/router";
import ecpay from "../utils/ecpay";
const Payment: NextPage = (props: any) => {
  const router = useRouter();
  // console.log("props.order:", props.order);
  // let order = props.result.order ?? {};
  console.log("props.result: ", props.result);
  console.log("===========================================================");
  console.log("props.result: JSON.stringify", JSON.stringify(props.result));
  console.log("===========================================================");

  return (
    <div className="container">
      <button
        onClick={async () => {
          router.push({
            pathname: "/redirect",
            query: { value: "payment" },
          });
          // router.p
        }}
      >
        前往付款
      </button>
    </div>
  );
};

export async function getServerSideProps(context) {
  let result: any = {};

  console.log(context.resolvedUrl);
  switch (context.query.from) {
    case "ecpay":
      let res: any = await ecpay.getFormData(context);
      console.log(res);
      console.log("res.CheckMacValue:", res.CheckMacValue);
      result = res;
      break;
    default:
      break;
  }

  return { props: { result } };
}

export default Payment;
