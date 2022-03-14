# 專案名稱

EC Pay 物流金流 API

# 簡介

### 語言 : Type Script

### 主旨 :

- 選物流並建立暫存訂單
- 建立正式訂單
- 付款 + 付款完成通知( Client + Server )
- 查詢物流訂單
- 列印託運單

# 快速開始

## 環境建立

- Next.js

- Node.js
- Yarn (optional)

## 專案建立

#### package

- aes-js
- crypto-js
- urlencode
- ecpay_aio_nodejs

# 使用範例

### 選擇物流並建立暫存訂單

1. 建立選擇超商 API pages/api/map

   ```typescript
   //map.ts
   
   import { NextApiRequest, NextApiResponse } from "next";
   import ecpay from "../../utils/ecpay";
   
   export default async function handler(req, res: NextApiResponse) {
     var temp = {
       TempLogisticsID: "0",
       GoodsAmount: 500,
       IsCollection: "Y",
       GoodsName: "商品名",
       SenderName: "王小明",
       SenderZipCode: "123",
       SenderAddress: "xxxxxxxx",
       Remark: "xxx",
       ServerReplyURL: "http://localhost:3000/api/hello",
       ClientReplyURL: "http://localhost:3000/cart?from=map",
       Temperature: "0001",
       Specification: "0001",
       ScheduledPickupTime: "4",
       PackageCount: 1,
       LogisticsType: "CVS",
       LogisticsSubType: "UNIMARTC2C",
       ReceiverAddress: "xxxxxxxx",
       ReceiverCellPhone: "09xxxxxxxx",
       ReceiverPhone: "xxxxxxxx",
       ReceiverName: "陳小明",
       EnableSelectDeliveryTime: "Y",
       EshopMemberID: "xxxxyyyy123",
     };
   
     let key = "XBERn1YOvpM9nfZc";
     let iv = "h1ONHk4P4yqbl5LK";
     let encrypted = ecpay.aesEncode(key, iv, temp);
   
     const response = await fetch("https://logistics-stage.ecpay.com.tw/Express/v2/RedirectToLogisticsSelection", {
       method: "POST",
       body: JSON.stringify({
         MerchantID: "2000933",
         RqHeader: {
           Timestamp: new Date().getTime().toString(),
           Revision: "1.0.0",
         },
         Data: encrypted,
       }),
       headers: {
         "Content-Type": "application/json",
       },
     });
   
     res.send({
       htm: await response.text(),
     });
   }
   
   ```

1. 建立 pages/redirect.tsx

   ```tsx
   //redirect.tsx
   
   import type { NextPage } from "next";
   import { useRef, useEffect } from "react";
   
   const Redirect: NextPage = (props: any) => {
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
   
   export async function getServerSideProps(context) {
     var result = {};
     switch (context.query.value) {
       case "map":
         result = await (await fetch(`${process.env.API_URL}/api/map`)).json();
         break;
     }
   
     return { props: { result } };
   }
   
   export default Redirect;
   
   ```
   
