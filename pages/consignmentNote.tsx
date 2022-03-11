import type { NextPage } from "next";
import { useRouter } from "next/router";
import ecpay from "../utils/ecpay";
const ConsignmentNote: NextPage = (props: any) => {
  const router = useRouter();
  // console.log("props.order:", props.order);
  // let order = props.result.order ?? {};
  console.log("props.result: ", props.result);

  return (
    <div className="container">
      <button
        onClick={async () => {
          router.push({
            pathname: "/redirect",
            query: { value: "consignmentNote" },
          });
          // router.p
        }}
      >
        列印託運單
      </button>
    </div>
  );
};

export async function getServerSideProps(context) {
  let result: any = {};

  console.log(context.resolvedUrl);
  switch (context.query.from) {
    case "consignmentNote":
      let res: any = await ecpay.getFormData(context);
      console.log(res);
      result = JSON.stringify(res);
      break;
    default:
      break;
  }

  return { props: { result } };
}

export default ConsignmentNote;
