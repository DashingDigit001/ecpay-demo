import type { NextPage } from "next";
import { useRouter } from "next/router";
import ecpay from "../utils/ecpay";
const Payment: NextPage = (props: any) => {
  const router = useRouter();

  return (
    <div className="container">
      <button
        onClick={async () => {
          router.push({
            pathname: "/redirect",
            query: { value: "payment" },
          });
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
      result = JSON.stringify(res);
      break;
    default:
      break;
  }

  return { props: { result } };
}

export default Payment;
