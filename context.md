You are a senior full-stack architect and engineer.

Your task is to design and implement a production-ready monorepo for an AI-powered fitness coach application with real-time form correction.

## 🧩 TECH STACK

Monorepo:
- Nx (latest stable)

Frontend (Web):
- Next.js (App Router)
- TypeScript
- TailwindCSS
- React Query (TanStack Query)

Mobile:
- React Native (Expo)
- TypeScript

Backend:
- Spring Boot (Kotlin)
- Gradle (Kotlin DSL)
- PostgreSQL

AI / Client-side:
- MediaPipe or TensorFlow.js for pose estimation (client-side only)

Infrastructure:
- Docker
- CI/CD (GitHub Actions)
- Environment-based configs

---

# 🎯 GOAL

Build a **production-ready system** for an AI fitness coach that:
- Uses camera input to detect body pose
- Performs real-time form analysis on-device
- Provides live feedback (visual + audio)
- Stores user progress and workout history
- Supports authentication and subscriptions

---

# 🏗️ MONOREPO STRUCTURE (NX)

Create a clean and scalable Nx workspace with:

apps/
web/           → Next.js app
mobile/        → React Native (Expo)
api/           → Spring Boot backend

libs/
ui/            → Shared UI components (cross-web/mobile where possible)
types/         → Shared TypeScript types/interfaces
utils/         → Shared utilities
config/        → Shared configs (eslint, tsconfig, etc.)

Ensure:
- Strict module boundaries
- Enforced lint rules
- Path aliases configured

---

# 🌐 WEB APP (Next.js)

Requirements:
- App Router (no pages router)
- Client-side rendering for camera features
- Webcam integration
- Pose detection using MediaPipe or TensorFlow.js
- Real-time skeleton rendering
- Form analysis engine (start with squats)

Features:
- Rep counting
- Angle calculation (knees, hips, back)
- Live feedback (text + optional voice)
- Clean responsive UI

Architecture:
- Feature-based folder structure
- Hooks for pose processing
- Separation of:
    - detection
    - analysis
    - UI rendering

---

# 📱 MOBILE APP (React Native - Expo)

Requirements:
- Camera integration
- Pose detection (if feasible on device, otherwise mock for MVP)
- Shared logic with web where possible

Features:
- Workout tracking
- Feedback UI
- Sync with backend

---

# ⚙️ BACKEND (Spring Boot + Kotlin)

Design a clean REST API with:

Modules:
- auth
- users
- workouts
- subscriptions

Features:
- JWT authentication
- Role-based access (user/admin)
- Workout session storage
- Progress tracking

Database:
- PostgreSQL
- Use Flyway or Liquibase for migrations

Best practices:
- Layered architecture (controller → service → repository)
- DTOs and mapping
- Validation
- Exception handling

---

# 🔐 AUTHENTICATION

- Email/password login
- JWT-based auth
- Secure password hashing (BCrypt)

---

# 💳 PAYMENTS

- Integrate Stripe
- Subscription model (monthly/yearly)
- Webhook handling in backend

---

# 🧠 AI / FORM ANALYSIS

Implement:
- Pose keypoint extraction
- Angle calculations
- Rule-based feedback engine

Start with:
- Squat detection:
    - Knee angle
    - Hip depth
    - Back angle

Design system to be extensible for:
- push-ups
- lunges
- other exercises

---

# 🎨 UI/UX

- Clean, modern design
- Real-time overlays (skeleton)
- Feedback indicators (color-coded)
- Minimal latency

---

# 🐳 DOCKER

Provide:
- Dockerfiles for:
    - web
    - backend

- docker-compose for local dev:
    - backend
    - database

---

# 🚀 CI/CD (GitHub Actions)

Pipelines:
- Lint + test on PR
- Build all apps
- Docker image build
- Deploy-ready artifacts

---

# 🧪 TESTING

- Unit tests:
    - frontend (Jest)
    - backend (JUnit)

- Integration tests for API

---

# 📦 ENVIRONMENT MANAGEMENT

- .env support
- Separate configs for:
    - dev
    - staging
    - production

---

# 📊 OBSERVABILITY (basic)

- Logging (backend)
- Error handling
- Basic analytics hooks

---

# 📚 DOCUMENTATION

Generate:
- README with setup instructions
- Architecture overview
- How to run locally
- Deployment guide

---

# ⚠️ CONSTRAINTS

- Keep AI inference client-side (no heavy backend AI)
- Optimize for performance (low latency)
- Write clean, maintainable, scalable code
- Follow best practices for each framework

---

# 🧭 DELIVERY STRATEGY

Build in phases:

Phase 1:
- Monorepo setup
- Web app with pose detection + squat feedback

Phase 2:
- Backend (auth + workouts)
- Connect web to backend

Phase 3:
- Mobile app

Phase 4:
- Payments + subscriptions

Phase 5:
- CI/CD + Docker + production readiness

---

# ✅ OUTPUT EXPECTATION

- Fully working monorepo
- Production-ready codebase
- Clear folder structure
- No placeholder or pseudo implementations unless explicitly stated
