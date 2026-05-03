# Complete Guide: Implementing Paystack Web Popup / Inline Checkout

This guide explains how to implement **Paystack Web Popup** using Paystack’s current **InlineJS / Popup V2** flow. The recommended production approach is:

1. User clicks **Pay**
2. Your frontend calls your backend to initialize the transaction
3. Your backend calls Paystack’s **Initialize Transaction API**
4. Backend returns the `access_code` and `reference` to the frontend
5. Frontend opens the Paystack popup with `resumeTransaction(access_code)`
6. After payment, frontend sends the `reference` back to backend
7. Backend verifies the transaction with Paystack
8. Your system only gives value after backend verification

Paystack describes this as a three-step integration process: initialize transaction, complete transaction, and verify transaction status. Paystack also explicitly recommends initializing the transaction from your backend so you control the transaction details and avoid exposing your secret key in the frontend. ([Paystack][1])

---

## 1. What You Are Implementing

Paystack Popup is Paystack’s JavaScript checkout experience for web applications. It allows your customer to complete payment inside a secure Paystack checkout popup without you collecting sensitive card details directly. Paystack says the popup can be added through **CDN**, **NPM**, or **Yarn**. ([Paystack][1])

The modern version is **Popup V2 / InlineJS V2**.

You should avoid the older `PaystackPop.setup()` and `openIframe()` style unless you are maintaining an old integration. Paystack’s V2 flow uses:

```js
const popup = new PaystackPop();
popup.newTransaction({...});
```

or, in the recommended backend-initialized flow:

```js
const popup = new PaystackPop();
popup.resumeTransaction(access_code);
```

Paystack’s migration guide shows that V1 used `PaystackPop.setup()` and `openIframe()`, while V2 uses `new PaystackPop()` and `newTransaction()`. It also replaces `callback()` with `onSuccess()` and `onClose()` with `onCancel()`. ([Paystack][2])

---

## 2. Recommended Architecture

The safest production architecture is:

```text
Frontend
  |
  | 1. POST /api/payments/initialize
  v
Backend
  |
  | 2. POST https://api.paystack.co/transaction/initialize
  v
Paystack
  |
  | 3. returns authorization_url, access_code, reference
  v
Backend
  |
  | 4. returns access_code/reference to frontend
  v
Frontend
  |
  | 5. popup.resumeTransaction(access_code)
  v
Paystack Checkout Popup
  |
  | 6. customer pays
  v
Frontend onSuccess
  |
  | 7. POST /api/payments/verify
  v
Backend
  |
  | 8. GET https://api.paystack.co/transaction/verify/:reference
  v
Paystack
  |
  | 9. returns actual transaction status
  v
Backend
  |
  | 10. mark order/payment as paid only if verified
```

Do **not** rely only on frontend `onSuccess`. Treat it as a notification that the customer completed the checkout flow, not as final proof of payment. Paystack’s docs say verification should be done using either webhooks or the verify transactions endpoint, and that you need to inspect values like `data.status` and `data.amount` before delivering value. ([Paystack][1])

---

## 3. Required Paystack Keys

You need two keys from your Paystack dashboard:

```env
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

Use:

```env
PAYSTACK_PUBLIC_KEY
```

on the frontend only.

Use:

```env
PAYSTACK_SECRET_KEY
```

on the backend only.

Paystack explicitly warns that you should never call the Paystack API directly from the frontend because that exposes your secret key. All Paystack API calls that require the secret key should be initiated from your server. ([Paystack][1])

---

## 4. Install Paystack InlineJS

You can use either CDN or NPM.

### Option A: CDN

Add this script to your HTML page:

```html
<script src="https://js.paystack.co/v2/inline.js"></script>
```

Paystack’s docs show this as the CDN option for Popup V2. ([Paystack][1])

### Option B: NPM

Install the package:

```bash
npm install @paystack/inline-js
```

Then import it:

```js
import PaystackPop from "@paystack/inline-js";
```

Paystack’s docs show this import when using NPM or Yarn. ([Paystack][1])

---

# 5. Backend Implementation

The backend should handle two core operations:

1. Initialize transaction
2. Verify transaction

For this guide, I will use **Node.js + Express**.

---

## 5.1 Backend Environment Variables

Create a `.env` file:

```env
PORT=4000
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

