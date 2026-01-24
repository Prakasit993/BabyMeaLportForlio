# 🚀 Professional Portfolio - Full-stack AI Engineer

A high-performance, aesthetically pleasing portfolio built with **Next.js**, **Supabase**, and **Framer Motion**. Featuring a secure Admin Dashboard, multi-language support, and enterprise-grade security.

---

## ✨ Key Features

### 🌐 Multi-language (i18n)
- Seamless switching between **Thai** and **English**.
- Perspective-aware content rendering across all sections.
- URL-agnostic state management via Context API.

### 🔐 Secure Admin Dashboard
- **Authentication**: Dual-layer security with Password + **Passkeys (WebAuthn)** for biometrics login (Fingerprint/Face ID).
- **Audit Logs**: Real-time tracking of every change made to the database for transparency and security.
- **Content Management**: Full CRUD for Profile, Projects, and Tech Stack without touching code.

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern, translucent interface with depth.
- **Dynamic Animations**: Smooth staggered reveals, mouse-reactive spotlights, and parallax orbs powered by Framer Motion.
- **Typewriter Effect**: Dynamic Hero headlines to capture attention.
- **Optimized Performance**: 100/100 Lighthouse-ready architecture.

---

## 🛠️ Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Security**: WebAuthn API for Passkeys
- **Deployment**: Vercel-ready

---

## 📁 Project Structure

```text
babymeal-portfolio/
├── src/
│   ├── app/           # Next.js App Router (Routes & Layouts)
│   ├── components/    # Reusable UI & Admin Components
│   ├── lib/           # Context, Hooks, Supabase Client & Utils
│   └── ...
├── public/            # Static Assets
└── supabase/          # SQL Migration Scripts
```

---

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env.local` file with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD_HASH=...
```

### 2. Installations & Running
```bash
npm install
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 📄 License

Built with ❤️ for professional branding. All rights reserved.
