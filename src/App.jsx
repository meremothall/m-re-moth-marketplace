Fix admin and publish now:

1. Check .env file - set:

VITE_AGENCY_PORTAL_CODE=MMM-DOUALA-2026

VITE_ADMIN_PASSWORD=MMM-DOUALA-2026

2. In src/pages/Admin.tsx and src/pages/AgencyLogin.tsx, make password check to be "MMM-DOUALA-2026" - case sensitive. If user enters MMM-DOUALA-2026 it must unlock, not show "Wrong password"

3. Add routes in App.tsx:

<Route path="/admin" element={<Admin />} />

<Route path="/agency-login" element={<AgencyLogin />} />

4. Ignore WhatsApp for now - keep notifications in-app only

5. Publish the site now

After publish, tell me the 2 working links: /admin and /agency-login

Integrate Campay Sandbox payment NOW using these credentials I already created:

App ID: aTxY3-i-72IpRzNasjmHKviifPazJW0uz7ASaaUGskCji7WUDJ9VwE1fKGmR6Bl7Wl7gmISeA2MbOJLLWQRHgw

App Username: 8b9nMXkvBE2poASb1RJv4qMZNJQWnDe9RjYk6HDZwJhOPU3_pEjc2mQxaSGCfIwEfUahsP8p7j4dBoeVfbXrww

App Password: Kk8mIpXaDgMCSuuhD2hbuP7lGKfWB4OwfS30fP7uIlFo8WN9JIqkIIU8wvPcPgK8pToYPd3SBeWyMdZihCo2Bw

Permanent Token: NbECTd.3mdK4cqCP+/9Ij2tqAze0urtD~Zfi+ghQ

TASKS:

1. Create file src/lib/campay.ts:

export const CAMPAY_CONFIG = {

  baseUrl: "https://demo.campay.net",

  username: "8b9nMXkvBE2poASb1RJv4qMZNJQWnDe9RjYk6HDZwJhOPU3_pEjc2mQxaSGCfIwEfUahsP8p7j4dBoeVfbXrww",

  password: "Kk8mIpXaDgMCSuuhD2hbuP7lGKfWB4OwfS30fP7uIlFo8WN9JIqkIIU8wvPcPgK8pToYPd3SBeWyMdZihCo2Bw",

  token: "NbECTd.3mdK4cqCP+/9Ij2tqAze0urtD~Zfi+ghQ"

};

export async function collectPayment(phone: string, amount: number) {

  // Step 1: Get token

  const tokenRes = await fetch(`${CAMPAY_CONFIG.baseUrl}/api/token/`, {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ username: CAMPAY_CONFIG.username, password: CAMPAY_CONFIG.password })

  });

  const tokenData = await tokenRes.json();

  const authToken = tokenData.token || CAMPAY_CONFIG.token;

  // Step 2: Collect

  const collectRes = await fetch(`${CAMPAY_CONFIG.baseUrl}/api/collect/`, {

    method: "POST",

    headers: {

      "Content-Type": "application/json",

      "Authorization": `Token ${authToken}`

    },

    body: JSON.stringify({

      amount: amount.toString(),

      currency: "XAF",

      from: phone,

      description: "Mere Moth Mall Order",

      external_reference: "MTH-" + Date.now()

    })

  });

  return await collectRes.json();

}

export async function checkTransaction(reference: string, token: string) {

  const res = await fetch(`${CAMPAY_CONFIG.baseUrl}/api/transaction/${reference}/`, {

    headers: { Authorization: `Token ${token}` }

  });

  return await res.json();

}

2. In checkout page:

- Add input: "MoMo Number" default value 237677777777 with helper text "Sandbox: use 237677777777 for MTN success, 237699999999 for Orange success"

- Add input: Amount default 25 (max for sandbox)

- Button "Pay with MoMo - Test 25 FCFA"

- On click: call collectPayment(phone, amount), show loading "PENDING...", then show result SUCCESSFUL or FAILED

- Store transaction reference in localStorage

- Show success screen: "Payment held in Escrow - awaiting Agency delivery"

3. Use amount 25 only, because sandbox limit is 25 XAF.

4. Publish.
