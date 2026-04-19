# 🏋️ AI Fitness Coach

A production-ready AI-powered fitness coaching application with real-time form correction using pose estimation. All AI inference runs **client-side** for zero-latency feedback and complete privacy.

## 🏗️ Architecture Overview

```
ai-fitness-coach/                    ← Nx Monorepo
├── apps/
│   ├── web/                         ← Next.js 14 (App Router) + MediaPipe
│   ├── mobile/                      ← React Native (Expo) + expo-camera
│   └── api/                         ← Spring Boot (Kotlin) + PostgreSQL
├── libs/
│   ├── types/                       ← Shared TypeScript types
│   ├── utils/                       ← Shared utilities (angle math, squat analyzer)
│   ├── ui/                          ← Shared React components
│   └── config/                      ← Shared constants & config
├── .github/workflows/ci.yml         ← GitHub Actions CI/CD
└── docker-compose.yml               ← Local dev orchestration
```

### Tech Stack

| Layer         | Technology                                         |
|---------------|----------------------------------------------------|
| Monorepo      | Nx 20                                              |
| Web Frontend  | Next.js 14 (App Router), TypeScript, TailwindCSS   |
| State/Data    | TanStack Query v5                                  |
| Mobile        | React Native (Expo 51), expo-router                |
| AI/Pose       | MediaPipe Pose Landmarker (client-side, WebAssembly)|
| Backend       | Spring Boot 3.3, Kotlin, Gradle (Kotlin DSL)       |
| Database      | PostgreSQL 16, Flyway migrations                   |
| Auth          | JWT (HS256), BCrypt password hashing               |
| Payments      | Stripe Checkout + Webhooks                         |
| Infrastructure| Docker, GitHub Actions                             |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- JDK 21+
- Docker + Docker Compose
- (Optional) Expo CLI for mobile

### 1. Clone & Install

```bash
git clone https://github.com/your-org/ai-fitness-coach.git
cd ai-fitness-coach
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your values (see Environment Variables section)
```

### 3. Start the Database

```bash
docker compose up db -d
```

### 4. Start the Backend

```bash
cd apps/api
./gradlew bootRun
# API available at http://localhost:8080
```

### 5. Start the Web App

```bash
pnpm nx serve web
# Web available at http://localhost:3000
```

### 6. Start the Mobile App (optional)

```bash
cd apps/mobile
pnpm expo start
# Scan QR with Expo Go on your phone
```

---

## 🐳 Docker (Full Stack)

```bash
cp .env.example .env
docker compose up --build
```

Services:
- Web: http://localhost:3000
- API: http://localhost:8080
- DB: localhost:5432

---

## 📦 Environment Variables

| Variable                            | Description                          | Required |
|-------------------------------------|--------------------------------------|----------|
| `DATABASE_URL`                      | PostgreSQL JDBC URL                  | ✅        |
| `DATABASE_USER`                     | PostgreSQL username                  | ✅        |
| `DATABASE_PASSWORD`                 | PostgreSQL password                  | ✅        |
| `JWT_SECRET`                        | HS256 signing secret (≥ 32 chars)    | ✅        |
| `STRIPE_SECRET_KEY`                 | Stripe secret key (sk_...)           | ✅        |
| `STRIPE_WEBHOOK_SECRET`             | Stripe webhook signing secret        | ✅        |
| `STRIPE_MONTHLY_PRICE_ID`           | Stripe Price ID for monthly plan     | ✅        |
| `STRIPE_YEARLY_PRICE_ID`            | Stripe Price ID for yearly plan      | ✅        |
| `NEXT_PUBLIC_API_URL`               | Backend URL from browser             | ✅        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`| Stripe publishable key (pk_...)      | ✅        |
| `CORS_ALLOWED_ORIGINS`              | Comma-separated allowed origins      | ✅        |

---

## 🧠 AI Form Analysis

### How it works

1. **Pose Detection**: MediaPipe Pose Landmarker runs entirely in the browser via WebAssembly — no video data ever leaves the device.
2. **Landmark Extraction**: 33 body keypoints are extracted per frame at ~30 FPS.
3. **Angle Calculation**: Joint angles (knee, hip, back) are computed using vector math (`libs/utils/src/angle.ts`).
4. **Phase State Machine**: A state machine tracks squat phases: `STANDING → DESCENDING → BOTTOM → ASCENDING → STANDING`.
5. **Rule-based Feedback**: Thresholds trigger color-coded feedback messages.
6. **Rep Counting**: A completed cycle through all phases increments the rep counter.

### Adding New Exercises

Implement the `ExerciseAnalyzer<T>` interface from `@fitness/utils`:

```typescript
import { ExerciseAnalyzer, PoseLandmark } from '@fitness/utils';

