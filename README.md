# Prowider Mini Lead Distribution System

A full-stack lead generation and fair distribution system built with Next.js, Express, and MongoDB.

## Features
- **Public Lead Request Form**: Users can request services. Duplicate leads (same phone + same service) are blocked.
- **Fair Lead Distribution**: Automated assignment to 3 providers based on mandatory rules and a persistent round-robin algorithm.
- **Provider Dashboard**: Real-time updates (via polling) showing quota usage and assigned leads.
- **Webhook Integration**: Idempotent quota reset via payment simulation.
- **System Test Tools**: Tools to test concurrency (10 simultaneous leads) and webhook idempotency.

---

## Technical Explanations

### 1. Allocation Algorithm
The system uses a two-step allocation process:
1. **Mandatory Assignment**: Based on the `serviceName`, specific "Mandatory Providers" are assigned first (e.g., Provider 1 for Service 1).
2. **Fair Round-Robin Allocation**: Remaining slots (to reach a total of 3) are filled from a provider pool. The system maintains a persistent `AllocationState` in MongoDB for each service, tracking the `currentIndex` of the last assigned provider. On each request, it resumes from the next index, ensuring a fair rotation over time that persists across server restarts.

### 2. Concurrency Handling
To handle simultaneous lead submissions (as tested in the Concurrency Test), the backend utilizes **MongoDB Transactions (`session.withTransaction`)**. 
- The lead creation and the provider quota updates/assignments are wrapped in a single atomic transaction.
- Quota increments use `$inc` with a filter `{ usedQuota: { $lt: 10 } }` to ensuring that no provider can ever exceed their monthly limit, even if multiple processes try to update it at the same time.
- If any part of the process fails (e.g., not enough providers with remaining quota), the entire transaction rolls back.

### 3. Webhook Idempotency
The payment webhook handles idempotency by recording every processed `eventId` in a `WebhookEvent` collection.
- Before processing a reset, the system checks if the `eventId` already exists.
- If found, it returns a success message without re-executing the logic.
- A unique index on `eventId` provides a secondary safety layer against race conditions.

---

## Deployment Guide

### Backend (Render)
1. Create a new "Web Service" on [Render](https://render.com/).
2. Connect your GitHub repository and set the Root Directory to `backend`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start` (Make sure `package.json` has `start: "node src/server.js"`).
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Connection String.
   - `PORT`: 5000 (Render usually sets this automatically).
   - `FRONTEND_URL`: Your Vercel deployment URL.
   - `BASE_URL`: Your Render backend URL (for self-referencing concurrency tests).

### Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com/new).
2. Set the Root Directory to `frontend`.
3. Vercel will automatically detect Next.js.
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://your-backend.onrender.com/api`).

---

## Setup Instructions (Local)
1. Clone the repository.
2. **Backend**:
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI
   npm run seed  # CRITICAL: Seeds services and providers
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   # Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api
   npm run dev
   ```
