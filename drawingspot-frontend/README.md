# DrawingSpot — Frontend

React + Vite client for the DrawingSpot platform.

---

## Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Framework    | React 19                    |
| Build Tool   | Vite 7                      |
| Routing      | React Router DOM 7          |
| HTTP Client  | Axios                       |
| Auth         | JWT + Google OAuth 2.0      |
| Icons        | React Icons 5               |

---

## Prerequisites

- Node.js 18+
- npm 9+
- The backend server running at `http://localhost:8080`

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

> `.env` is gitignored. Never commit real credentials.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start the development server       |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint`  | Run ESLint                         |

---

## Project Structure

```
src/
├── api/            # Axios API call modules
├── assets/         # Static assets (fonts, icons)
├── components/     # Reusable UI components
│   ├── common/     # CartDrawer, UserChat, etc.
│   ├── gallery/
│   ├── home/
│   ├── layout/     # Navbar, Footer
│   ├── order/
│   └── pricing/
├── context/        # Global state (AuthContext)
├── pages/          # Full page components
├── routes/         # AppRoutes.jsx — central route definitions
├── App.jsx
└── main.jsx
```

---

## Pages

| Route               | Page              | Auth Required |
|---------------------|-------------------|---------------|
| `/`                 | Home              | No            |
| `/pricing`          | Pricing           | No            |
| `/gallery`          | Gallery           | No            |
| `/order`            | Place an Order    | No            |
| `/login`            | Login             | No            |
| `/register`         | Register          | No            |
| `/how-it-works`     | How It Works      | No            |
| `/art-buying-guide` | Art Buying Guide  | No            |
| `/faqs`             | FAQs              | No            |
| `/contact`          | Contact Us        | No            |
| `/shipping-policy`  | Shipping Policy   | No            |
| `/dashboard`        | User Dashboard    | Yes           |
| `/my-orders`        | My Orders         | Yes           |
| `/admin`            | Admin Panel       | Yes           |

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services > Credentials**.
3. Create an **OAuth 2.0 Client ID** with application type `Web application`.
4. Add `http://localhost:5173` to **Authorized JavaScript origins**.
5. Copy the Client ID into your `.env` file.

---

## Notes

- The frontend expects the backend API at `http://localhost:8080`. Update the base URL in `src/api/` if your backend runs on a different host or port.
- The `node_modules/` and `dist/` directories are gitignored.
- Images under `src/assets/images/` are gitignored. Add your own locally.