2. 建立 page/cart.tsx

   ```tsx
   //cart.tsx
   
   import type { NextPage } from "next";
   import { useRouter } from "next/router";
   import ecpay from "../utils/ecpay";
   const Cart: NextPage = (props: any) => {
     const router = useRouter();
     let order = props.result.order ?? {};
     return (
       <div className="container">
         <button
           onClick={async () => {
             router.push({
               pathname: "/redirect",
               query: { value: "map" },
             });
           }}
         >
           選擇門市
         </button>
   
         <div>超商門市:{order.TempLogisticsID ?? "無選擇"}</div>
       </div>
     );
   };
   
   export async function getServerSideProps(context) {
     let result: any = {};
     switch (context.query.from) {
       case "map":
         let res: any = await ecpay.getFormData(context);
         let resultData = JSON.parse(res.ResultData);
         let lockedData = resultData.Data;
         let key = "XBERn1YOvpM9nfZc";
         let iv = "h1ONHk4P4yqbl5LK";
   
         result["order"] = ecpay.aesDecode(key, iv, lockedData);
         break;
       default:
         break;
     }
   
     return { props: { result } };
   }
   
   export default Cart;

### 建立正式訂單

1. 建立 API pages/api/formalOrder.ts

   ```typescript
   import { NextApiRequest, NextApiResponse } from "next";
   import ecpay from "../../utils/ecpay";
   export default async function handler(req, res: NextApiResponse) {
     //送出正是訂單前，先把暫存訂單資料解密，TempLogisticsID
     var temp = {
       TempLogisticsID: "8462",
     };
   
     let key = "XBERn1YOvpM9nfZc";
     let iv = "h1ONHk4P4yqbl5LK";
     let encrypted = ecpay.aesEncode(key, iv, temp);
   
     const response = await fetch("https://logistics-stage.ecpay.com.tw/Express/v2/CreateByTempTrade", {
       method: "POST",
       body: JSON.stringify({
         MerchantID: "2000933",
         RqHeader: {
           Timestamp: new Date().getTime().toString(),
           Revision: "1.0.0",
         },
         Data: encrypted,
       }),
       headers: {
         "Content-Type": "application/json",
       },
     });
   
     res.send({
       htm: await response.text(),
     });
   }
   ```

2. 呼叫 API 即可建立正式訂單

### 付款 + 付款完成通知( Client + Server )

1. 建立 pages/redirect.tsx

```tsx
import type { NextPage } from "next";
import { useRef, useEffect } from "react";

const Redirect: NextPage = (props: any) => {
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
  var result = {};
  switch (context.query.value) {    
    case "payment":
      result = await (await fetch(`${process.env.API_URL}/api/payment`)).json();
      break;    
  }

  return { props: { result } };
}

export default Redirect;

```

2. 建立 pages/payment.tsx

```tsx
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

```

3. 建立 API pages/api/payment.ts

```typescript
//payment.ts

import ecpay_payment from "ecpay_aio_nodejs/lib/ecpay_payment.js";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

export default function handler(req, res: NextApiResponse) {
  // 若要測試開立電子發票，請將inv_params內的"所有"參數取消註解 //
  let inv_params = {
    // RelateNumber: 'PLEASE MODIFY',  //請帶30碼uid ex: SJDFJGH24FJIL97G73653XM0VOMS4K
    // CustomerID: 'MEM_0000001',  //會員編號
    // CustomerIdentifier: '',   //統一編號
    // CustomerName: '測試買家',
    // CustomerAddr: '測試用地址',
    // CustomerPhone: '0123456789',
    // CustomerEmail: 'johndoe@test.com',
    // ClearanceMark: '2',
    // TaxType: '1',
    // CarruerType: '',
    // CarruerNum: '',
    // Donation: '2',
    // LoveCode: '',
    // Print: '1',
    // InvoiceItemName: '測試商品1|測試商品2',
    // InvoiceItemCount: '2|3',
    // InvoiceItemWord: '個|包',
    // InvoiceItemPrice: '35|10',
    // InvoiceItemTaxType: '1|1',
    // InvoiceRemark: '測試商品1的說明|測試商品2的說明',
    // DelayDay: '0',
    // InvType: '07'
  };
  let time = new Date().getTime();
  let no = "dashing" + time;
  let date = moment(new Date().getTime()).format("YYYY/MM/DD HH:mm:ss");

  let base_param = {
    MerchantTradeNo: no,
    MerchantTradeDate: date,
    TotalAmount: "100",
    TradeDesc: "測試交易描述",
    ItemName: "測試商品等",
    ReturnURL: `${process.env.API_URL}/PaymentDoneServer`,
    // ClientBackURL: "https://ecpay-demo.vercel.app/payment?from=ecpay",
    OrderResultURL: `${process.env.API_URL}/PaymentDoneClient?from=ecpay`,
  };
  console.log(time, no, date);
  const options = {
    OperationMode: "Test", //Test or Production
    MercProfile: {
      MerchantID: "2000132",
      HashKey: "5294y06JbISpM5x9",
      HashIV: "v77hoKGq4kWxNNIS",
    },
    IgnorePayment: [
      //    "Credit",
      //    "WebATM",
      //    "ATM",
      //    "CVS",
      //    "BARCODE",
      //    "AndroidPay"
    ],
    IsProjectContractor: false,
  };
  var create = new ecpay_payment(options);
  var htm = create.payment_client.aio_check_out_credit_onetime(base_param, inv_params);
  res.send({
    htm: htm.toString(),
  });
}

