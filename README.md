
# 🚀 Welcome to xPro.li

**xPro.li** is a sleek and modern URL shortener service designed to be fast, minimal, and developer-friendly.

> Live URL: [https://xpro.li](https://xpro.li)

---

## 🛠️ Tech Stack

This project is built using:

- ⚡ [Vite](https://vitejs.dev/) — Fast frontend tooling
- 🧠 [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- ⚛️ [React](https://reactjs.org/) — UI library
- 🎨 [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- 🧩 [shadcn/ui](https://ui.shadcn.com/) — Beautifully styled UI components
- 🌐 [Render](https://render.com/) — Deployed backend & frontend
- 🌍 [Netlify](https://www.netlify.com/) — For domain + frontend hosting
- ☁️ [MongoDB Atlas](https://www.mongodb.com/atlas/database) — Database (optional, if used)

---

## 🧑‍💻 Development Setup

You can run and modify the project locally using your preferred IDE.

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_REPO_URL>
cd xpro.li
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app should be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
xpro.li/
├── public/              # Static files
├── src/                 # Main source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API logic
│   ├── main.tsx         # App entry point
│   └── App.tsx          # Main layout
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🌐 Custom Domain Setup

The frontend is hosted on **Netlify**, and the domain `xpro.li` is configured as a custom domain. To manage your domain:

- Visit: [Netlify Dashboard](https://app.netlify.com/)
- Navigate to your project → **Domain Settings**
- Add subdomains like `api.xpro.li` or `admin.xpro.li` as needed.

To add a subdomain pointing to Render (for the backend):
1. Go to your domain DNS provider.
2. Add a CNAME or A Record pointing `api.xpro.li` to your Render backend.
3. Add that domain inside Render’s dashboard under "Custom Domains".

---

## 🧪 Scripts

| Command         | Purpose                            |
|----------------|------------------------------------|
| `npm run dev`  | Start local dev server             |
| `npm run build`| Build the project for production   |
| `npm run lint` | Run ESLint for code formatting     |

---

## ☁️ Deployment

- **Frontend** is deployed via **Netlify**
- **Backend** is hosted on **Render** (Node.js / Express)
- CI/CD setup triggers deployment on push to `main`

---

## 🔐 Environment Variables

Make sure to add the following `.env` file in the root of your backend project:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
BASE_URL=https://xpro.li
```

You can securely manage these in Render’s "Environment" section.

---

## 🧠 Contributing

Feel free to fork this repo, submit PRs, or raise issues. Let’s build a better, open shortener! 😎

---

## 📬 Contact

If you need help or want to collaborate:

- ✉️ Email: sahsisunny@gmail.com
- 🐦 Twitter: [@sahsisunny](https://twitter.com/sahsisunny)
- 🌍 Website: [https://xpro.li](https://xpro.li)

---

## 📄 License

MIT License — do whatever you want, just don’t remove attribution.

