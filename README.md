# Finny — demo web app

A fully mocked, fully seeded demo of Finny: a loan marketplace comparing
licensed digital lenders in Uganda, on both a web app and a USSD channel.
Built for BOU@60. All lenders, borrowers, applications, and fraud reports
are seed data — nothing here is a real institution or transaction.

## Requirements

- [Node.js](https://nodejs.org) 18 or later (includes npm)

## Install

```bash
npm install
```

## Run in development

```bash
npm run dev
```

This starts a local dev server (default `http://localhost:5173`) and opens
it in your browser automatically. Edits to any file are reflected live.

## Build for production

```bash
npm run build
```

Outputs a static, deployable bundle to `dist/`.

## Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally, exactly as it would run once deployed.

## What to try

- **As a borrower**: pick "Borrower" on landing, browse the marketplace,
  compare lender offers, apply, check your applications, report fraud, and
  chat with the AI assistant.
- **As a lender**: switch roles from the header, review incoming
  applications, approve/reject/disburse, and manage products.
- **USSD demo**: from the header or landing page, open the USSD demo. On
  any device you get the feature-phone shell to dial `*247#` and walk the
  full menu (check a loan, view loans, repay, report fraud, change
  language). On desktop only, a raw session terminal is also shown below
  the phone, mirroring what a USSD aggregator backend would log.

No backend, no real API keys, no network calls — everything is mocked and
seeded in the browser (`js/data.js`), with state kept in `localStorage` so
it persists across a refresh. Use the "Reset demo" action to wipe state
and start fresh.