Never commit this file.

---

## 5.2 Install Backend Dependencies

```bash
npm install express cors dotenv
```

For Node versions below 18, also install Axios or node-fetch. Node 18+ has `fetch` built in.

```bash
npm install axios
```

This guide will use native `fetch`.

---

## 5.3 Basic Express Server

```js
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY is missing");
}

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
```

If your project does not use ES modules, use `require` instead.

---

# 6. Initialize a Paystack Transaction

## 6.1 What Initialization Does

Initialization creates a transaction on Paystack before the popup is opened.

The backend sends:

```json
{
  "email": "customer@example.com",
  "amount": "500000"
}
```

Paystack returns:

```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "...",
    "reference": "..."
  }
}
```

The important value for popup completion is:

```js
data.access_code;
```

Paystack says the `data` object contains an `access_code` needed to complete the transaction, and that you should store this parameter and send it to your frontend. ([Paystack][1])

---

## 6.2 Amount Must Be in the Lowest Currency Unit

Paystack expects `amount` in the **subunit** of the currency. For NGN, this means **kobo**.

So:

```text
₦5,000 = 500000 kobo
₦1,500 = 150000 kobo
₦100 = 10000 kobo
```

Paystack’s Transaction API reference states that `amount` should be in the subunit of the supported currency. ([Paystack][3])

Use a helper:

```js
function toKobo(amountInNaira) {
  return Math.round(Number(amountInNaira) * 100);
}
```

---

## 6.3 Generate a Unique Reference

You can allow Paystack to generate the reference, but in most real systems, generate your own so you can link the Paystack transaction to your internal order/payment record.

Paystack says the `reference` is optional, must be unique, and only allows alphanumeric characters plus `-`, `.`, and `=`. ([Paystack][3])

Example:

```js
function generatePaymentReference() {
  return `pay_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}
```

---

## 6.4 Create the Initialize Endpoint

```js
app.post("/api/payments/initialize", async (req, res) => {
  try {
    const { email, amount, customerId, orderId } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid amount is required",
      });
    }

    const amountInKobo = Math.round(Number(amount) * 100);
    const reference = `pay_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    /*
      IMPORTANT:
      In a real application, create a pending payment record here before calling Paystack.

      Example DB fields:
      - reference
      - orderId
      - customerId
      - email
      - amount
      - amountInKobo
      - status: "pending"
      - provider: "paystack"
    */

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amountInKobo,
          reference,
          currency: "NGN",
          metadata: {
            customerId,
            orderId,
          },
        }),
      },
    );

    const data = await paystackResponse.json();

    if (!paystackResponse.ok || !data.status) {
      return res.status(400).json({
        success: false,
        message: data.message || "Unable to initialize Paystack transaction",
        data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction initialized successfully",
      data: {
        accessCode: data.data.access_code,
        reference: data.data.reference,
        authorizationUrl: data.data.authorization_url,
      },
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while initializing payment",
    });
  }
});
```

---

## 6.5 Important Initialization Parameters

Paystack’s Transaction API supports these common initialization fields:

| Field          | Required | Description                                            |
| -------------- | -------: | ------------------------------------------------------ |
| `email`        |      Yes | Customer email address                                 |
| `amount`       |      Yes | Amount in the lowest denomination                      |
| `currency`     |       No | Currency, for example `NGN`                            |
| `reference`    |       No | Unique transaction reference                           |
| `callback_url` |       No | Fully qualified URL to override dashboard callback URL |
| `channels`     |       No | Limit available payment channels                       |
| `metadata`     |       No | Extra transaction information                          |
| `subaccount`   |       No | Subaccount code for split payment                      |
| `split_code`   |       No | Split code for multi-split payment                     |
| `bearer`       |       No | Who bears transaction charges                          |

