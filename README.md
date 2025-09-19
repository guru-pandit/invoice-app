# Next.js Invoice App (JavaScript) with Firebase

A fully client-side Next.js app (App Router) for creating, saving, filtering, printing, and exporting invoices. Built with Chakra UI, Formik/Yup, TanStack React Table, Firebase (Firestore), and XLSX.

## Features
- Create and edit invoices with Formik + Yup validation (`components/InvoiceForm.jsx`).
- List invoices with filtering by customer and date/time (`components/InvoiceTable.jsx`).
- Export filtered invoices to Excel (`utils/exportExcel.js`).
- Print invoice detail view (`components/InvoicePrint.jsx`) using `react-to-print`.
- Firebase data access split into a separate folder: `lib/firebase/`.
- Reusable hooks in `hooks/` (e.g., `useInvoices.js`).
- Clean JS-only stack (no TypeScript).

## Tech
- Next.js 14 App Router (JavaScript)
- Chakra UI
- Formik + Yup
- TanStack React Table v8
- Firebase v10 (Firestore)
- date-fns
- xlsx + file-saver
- react-to-print

## Project Structure
```
app/
  layout.js
  page.js
  invoices/
    page.js            # list + filters + export
    new/
      page.js          # create form
    [id]/
      page.js          # detail, edit, print
components/
  InvoiceForm.jsx
  InvoicePrint.jsx
  InvoiceTable.jsx
hooks/
  useInvoices.js
lib/
  firebase/
    firebase.js        # firebase init (client)
    invoices.js        # CRUD + listeners
providers/
  ChakraProviders.jsx
utils/
  calc.js
  exportExcel.js
  format.js
.env.local.example
jsconfig.json
next.config.js
package.json
README.md
```

## Getting Started

1) Install dependencies
```
npm install
```

2) Create an `.env.local` from the example and fill with your Firebase project settings:
```
cp .env.local.example .env.local
# then edit .env.local to include your Firebase web app config
```
Required env vars:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

3) Enable Firestore in your Firebase console.

4) Enable Authentication (Phone)
- In Firebase Console > Authentication > Sign-in method: enable "Phone"
- Add your development domain (e.g., http://localhost:3000) to the Authorized domains list
- For local testing you can optionally add test phone numbers in the Authentication settings

4) (Optional) Set basic Firestore Security Rules for development (adjust as needed):
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Development only. Lock this down for production.
    }
  }
}
```

5) Run the dev server
```
npm run dev
```
Open http://localhost:3000

## Usage
- Authentication
  - Visit `/login` to sign in with your mobile number via OTP (reCAPTCHA is used invisibly)
  - Session is persisted with `browserLocalPersistence` so the user auto-loads on reload
  - Routes are protected by `components/AuthGate.jsx` (all routes except `/` and `/login`)
  - Top navigation shows phone number and a Sign out button

- Go to `Invoices` to see the list table.
- Use the filters: select a customer, choose a From/To date-time, and click `Export Excel` to download a filtered report.
- Click `New Invoice` to create a new one.
- Click a row to view/edit/print an invoice. Use the `Print` button to open the system print dialog.

## Notes
- All code is JavaScript-based to align with your request.
- Dates stored in Firestore use `serverTimestamp()` for `createdAt` on create. The form fields convert to and from datetime-local strings.
- The invoices collection: `invoices` with fields such as `number`, `customerName`, `customerEmail`, `items[]`, `subtotal`, `tax`, `total`, `status`.

## Customization Ideas
- Add authentication and per-user scoping.
- Add customer management.
- Add pagination / virtualized tables for large datasets.
- Add PDF export (e.g., `jspdf` + `autoTable`).
