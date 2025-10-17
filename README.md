# Trading Simulation Monitoring Dashboard

This Next.js app provides a private monitoring dashboard for a trading simulation backed by MongoDB. It includes OAuth sign-in with admin approval, SSE live updates (MongoDB change streams), and admin management.

Environment variables (.env):

- MONGO_URI: MongoDB connection string
- NEXTAUTH_URL: NextAuth base URL (e.g. http://localhost:3000)
- NEXTAUTH_SECRET: NextAuth secret
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET: OAuth provider credentials
- ADMIN_EMAILS (optional): comma-separated emails to auto-approve as admins on first sign-in

Quick start

1. Copy `.env.example` to `.env.local` and fill values.
2. Install deps: `npm install`
3. Run dev server: `npm run dev`

Creating the first admin

Option A (recommended): set `ADMIN_EMAILS` in `.env.local` to your email before first sign-in. When a user with that email signs in for the first time, they will be created and marked as role `admin` and approved.

Option B: Approve directly in the database. Insert a document into `users` collection with `role: 'admin', approved: true`.

API endpoints

See Postman collection file: `postman_collection.json` for examples. You can also use these curl examples:

GET candles:
```
curl 'http://localhost:3000/api/candles?symbol=BTCUSDT&interval=1m&limit=100'
```

Admin approve (requires session of admin):
```
curl -X POST 'http://localhost:3000/api/admin/users/approve' -H 'Content-Type: application/json' -d '{"user_id":"<id>"}'
```

Testing

Run unit tests:

```
npm test
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# gold