Paystack lists these fields in its Transaction API reference. ([Paystack][3])

---

# 7. Frontend Implementation with CDN

This is the simplest browser implementation.

## 7.1 HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Paystack Popup Integration</title>
  </head>
  <body>
    <h1>Checkout</h1>

    <form id="paymentForm">
      <label>Email</label>
      <input type="email" id="email" required />

      <label>Amount</label>
      <input type="number" id="amount" required />

      <button type="submit" id="payButton">Pay Now</button>
    </form>

    <script src="https://js.paystack.co/v2/inline.js"></script>
    <script src="./payment.js"></script>
  </body>
</html>
```

---

## 7.2 JavaScript

```js
// payment.js

const form = document.getElementById("paymentForm");
const payButton = document.getElementById("payButton");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const amount = document.getElementById("amount").value;

  try {
    payButton.disabled = true;
    payButton.textContent = "Initializing payment...";

    const initResponse = await fetch(
      "http://localhost:4000/api/payments/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, amount }),
      },
    );

    const initData = await initResponse.json();

    if (!initResponse.ok || !initData.success) {
      throw new Error(initData.message || "Unable to initialize payment");
    }

    const { accessCode, reference } = initData.data;

    const popup = new PaystackPop();

    /*
      resumeTransaction opens the Paystack checkout popup using the access_code
      returned by your backend.
    */
    popup.resumeTransaction(accessCode);

    /*
      Since resumeTransaction does not give you the same inline callbacks
      as newTransaction in this basic example, you should still verify from:
      - a frontend callback flow if available in your implementation style
      - your backend webhook
      - a post-payment confirmation screen
      - or by polling/checking the reference after the user returns

      For most production systems, webhook + explicit verification endpoint is best.
    */

    console.log("Payment popup opened for reference:", reference);
  } catch (error) {
    console.error(error);
    alert(error.message || "Something went wrong");
  } finally {
    payButton.disabled = false;
    payButton.textContent = "Pay Now";
  }
});
```

Paystack’s docs show the backend-initialized popup completion step as:

```js
const popup = new PaystackPop();
popup.resumeTransaction(access_code);
```

The `resumeTransaction` method triggers checkout in the browser and lets the customer choose their preferred payment channel. ([Paystack][1])

---

# 8. Frontend Implementation with NPM

For React, Next.js, Vue, or other modern frontend apps, install:

```bash
npm install @paystack/inline-js
```

Then:

```js
import PaystackPop from "@paystack/inline-js";
```

---

# 9. React Example

```jsx
import { useState } from "react";
import PaystackPop from "@paystack/inline-js";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePayment(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/payments/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            amount,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to initialize payment");
      }

      const popup = new PaystackPop();

      popup.resumeTransaction(result.data.accessCode);
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "Payment failed to start");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePayment}>
      <h1>Pay with Paystack</h1>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Starting payment..." : "Pay Now"}
      </button>
    </form>
  );
}
```

---

# 10. Alternative: Direct Frontend `newTransaction()`

Paystack InlineJS also supports opening the popup directly from the frontend using your **public key**:

```js
const popup = new PaystackPop();

popup.newTransaction({
  key: "pk_test_xxxxxxxxxxxxxxxxxxxxx",
  email: "customer@example.com",
  amount: 500000,
  currency: "NGN",

  onSuccess: (transaction) => {
    console.log("Payment complete:", transaction);
  },

  onLoad: (response) => {
    console.log("Popup loaded:", response);
  },

  onCancel: () => {
    console.log("User cancelled payment");
  },

  onError: (error) => {
    console.log("Error:", error.message);
  },
});
```

Paystack’s InlineJS docs show `newTransaction(options)` as a synchronous method for creating a transaction, and the example includes `key`, `email`, `amount`, `onSuccess`, `onLoad`, `onCancel`, and `onError`. ([Paystack][4])

However, for production, I recommend the backend-initialized flow because:

```text
Frontend-only flow:
- Easier to set up
- Good for quick demos
- Less control over trusted transaction creation

