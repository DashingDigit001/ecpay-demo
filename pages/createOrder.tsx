import type { NextPage } from "next";
import { useRouter } from "next/router";
import ecpay from "../utils/ecpay";
const CreateOrder: NextPage = (props: any) => {
  const router = useRouter();
  let order = props.result.order ?? {};

  console.log("order:", order);
  return (
    <div className="container">
      <button
        onClick={async () => {
          router.push({
            pathname: "/redirect",
            query: { value: "formalOrder" },
          });
          // router.p
        }}
      >
        建立正式訂單
      </button>
    </div>
  );
};

export async function getServerSideProps(context) {
  let result: any = {};
  switch (context.query.from) {
    case "formalOrder":
      let res: any = await ecpay.getFormData(context);
      let resultData = JSON.parse(res.ResultData);
      let lockedData = resultData.Data;
      let key = "XBERn1YOvpM9nfZc";
      let iv = "h1ONHk4P4yqbl5LK";
      let order = ecpay.aesDecode(key, iv, lockedData);

      console.log("order:");
      console.log(order);
      console.log("order:");
      break;
    default:
      break;
  }

  return { props: { result } };
}

export default CreateOrder;
