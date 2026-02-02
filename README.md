# 🚀 Professional Portfolio - System Engineer / Automation Engineer

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

### Prerequisites

Ensure you have the following installed:

| Tool | Required Version | Check Command |
|------|------------------|---------------|
| **Node.js** | `>=18.17.0` (LTS recommended) | `node -v` |
| **npm** | `>=9.0.0` | `npm -v` |

> 💡 Download the latest LTS version from [nodejs.org](https://nodejs.org/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/babymeal-portfolio.git
cd babymeal-portfolio
```

### 2. Environment Setup
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD_HASH=your_bcrypt_hash
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📄 License

Built with ❤️ for professional branding. All rights reserved.
