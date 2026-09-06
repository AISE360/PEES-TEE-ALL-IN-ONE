# Hosting — Sample Demo (1-click)

You have 3 ways to get a public demo link in <5 min:

## Option A — Instant Local Demo (already running)
Backend is live at **http://localhost:4000** (`/health` OK)
Web Portal build is ready at `web-portal/dist`

To serve portal locally with backend proxy:
```bash
# terminal 1 - backend (already running)
node backend/dist/index.js

# terminal 2 - portal
npm --workspace web-portal run preview -- --host 0.0.0.0 --port 5173
# open http://localhost:5173
```
Test API:
```bash
curl http://localhost:4000/api/client-requests
curl http://localhost:4000/api/portal/dashboard
```

## Option B — Free Public Hosting (recommended for sharing link)

### Backend → Render.com (free)
1. Push `C:\app` to GitHub
2. Render → New Web Service → connect repo → uses `render.yaml` auto
   - Build: `npm install --workspace backend && npm --workspace backend run build`
   - Start: `node backend/dist/index.js`
3. Note URL e.g. `https://pees-tee-backend.onrender.com`

### Portal → Vercel (free)
1. Vercel → Add New Project → import same repo
2. Framework: Vite, Root Directory: `web-portal`, Build: `npm run build`, Output: `dist`
3. Env var: `VITE_API_URL=https://pees-tee-backend.onrender.com`
4. Deploy → get `https://pees-tee-portal.vercel.app`

Alternative all-in-one: `docker-compose up --build` then expose via ngrok:
```bash
docker-compose up --build
ngrok http 5173   # public portal link
ngrok http 4000   # public API link
```

## Option C — Mobile Apps Demo

**Expo Go (no store needed):**
```bash
cd client-app && npx expo start --tunnel
# scan QR with Expo Go (Android/iOS) → live Client App

cd employee-app && npx expo start --tunnel
# scan QR → Employee App (login EMP00125 / password123)
```

**Web preview of mobile apps (no phone needed):**
```bash
cd client-app && npx expo start --web --port 19006
cd employee-app && npx expo start --web --port 19007
```

**Build APK/AAB for Play Store:**
```bash
npm install -g eas-cli
eas build --platform android  # in each app folder, needs Expo account
```

## Env for Production
Copy `backend/.env.example` → set real `MSG91_AUTH_KEY`, `S3_*`, `GOOGLE_MAPS_API_KEY`, `FCM_SERVER_KEY`, `JWT_SECRET`. All behind env vars — no code change.

## Current Local Status
- ✅ Backend built `backend/dist` and running on :4000
- ✅ Portal built `web-portal/dist` (240KB, gzip 76KB)
- ✅ Mock data seeded (1 client request PT24153, 1 premium PT48213)
- Socket.IO real-time verified

Share `http://YOUR_PUBLIC_IP:5173` after `vite preview --host` or use Vercel+Render links above.