export class PushupAnalyzer implements ExerciseAnalyzer<PushupAnalysis> {
  analyze(landmarks: PoseLandmark[]): PushupAnalysis {
    // Your implementation
  }
  reset(): void { /* ... */ }
}
```

---

## 🔐 API Reference

### Auth

```
POST /api/auth/register    — Register new user
POST /api/auth/login       — Login, returns JWT tokens
POST /api/auth/refresh     — Refresh access token
```

### Users

```
GET  /api/users/me         — Get current user profile
PATCH /api/users/me        — Update profile
```

### Workouts

```
GET  /api/workouts/sessions    — List sessions (paginated)
POST /api/workouts/sessions    — Save a session
GET  /api/workouts/progress    — Get progress stats
```

### Subscriptions

```
POST /api/subscriptions/checkout  — Create Stripe checkout session
POST /api/subscriptions/portal    — Create Stripe billing portal session
GET  /api/subscriptions/status    — Get subscription status
POST /api/webhooks/stripe         — Stripe webhook endpoint
```

---

## 🧪 Testing

```bash
# Frontend unit tests
pnpm nx test utils

# Backend tests
cd apps/api && ./gradlew test

# Run all
pnpm nx run-many --target=test --all
```

---

## 🚀 CI/CD

GitHub Actions runs on every push/PR:

1. **Lint & Test** (frontend) — ESLint + Jest for `utils`, `web`
2. **Lint & Test** (backend) — Gradle test with H2 in-memory DB
3. **Build Web** — `nx build web`
4. **Build API** — `./gradlew bootJar`
5. **Docker Build & Push** — Pushes to GHCR on merge to `main`

### Required GitHub Secrets

```
NEXT_PUBLIC_API_URL
```

---

## 📁 Project Structure (detailed)

```
apps/web/
├── app/                    ← Next.js App Router pages
│   ├── layout.tsx          ← Root layout with QueryClientProvider
│   ├── page.tsx            ← Landing page
│   ├── coach/page.tsx      ← AI coaching page
│   ├── dashboard/page.tsx  ← User dashboard
│   ├── auth/login/         ← Login page
│   └── auth/register/      ← Register page
├── features/
│   ├── pose/               ← Pose detection layer
│   │   ├── poseDetection.service.ts  ← MediaPipe singleton
│   │   ├── usePoseDetection.ts       ← Detection hook (rAF loop)
│   │   └── SkeletonOverlay.tsx       ← Canvas overlay renderer
│   ├── coach/              ← Coach UI feature
│   │   ├── CoachView.tsx   ← Main coaching component
│   │   ├── useWebcam.ts    ← Camera stream hook
│   │   ├── useSquatAnalysis.ts       ← Analysis hook
│   │   └── useSpeechFeedback.ts      ← TTS feedback hook
│   └── dashboard/          ← Dashboard feature
├── hooks/useQueries.ts     ← TanStack Query hooks
└── lib/
    ├── api.ts              ← API function layer
    └── apiClient.ts        ← Axios instance with interceptors

libs/utils/src/
├── angle.ts               ← Vector math (calculateAngle, etc.)
├── repCounter.ts          ← Rep counting state machine
└── analysis/
    └── squatAnalyzer.ts   ← Squat form analysis engine

apps/api/src/main/kotlin/com/aifitness/api/
├── auth/                  ← JWT auth (filter, provider, service, controller)
├── user/                  ← User entity, repository, DTOs, controller
├── workout/               ← Workout session entity, service, controller
├── subscription/          ← Stripe subscription + webhook handling
├── config/                ← SecurityConfig
└── common/                ← GlobalExceptionHandler
```

---

## 🛣️ Roadmap

- [x] Phase 1: Nx monorepo + web pose detection + squat analysis
- [x] Phase 2: Spring Boot backend (auth, workouts, subscriptions)
- [x] Phase 3: React Native mobile app (Expo)
- [x] Phase 4: Stripe payments integration
- [x] Phase 5: Docker + GitHub Actions CI/CD
- [ ] TFLite on-device model for mobile (replace mock)
- [ ] Push-up and lunge analyzers
- [ ] Progressive Web App (PWA) support
- [ ] Real-time workout sharing
- [ ] Trainer dashboard (admin role)

---

## 📄 License

MIT — see [LICENSE](./LICENSE)