Backend-initialized flow:
- Better for production
- Lets your backend create the payment record first
- Lets you validate amount/order/user before Paystack checkout
- Prevents users from tampering with amount from the browser
```

---

# 11. Paystack Popup Callbacks

If you use `newTransaction()`, Paystack provides useful callbacks.

## 11.1 `onLoad`

Called when the transaction successfully loads and the customer can see the popup.

```js
onLoad: (response) => {
  console.log("Popup loaded:", response);
};
```

Paystack says `onLoad` returns fields such as `id`, `accessCode`, and `customer`. ([Paystack][4])

---

## 11.2 `onSuccess`

Called when the customer successfully completes a transaction.

```js
onSuccess: async (transaction) => {
  console.log("Transaction reference:", transaction.reference);

  await verifyPayment(transaction.reference);
};
```

Paystack says the `onSuccess` transaction object includes fields such as `reference`, `status`, `message`, `transaction`, and `trxref`. ([Paystack][4])

Still, do not update your database as paid from frontend alone. Send the reference to your backend and verify it.

---

## 11.3 `onCancel`

Called when the customer closes or cancels the payment popup.

```js
onCancel: () => {
  console.log("User cancelled payment");
};
```

Use this to update UI state, not to mark a transaction as failed permanently.

A cancelled popup may mean:

```text
- The user changed their mind
- The user wants to retry
- The user closed the popup by mistake
- The payment may still continue through another delayed channel in rare cases
```

So your backend should keep the transaction as `pending`, `abandoned`, or `cancelled_by_user` depending on your business rules.

---

## 11.4 `onError`

Called when there is an issue loading the transaction.

```js
onError: (error) => {
  console.error("Paystack popup error:", error.message);
};
```

Paystack says `onError` is called when there is an issue loading the transaction. ([Paystack][4])

---

# 12. Verify Transaction on the Backend

## 12.1 Why Verification Is Required

Frontend success is not enough.

Your backend must call:

```http
GET https://api.paystack.co/transaction/verify/:reference
```

Paystack says that for Popup or mobile SDKs, you should send the transaction reference to your server, then call the verify endpoint from your server. ([Paystack][5])

---

## 12.2 Create the Verify Endpoint

```js
app.post("/api/payments/verify", async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required",
      });
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await verifyResponse.json();

    if (!verifyResponse.ok || !data.status) {
      return res.status(400).json({
        success: false,
        message: data.message || "Unable to verify transaction",
        data,
      });
    }

    const transaction = data.data;

    /*
      IMPORTANT:
      response.status means the API call succeeded.
      transaction.status / data.data.status is the actual payment status.
    */

    if (transaction.status !== "success") {
      return res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${transaction.status}`,
        data: transaction,
      });
    }

    /*
      SECURITY CHECKS:
      1. Find your pending payment by reference.
      2. Compare transaction.amount with your stored amountInKobo.
      3. Compare transaction.currency with expected currency.
      4. Make sure this reference has not already been fulfilled.
      5. Only then mark payment/order as paid.
    */

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        reference: transaction.reference,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        paidAt: transaction.paid_at,
        channel: transaction.channel,
      },
    });
  } catch (error) {
    console.error("Paystack verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying payment",
    });
  }
});
```

Paystack warns that the top-level API response `response.status` is not the transaction status. The actual transaction status is `response.data.status`. ([Paystack][5])

---

# 13. Frontend Verification After `onSuccess`

If you use `newTransaction()`, your frontend can call the verify endpoint after `onSuccess`.

```js
async function verifyPayment(reference) {
  const response = await fetch("http://localhost:4000/api/payments/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reference }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Payment verification failed");
  }

  return result.data;
}
```

Usage:

```js
const popup = new PaystackPop();

popup.newTransaction({
  key: "pk_test_xxxxxxxxxxxxxxxxxxxxx",
  email: "customer@example.com",
  amount: 500000,

  onSuccess: async (transaction) => {
    try {
      const verifiedPayment = await verifyPayment(transaction.reference);

      console.log("Verified payment:", verifiedPayment);

      window.location.href = `/payment-success?reference=${transaction.reference}`;
    } catch (error) {
      console.error(error);
      alert(
        "Payment completed, but verification failed. Please contact support.",
      );
    }
  },

  onCancel: () => {
    alert("Payment was cancelled");
  },

  onError: (error) => {
    alert(error.message || "Unable to open payment popup");
  },
});
```

---

# 14. Transaction Statuses You Should Handle

Paystack’s Verify Payments docs list these possible statuses:

| Status       | Meaning                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| `abandoned`  | Customer has not completed the transaction                              |
| `failed`     | Transaction failed                                                      |
| `ongoing`    | Customer is still trying to complete an action, such as OTP or transfer |
| `pending`    | Transaction is still in progress                                        |
| `processing` | Same as pending, but for direct debit                                   |
| `queued`     | Queued for processing later                                             |
| `reversed`   | Transaction was reversed, refunded, or charged back                     |
| `success`    | Transaction was successfully processed                                  |

Paystack documents these transaction statuses in its Verify Payments guide. ([Paystack][5])

Your backend should only deliver value when:

```js
transaction.status === "success";
```

And after confirming:

```js
transaction.amount === storedPayment.amountInKobo;
transaction.currency === storedPayment.currency;
transaction.reference === storedPayment.reference;
storedPayment.status !== "paid";
```

---

# 15. Payment Channels

Paystack can allow customers to pay using channels such as:

```js
[
  "card",
  "bank",
  "ussd",
  "qr",
  "eft",
  "mobile_money",
  "bank_transfer",
  "apple_pay",
];
```

Paystack’s InlineJS docs list available channel options for popup transactions. ([Paystack][4])

Example:

```js
popup.newTransaction({
  key: "pk_test_xxxxxxxxxxxxxxxxxxxxx",
  email: "customer@example.com",
  amount: 500000,
  channels: ["card", "bank_transfer", "ussd"],
  onSuccess: (transaction) => {
    console.log(transaction);
  },
});
```

Paystack also notes that if you use Popup or Redirect, the customer will be shown the payment methods selected on your dashboard. Other payment channels depend on country support, while card payments are available on all Paystack accounts. ([Paystack][6])

---

# 16. Metadata

Use `metadata` to attach your own internal information to the transaction.

Example:

```js
metadata: {
  customerId: "cus_123",
  orderId: "ord_456",
  source: "web_checkout",
}
```

In backend initialization:

```js
body: JSON.stringify({
  email,
  amount: amountInKobo,
  reference,
  metadata: {
    customerId,
    orderId,
  },
});
```

Paystack’s Transaction API supports a `metadata` field for custom data. ([Paystack][3])

Use metadata for helpful context, but do not rely on metadata alone as your source of truth. Your own database should still store the order/payment record.

---

# 17. Database Design Recommendation

Create a `payments` table.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  reference VARCHAR(100) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL DEFAULT 'paystack',
  customer_id VARCHAR(100),
  order_id VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  provider_status VARCHAR(50),
  provider_response JSONB,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

Recommended statuses:

```text
pending
initialized
success
failed
abandoned
cancelled
reversed
verification_failed
```

Recommended payment lifecycle:

```text
1. Create payment record as pending
2. Initialize Paystack transaction
3. Store Paystack access_code/reference
4. Open popup
5. Verify payment
6. If verified, mark as success
7. If failed, mark as failed
8. If webhook arrives later, reconcile idempotently
```

---

# 18. Idempotency and Double Fulfillment Protection

This is critical.

Paystack warns that if you offer digital value like airtime, wallet top-up, digital credit, or similar, you should confirm that you have not already delivered value for the transaction to avoid double fulfillment, especially when also using webhooks. ([Paystack][5])

Your verification logic should do this:

```js
const payment = await db.payments.findByReference(reference);

if (!payment) {
  throw new Error("Payment record not found");
}

if (payment.status === "success") {
  return {
    alreadyProcessed: true,
    payment,
  };
}

if (transaction.status === "success") {
  await db.transaction(async (tx) => {
    await tx.payments.update(reference, {
      status: "success",
      provider_status: transaction.status,
      provider_response: transaction,
      paid_at: transaction.paid_at,
    });

    await tx.orders.update(payment.order_id, {
      payment_status: "paid",
    });

    /*
      Deliver value here:
      - credit wallet
      - unlock order
      - confirm booking
      - activate subscription
    */
  });
}
```

Always make fulfillment idempotent.

---

# 19. Webhooks

## 19.1 Why You Should Use Webhooks

Frontend verification is useful, but webhooks are better for asynchronous confirmation.

For example:

```text
- User pays but closes browser before frontend verify call
- Network fails after payment
- Bank transfer payment completes later
- Mobile browser kills the page
```

Paystack says webhooks are the preferred option for confirming transaction status, although they currently send webhook events for successful transactions. ([Paystack][5])

---

## 19.2 Create Webhook Endpoint

```js
import crypto from "crypto";

app.post("/api/payments/paystack/webhook", express.json(), async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];

    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    /*
      Acknowledge early if your processing may take time.
      In a more advanced setup, push event into a queue.
    */

    if (event.event === "charge.success") {
      const transaction = event.data;
      const reference = transaction.reference;

      /*
        Find payment by reference.
        Check amount/currency.
        Check if already processed.
        Mark as success.
        Deliver value idempotently.
      */
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    return res.sendStatus(500);
  }
});
```

Paystack says webhook events include the `x-paystack-signature` header, which is an HMAC SHA512 signature of the event payload signed with your secret key. Paystack also says your webhook URL should return `200 OK`; otherwise, events are retried. ([Paystack][7])

---

## 19.3 Webhook Security

Paystack supports two ways to verify event origin:

```text
1. Signature validation
2. IP whitelisting
```

For signature validation, compare your computed HMAC SHA512 hash with the `x-paystack-signature` header. Paystack also lists IP addresses that can be whitelisted for webhook requests. ([Paystack][7])

---

# 20. Testing

## 20.1 Use Test Keys

Use:

```env
pk_test_xxxxx
sk_test_xxxxx
```

for local development and staging.

Use:

```env
pk_live_xxxxx
sk_live_xxxxx
```

only in production.

Paystack states that it provides both test and live environments, each with its own keys, and that your API keys determine which environment you are using. ([Paystack][8])

---

## 20.2 Test Cards

Paystack provides test payment details for different payment scenarios. For example, Paystack’s Test Payments page lists successful test cards such as:

```text
No validation reusable card:
4084 0840 8408 4081

CVV:
408

PIN + OTP validation card:
5060 6666 6666 6666 666

PIN:
1234

OTP:
123456
```

Paystack says expiry dates can be any date in the future. ([Paystack][9])

Do not use test cards in live mode.

---

# 21. Production Checklist

Before going live:

```markdown
- [ ] Use live public key on frontend
- [ ] Use live secret key only on backend
- [ ] Never expose secret key to browser
- [ ] Initialize transaction from backend
- [ ] Store payment record before opening popup
- [ ] Store unique transaction reference
- [ ] Verify transaction from backend
- [ ] Check `data.status`, not only top-level `status`
- [ ] Confirm amount matches your stored amount
- [ ] Confirm currency matches expected currency
- [ ] Prevent double fulfillment
- [ ] Add webhook endpoint
- [ ] Validate webhook signature
- [ ] Return `200 OK` from webhook quickly
- [ ] Log failed verifications
- [ ] Handle user cancellation gracefully
- [ ] Handle pending/ongoing payments
- [ ] Test success, failed, cancelled, and delayed flows
- [ ] Add monitoring/alerts around payment failures
```

---

# 22. Common Mistakes to Avoid

## Mistake 1: Calling Paystack API from Frontend

Bad:

```js
fetch("https://api.paystack.co/transaction/initialize", {
  headers: {
    Authorization: "Bearer sk_test_xxxxx",
  },
});
```

Never do this. Your secret key becomes visible to users.

---

## Mistake 2: Treating Frontend `onSuccess` as Final Payment Proof

Bad:

```js
onSuccess: () => {
  markOrderAsPaid();
};
```

Better:

```js
onSuccess: async (transaction) => {
  await backendVerify(transaction.reference);
};
```

---

## Mistake 3: Not Checking the Amount

Bad:

```js
if (transaction.status === "success") {
  markPaid();
}
```

Better:

```js
if (
  transaction.status === "success" &&
  transaction.amount === payment.amount &&
  transaction.currency === payment.currency
) {
  markPaid();
}
```

---

## Mistake 4: Not Handling Duplicate Events

Bad:

```js
creditWallet(userId, amount);
```

Better:

```js
if (payment.status !== "success") {
  creditWallet(userId, amount);
  markPaymentSuccess(reference);
}
```

---

## Mistake 5: Confusing API Status with Transaction Status

Paystack explicitly warns that the API response status is not the same as the transaction status. The actual transaction status is inside `response.data.status`. ([Paystack][5])

Bad:

```js
if (response.status === true) {
  markPaid();
}
```

Better:

```js
if (response.data.status === "success") {
  markPaid();
}
```

---

# 23. Final Recommended Flow

Use this flow in production:

```text
1. User clicks Pay
2. Frontend sends order/payment request to backend
3. Backend validates amount and customer
4. Backend creates local payment record as pending
5. Backend initializes Paystack transaction
6. Backend returns access_code and reference
7. Frontend opens popup with resumeTransaction(access_code)
8. Customer completes payment
9. Frontend sends reference to backend for verification
10. Backend verifies with Paystack
11. Backend checks status, amount, currency, and idempotency
12. Backend marks payment as successful
13. Backend delivers value
14. Webhook also listens for charge.success and reconciles safely
```

That gives you a secure, production-ready Paystack web popup implementation.

[1]: https://paystack.com/docs/payments/accept-payments/ "Accept Payments | Paystack Developer Documentation"
[2]: https://paystack.com/docs/guides/migrating-from-inlinejs-v1-to-v2/ "Migrating from InlineJS V1 to V2 | Paystack Developer Documentation"
[3]: https://paystack.com/docs/api/transaction/ "Transaction API | Paystack Developer Documentation"
[4]: https://paystack.com/docs/developer-tools/inlinejs/ "InlineJS | Paystack Developer Documentation"
[5]: https://paystack.com/docs/payments/verify-payments/ "Verify Payments | Paystack Developer Documentation"
[6]: https://paystack.com/docs/payments/payment-channels/ "Payment Channels | Paystack Developer Documentation"
[7]: https://paystack.com/docs/payments/webhooks/?utm_source=chatgpt.com "Webhooks | Paystack Developer Documentation"
[8]: https://paystack.com/docs/api/?utm_source=chatgpt.com "API Reference | Paystack Developer Documentation"
[9]: https://paystack.com/docs/payments/test-payments/?utm_source=chatgpt.com "Test Payments | Paystack Developer Documentation"
