<div align="center">

# 🎨 DrawingSpot

**A full-stack web platform for commissioning custom hand-drawn artwork.**  
Customers browse the gallery, place orders with reference images, and track progress — all in one place.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vite.dev)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org)

</div>

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Available Routes](#available-routes)
- [API Endpoints](#api-endpoints)
- [Resetting the Database](#resetting-the-database)

---

## Project Overview

DrawingSpot is a commission-based art platform where:

- **Customers** can register, browse a gallery, place custom drawing orders (with reference image uploads), track order status, and chat with the artist.
- **Admins** can manage orders, update statuses, upload completed artwork, manage gallery items, and view all user feedback via a dedicated Admin Panel.
- **Authentication** is handled via JWT tokens with optional Google OAuth sign-in.

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Backend     | Java 21, Spring Boot 3.5, Spring Security, JPA  |
| Database    | PostgreSQL 16                                   |
| ORM         | Hibernate (via Spring Data JPA)                 |
| Auth        | JWT (jjwt 0.11.5) + Google OAuth 2.0           |
| Frontend    | React 19, Vite 7, React Router DOM 7           |
| HTTP Client | Axios                                           |
| Icons       | React Icons 5                                   |
| Build Tool  | Maven (backend), npm (frontend)                 |

---

## Project Structure

```
DrawingSpot/
├── drawingspot-backend/          # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/drawingspot/
│   │       │   ├── config/       # Security, CORS, MVC config
│   │       │   ├── controller/   # REST API controllers
│   │       │   ├── exception/    # Global exception handling
│   │       │   ├── model/        # JPA entities
│   │       │   ├── repository/   # Spring Data repositories
│   │       │   ├── service/      # Business logic
│   │       │   └── util/         # JWT utilities
│   │       └── resources/
│   │           └── application.properties
│   ├── uploads/orders/           # Uploaded reference images (auto-created)
│   ├── reset.sql                 # SQL to drop all tables (dev use)
│   └── pom.xml
│
├── drawingspot-frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── api/                  # Axios API call modules
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/           # CartDrawer, UserChat, etc.
│   │   │   ├── gallery/
│   │   │   ├── home/
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   ├── order/
│   │   │   └── pricing/
│   │   ├── context/              # AuthContext (global auth state)
│   │   ├── pages/                # Full page components
│   │   ├── routes/               # AppRoutes.jsx (central routing)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                      # Frontend environment variables
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure the following are installed on your machine before starting:

| Tool             | Version  | Download                                               |
|------------------|----------|--------------------------------------------------------|
| Java (JDK)       | 21+      | https://adoptium.net                                   |
| Maven            | 3.9+     | https://maven.apache.org/download.cgi                  |
| Node.js          | 18+      | https://nodejs.org                                     |
| npm              | 9+       | Comes bundled with Node.js                             |
| PostgreSQL       | 14+      | https://www.postgresql.org/download                    |
| Git              | any      | https://git-scm.com                                    |

> **Tip:** Verify installations by running `java -version`, `mvn -version`, `node -version`, and `psql --version` in a terminal.

---

## Database Setup

### 1. Start PostgreSQL

Ensure your PostgreSQL server is running (default port `5432`).

### 2. Create the database

Open a terminal and run:

```bash
psql -U postgres
```

Then inside the psql shell:

```sql
CREATE DATABASE drawingspot;
\q
```

### 3. (Optional) Reset all tables

If you want to wipe existing tables and start fresh, run the provided script:

```bash
psql -U postgres -d drawingspot -f drawingspot/reset.sql
```

> ⚠️ This drops `chat_messages`, `orders`, and `users` tables — use only in development.

Hibernate will **auto-recreate** all tables on the next backend start (`ddl-auto=update`).

---

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/forex911/DrawingSpot.git
cd DrawingSpot
```

### 2. Configure application properties

Open `drawingspot-backend/src/main/resources/application.properties` and update the database credentials:

```properties
# PostgreSQL connection
spring.datasource.url=jdbc:postgresql://localhost:5432/drawingspot
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD

# JWT secret — change this to a long random string in production
jwt.secret=mySecretKeyForDrawingSpotApplication123456
jwt.expiration=3600000
```

> 🔐 **Never commit real passwords to version control.** Consider using environment variables or a `.env` file injected at runtime for production deployments.

### 3. Build and run the backend

Navigate into the backend directory and use the Maven wrapper:

```bash
cd drawingspot-backend

# On macOS / Linux
./mvnw spring-boot:run

# On Windows (PowerShell / CMD)
.\mvnw.cmd spring-boot:run
```

Or if Maven is installed globally:

```bash
mvn spring-boot:run
```

The backend will start at **http://localhost:8080**.

### 4. Verify the backend is running

Open a browser or use curl:

```bash
curl http://localhost:8080/api/pricing
```

You should receive a JSON response (empty array `[]` on first run).

---

## Frontend Setup

### 1. Install dependencies

```bash
cd drawingspot-frontend
npm install
```

### 2. Configure environment variables

Create (or edit) the `.env` file inside `drawingspot-frontend/`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

> See the [Google OAuth Setup](#google-oauth-setup) section below if you don't have a Client ID yet.

### 3. Start the development server

```bash
npm run dev
```

The frontend will start at **http://localhost:5173**.

---

## Environment Variables

### Backend — `application.properties`

| Property                        | Description                              | Default                          |
|---------------------------------|------------------------------------------|----------------------------------|
| `server.port`                   | Port the backend runs on                 | `8080`                           |
| `spring.datasource.url`         | PostgreSQL JDBC URL                      | `jdbc:postgresql://localhost:5432/drawingspot` |
| `spring.datasource.username`    | PostgreSQL username                      | `postgres`                       |
| `spring.datasource.password`    | PostgreSQL password                      | *(set yours)*                    |
| `jwt.secret`                    | Secret key for signing JWT tokens        | *(change in production)*         |
| `jwt.expiration`                | JWT expiry in milliseconds               | `3600000` (1 hour)               |
| `upload.dir`                    | Directory for uploaded reference images  | `uploads/orders`                 |
| `spring.servlet.multipart.max-file-size` | Max file size per upload        | `20MB`                           |

### Frontend — `drawingspot-frontend/.env`

| Variable                 | Description                          |
|--------------------------|--------------------------------------|
| `VITE_GOOGLE_CLIENT_ID`  | Google OAuth 2.0 Client ID           |

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth 2.0 Client IDs**.
5. Set **Application type** to `Web application`.
6. Add the following **Authorized JavaScript origins**:
   - `http://localhost:5173` (for development)
7. Copy the generated **Client ID** and paste it into `drawingspot-frontend/.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

---

## Running the Application

Run both servers simultaneously in **separate terminals**:

**Terminal 1 — Backend:**
```bash
cd DrawingSpot/drawingspot-backend
.\mvnw.cmd spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd DrawingSpot/drawingspot-frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Available Routes

| Route              | Page                      | Auth Required |
|--------------------|---------------------------|---------------|
| `/`                | Home                      | No            |
| `/pricing`         | Pricing Plans             | No            |
| `/gallery`         | Art Gallery               | No            |
| `/order`           | Place an Order            | No            |
| `/login`           | Login                     | No            |
| `/register`        | Register                  | No            |
| `/how-it-works`    | How It Works              | No            |
| `/art-buying-guide`| Art Buying Guide          | No            |
| `/faqs`            | FAQs                      | No            |
| `/contact`         | Contact Us                | No            |
| `/shipping-policy` | Shipping Policy           | No            |
| `/dashboard`       | User Dashboard            | ✅ Yes        |
| `/my-orders`       | My Orders                 | ✅ Yes        |
| `/admin`           | Admin Panel               | ✅ Yes        |

---

## API Endpoints

All API endpoints are prefixed with `/api`.

### Auth — `/api/auth`
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Login and receive JWT    |
| POST   | `/api/auth/google`   | Google OAuth login       |

### Orders — `/api/orders`
| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | `/api/orders`                     | Place a new order (with file upload)|
| GET    | `/api/orders/user/{userId}`       | Get all orders for a user          |
| GET    | `/api/orders`                     | Get all orders (admin)             |
| PUT    | `/api/orders/{id}/status`         | Update order status (admin)        |
| POST   | `/api/orders/{id}/completed-image`| Upload completed artwork (admin)   |

### Gallery — `/api/gallery`
| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | `/api/gallery`    | Get all gallery items     |
| POST   | `/api/gallery`    | Add a gallery item (admin)|
| DELETE | `/api/gallery/{id}`| Delete a gallery item    |

### Pricing — `/api/pricing`
| Method | Endpoint            | Description               |
|--------|---------------------|---------------------------|
| GET    | `/api/pricing`      | Get all pricing plans     |
| POST   | `/api/pricing`      | Add a pricing plan        |
| PUT    | `/api/pricing/{id}` | Update a pricing plan     |
| DELETE | `/api/pricing/{id}` | Delete a pricing plan     |

### Chat — `/api/chat`
| Method | Endpoint                              | Description                      |
|--------|---------------------------------------|----------------------------------|
| GET    | `/api/chat/messages/{userId}`         | Get chat history for a user      |
| POST   | `/api/chat/send`                      | Send a message                   |

### Feedback — `/api/feedback`
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/feedback`   | Submit feedback          |
| GET    | `/api/feedback`   | Get all feedback (admin) |

### Newsletter — `/api/newsletter`
| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| POST   | `/api/newsletter/subscribe` | Subscribe to newsletter    |

---

## Resetting the Database

To completely reset all tables during development:

```bash
psql -U postgres -d drawingspot -f drawingspot/reset.sql
```

Then restart the backend — Hibernate will recreate the schema automatically.

---

## Common Issues

| Problem | Solution |
|---------|----------|
| `Connection refused` on backend start | Ensure PostgreSQL is running on port `5432` |
| `FATAL: password authentication failed` | Double-check credentials in `application.properties` |
| Frontend shows blank page | Make sure backend is running on port `8080` |
| Google sign-in fails | Verify `VITE_GOOGLE_CLIENT_ID` in `.env` and that `localhost:5173` is an allowed origin in Google Cloud Console |
| Image uploads fail | Ensure the `drawingspot/uploads/orders/` directory exists and is writable |

---

<div align="center">

Made with ❤️ by the DrawingSpot team

</div>