```

4. 建立 API pages/api/PaymentDoneServer.ts

```typescript
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res: NextApiResponse) {
  res.send("1|OK");
}
```

### 查詢物流訂單

1. 建立 API pages/api/queryOrder

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import ecpay from "../../utils/ecpay";

export default async function handler(req, res: NextApiResponse) {

  var temp = {
    MerchantID: "2000933",
    LogisticsID: "1888028",
  };

  let key = "XBERn1YOvpM9nfZc"; 
  let iv = "h1ONHk4P4yqbl5LK";  
  let encrypted = ecpay.aesEncode(key, iv, temp);

  const response = await fetch("https://logistics-stage.ecpay.com.tw/Express/v2/QueryLogisticsTradeInfo", {
    method: "POST",
    body: JSON.stringify({
      MerchantID: "2000933",
      RqHeader: {
        Timestamp: new Date().getTime().toString(),
        Revision: "1.0.0",
      },
      Data: encrypted,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  res.send({
    htm: ecpay.aesDecode(key, iv, JSON.parse(await response.text()).Data),
  });
}
```

2. 呼叫 API 取得物流訂單資訊

### 列印託運單

1. 建立 pages/redirect.tsx

   ```tsx
   //redirect.tsx
   
   import type { NextPage } from "next";
   import { useRef, useEffect } from "react";
   
   const Redirect: NextPage = (props: any) => {
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
     var result = {};
     switch (context.query.value) {
       case "consignmentNote":
         result = await (await fetch(`${process.env.API_URL}/api/getConsignmentNote`)).json();
         break;
     }
   
     return { props: { result } };
   }
   
   export default Redirect;
   
   ```

2. 建立 pages/getConsignmentNote.tsx

   ```tsx
   import type { NextPage } from "next";
   import { useRouter } from "next/router";
   import ecpay from "../utils/ecpay";
   const ConsignmentNote: NextPage = (props: any) => {
     const router = useRouter();
   
     return (
       <div className="container">
         <button
           onClick={async () => {
             router.push({
               pathname: "/redirect",
               query: { value: "consignmentNote" },
             });
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
         result = JSON.stringify(res);
         break;
       default:
         break;
     }
   
     return { props: { result } };
   }
   
   export default ConsignmentNote;
   
   ```

3. 建立 pages/api/getConsignmentNote.ts

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import ecpay from "../../utils/ecpay";

export default async function handler(req, res: NextApiResponse) {
  var temp = {
    MerchantID: "2000933",
    LogisticsID: ["1888028"],
    LogisticsSubType: "UNIMARTC2C",
  };

  let key = "XBERn1YOvpM9nfZc";
  let iv = "h1ONHk4P4yqbl5LK";
  let encrypted = ecpay.aesEncode(key, iv, temp);

  const response = await fetch("https://logistics-stage.ecpay.com.tw/Express/v2/PrintTradeDocument", {
    method: "POST",
    body: JSON.stringify({
      MerchantID: "2000933",
      RqHeader: {
        Timestamp: new Date().getTime().toString(),
        Revision: "1.0.0",
      },
      Data: encrypted,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  res.send({
    htm: await response.text(),
  });
}
```

## 觀念

Redirect 是在從網站到綠界網站之間的中繼頁，在 Redirect 的 getServerSideProps 中會呼叫 API 取得綠界回傳的資訊，是一段 HTML ，之後在 Redirect 頁中 Render 後，就會轉到綠界網站。

