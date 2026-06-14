# <p align="center"><img src="./frontend/public/favicon.svg" alt="ShrinkLQ Logo" width="64" height="64"><br>ShrinkLQ</p>

<p align="center">
  <strong>Smart URL Shortener with Advanced Analytics</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green" alt="Backend">
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen" alt="Database">
  <img src="https://img.shields.io/badge/Authentication-JWT%20%26%20OAuth-orange" alt="Authentication">
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%26%20Railway-black" alt="Deployment">
  <img src="https://img.shields.io/badge/License-MIT-purple" alt="License">
</p>

<p align="center">
  A modern URL Shortener with Analytics, QR Codes, Bulk URL Shortening and Secure Authentication.
</p>

---

## 📖 Introduction

### Purpose of the Project
In the modern digital landscape, long, complex URLs are difficult to share, remember, and track. **ShrinkLQ** (formerly Shortly) resolves this friction by providing a self-hosted, enterprise-ready link management platform. It allows businesses, marketers, and developers to transform raw URLs into clean, recognizable, and highly trackable links.

### Main Idea
ShrinkLQ isn't just about cutting links short; it's a comprehensive link optimization and intelligence engine. Users can secure links with passwords, set expiry dates, use custom domain-like aliases, generate dynamic download-friendly QR codes, and upload entire CSV lists of URLs for bulk generation. Furthermore, every click is tracked in real-time, feeding an interactive dashboard populated with browser, device, and timeline analytics to capture target audience behaviors.

### Technologies Used
The application is engineered on top of a highly responsive **MERN (MongoDB, Express, React, Node.js)** architecture, using **Vite** for optimized assets compilation, **Tailwind CSS** with **Shadcn UI** for visual aesthetics, **Framer Motion** for micro-interactions, and **Recharts** for performance-driven data visualizations.

---

## 💻 Tech Stack

### 🎨 Frontend
- **React (v18)**: Core component rendering and component state orchestration.
- **Vite**: Ultra-fast next-generation frontend tooling and developer environment.
- **Tailwind CSS**: Utility-first CSS styling framework.
- **Shadcn UI**: Accessibly designed and beautifully themed components.
- **Framer Motion**: Smooth fluid layouts and page transitions.
- **Recharts**: Modular SVG charts for browser, device, and timeline clicks.

### ⚙️ Backend
- **Node.js**: Asynchronous event-driven JavaScript runtime environment.
- **Express.js**: Lightweight routing engine and HTTP utility middleware container.
- **JWT (JSON Web Tokens)**: Stateful tokenized authentication header handler.
- **Nodemailer**: Engine for triggering verification emails and reset links.

### 🗄️ Database
- **MongoDB Atlas**: Fully-managed cloud-native NoSQL document database.

### 🚀 Deployment
- **Vercel**: Serverless hosting platform for the React frontend application.
- **Railway**: Cloud platform for hosting the Node.js/Express backend server.

---

## ✨ Features

### 🔐 Authentication
- **Email & Password Login**: Secure registration and login flow with client-side verification.
- **Google Sign-In (OAuth)**: Seamless one-click authentication.
- **Email Verification**: Automatic account lock until email address ownership is verified.
- **Forgot Password**: Password recovery mechanism with signed temporary token emails.
- **Protected Routes**: Custom authentication middleware blocking unauthorized dashboard/analytics entry.

### 🔗 URL Shortening
- **Short URL Generation**: Instantly maps deep links to unique, short slugs.
- **Custom Aliases**: User-configured short slugs (e.g. `shrinklq.com/promo`).
- **Edit Destination URLs**: Dynamically swap target addresses without altering the short URL.
- **Delete URLs**: Instantly remove short URLs and associated redirection rules.
- **Copy Short URL**: One-click quick clipboard sharing.

### 📊 Analytics
- **Click Tracking**: High-performance counters tracking every visit event.
- **Browser Analytics**: Beautiful radial charts mapping Chrome, Firefox, Safari, and Edge.
- **Device Analytics**: Displays desktop, tablet, and mobile traffic percentages.
- **Recent Visit History**: Detail log featuring visitor IP, browser type, and timestamps.
- **Interactive Charts**: Responsive line graphs charting engagement over a daily timeline.

### 📱 QR Code
- **Auto-Generate QR**: Instantly generates clean vector-based QR codes matching short URLs.
- **Download QR**: Export codes directly to local disk for print or digital marketing.

### 📦 Bulk URL Shortening
- **CSV Upload**: Import lists of long URLs and optional aliases in a single batch.
- **Batch Generation**: Highly efficient parallel processing of multiple shorten requests.
- **Export Results**: Instantly download compiled maps of original and shortened URLs.

### 🛡️ Security
- **Password Hashing**: Industry-grade hashing of user credentials using `bcryptjs`.
- **JWT Token verification**: Secure request signing for user resource separation.
- **Verification Lock**: Secure route blocks against unverified users.

### 📱 Responsive Design
- **Desktop, Tablet, & Mobile**: Fluid layouts adapting to all viewports.

---

## 📁 Folder Structure

```
katomaran/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database connection config
│   │   ├── controllers/
│   │   │   ├── analyticsController.js # Analytics retrieval logic
│   │   │   ├── authController.js     # Auth & profiles controller
│   │   │   └── urlController.js      # URL shortening & redirection
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT token validation
│   │   ├── models/
│   │   │   ├── User.js               # User MongoDB schema
│   │   │   ├── Url.js                # URL MongoDB schema
│   │   │   └── Visit.js              # Visits tracking schema
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.js    # Analytics routes
│   │   │   ├── authRoutes.js         # Authentication routes
│   │   │   └── urlRoutes.js          # URL operational routes
│   │   ├── utils/
│   │   │   ├── emailVerifier.js      # Email verification helper
│   │   │   ├── mailer.js             # Nodemailer config & email templates
│   │   │   └── userAgent.js          # User Agent parser
│   │   └── server.js                 # Entrypoint server execution script
│   ├── package.json                  # Backend manifest
│   └── .env.example                  # Environment configuration template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # Button, Input, Card (Shadcn elements)
│   │   │   ├── BulkShortener.jsx     # Bulk processing component
│   │   │   ├── DashboardLayout.jsx   # Sidebar & Header wrapper
│   │   │   ├── Footer.jsx            # Copyright and links footer
│   │   │   ├── Loader.jsx            # Loading page fallback
│   │   │   ├── Navbar.jsx            # Landing page navigation
│   │   │   ├── ProtectedRoute.jsx    # Session routing validator
│   │   │   └── UrlCard.jsx           # Individual URL action panel
│   │   ├── lib/
│   │   │   └── utils.js              # Tailind merge utility
│   │   ├── pages/
│   │   │   ├── Analytics.jsx         # Detailed analytics page
│   │   │   ├── Dashboard.jsx         # Primary URL manager page
│   │   │   ├── ForgotPassword.jsx    # Password recovery initiator
│   │   │   ├── Landing.jsx           # Homepage marketing landing
│   │   │   ├── Login.jsx             # Credentials login portal
│   │   │   ├── Profile.jsx           # User settings profile portal
│   │   │   ├── ResetPassword.jsx     # Credentials modification
│   │   │   ├── Signup.jsx            # Account registration portal
│   │   │   └── VerifyEmail.jsx       # Validation status page
│   │   ├── services/
│   │   │   └── api.js                # Axios instance configuration
│   │   ├── App.jsx                   # Component router initialization
│   │   ├── main.jsx                  # Virtual DOM root mounter
│   │   └── index.css                 # Custom global stylesheets
│   ├── index.html                    # Single Page Application container
│   ├── vite.config.js                # Vite build config
│   ├── tailwind.config.js            # Tailwind layout presets
│   └── package.json                  # Frontend manifest
└── README.md
```

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    User([User Client]) <-->|HTTPS / UI| FE[React Frontend]
    FE <-->|REST API Calls / JWT| BE[Express Backend]
    BE <-->|Mongoose queries| DB[(MongoDB Atlas Database)]
    BE -->|SMTP Email Dispatch| ES[Nodemailer Email Service]
    FE <-->|OAuth verification| GAuth[Google Identity Service]
    BE <-->|Token token validation| GAuth
```

---

## 📸 Screenshots Section

### 🖥️ Landing Page
![Landing Page](./screenshots/Screenshot_2026-06-13_230827.png)

### 👤 Signup Page
![Signup Page](./screenshots/Screenshot_2026-06-13_230910.png)

### 🔑 Login Page
![Login Page](./screenshots/Screenshot_2026-06-13_230853.png)

### 📊 Dashboard
![Dashboard](./screenshots/Screenshot_2026-06-13_230939.png)

### 📂 Bulk URL Shortener
![Bulk URL Shortener](./screenshots/Screenshot_2026-06-13_230958.png)

### 📱 QR Code Feature
![QR Code Feature](./screenshots/Screenshot_2026-06-13_231028.png)

### 📈 Analytics Page
![Analytics Page](./screenshots/Screenshot_2026-06-13_231042.png)

### 🎨 Profile Page
![Profile Page](./screenshots/Screenshot_2026-06-13_231101.png)


---


## 🎥 Demo Video
![video] (https://youtu.be/ULJAaCCjErU?si=fQKIwQGi_FF_t4Oo)
---


## 🔌 API Endpoints

### 🔐 Authentication APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user account | No |
| **POST** | `/api/auth/login` | Log in with email and password | No |
| **GET** | `/api/auth/verify/:token` | Verify user account email | No |
| **POST** | `/api/auth/resend-verification` | Request a new verification token | No |
| **POST** | `/api/auth/google-login` | Authenticate or register via Google Sign-In | No |
| **POST** | `/api/auth/forgot-password` | Request password reset token | No |
| **POST** | `/api/auth/reset-password` | Complete password reset procedure | No |
| **GET** | `/api/auth/profile` | Get user credentials profile details | **Yes (JWT)** |

### 🔗 URL APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/url/create` | Shorten a single destination URL | **Yes (JWT)** |
| **GET** | `/api/url/all` | Retrieve all shortened URLs created by user | **Yes (JWT)** |
| **PUT** | `/api/url/:id` | Update target destination URL address | **Yes (JWT)** |
| **DELETE** | `/api/url/:id` | Remove short URL and its analytics data | **Yes (JWT)** |
| **POST** | `/api/url/bulk` | Shorten list of URLs in bulk via batch upload | **Yes (JWT)** |
| **GET** | `/:shortCode` | Redirect a short URL to its original address | No |

### 📊 Analytics APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/analytics/:id` | Fetch click stats, browser & device data | **Yes (JWT)** |
| **GET** | `/stats/:shortCode` | Get public link counters for quick previews | No |

---

## 🔐 Environment Variables

### 🎨 Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### ⚙️ Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shrinklq?retryWrites=true&w=majority
JWT_SECRET=your_jwt_signing_secret_key
GOOGLE_CLIENT_ID=your_google_client_id_here
EMAIL_USER=your_smtp_sender_email_here@gmail.com
EMAIL_PASS=your_app_specific_email_password
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

---

## 🛠️ Setup Instructions

### ⚙️ Backend Setup
1. **Navigate to the Backend Directory:**
   ```bash
   cd backend
   ```
2. **Install Required Node Modules:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and populate it with your local configuration details.
4. **Boot Up Backend Server:**
   ```bash
   npm start
   ```
   The backend server will spin up, connecting to MongoDB Atlas, listening on `http://localhost:5000`.

---

### 🎨 Frontend Setup
1. **Navigate to the Frontend Directory:**
   ```bash
   cd ../frontend
   ```
2. **Install Web Application Packages:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Fill in the `VITE_API_URL` connecting to your running backend API.
4. **Boot Up Development Server:**
   ```bash
   npm run dev
   ```
   Open the local URL displayed (default: `http://localhost:5173`) in your browser.

---

### 🗄️ MongoDB Atlas Setup
1. Head over to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free tier database.
2. Build a new database cluster and create a database user with read/write database permissions.
3. Whitelist access from any location (`0.0.0.0/0`) under Network Access settings.
4. Obtain the connection string under cluster connection options (choose Node.js application driver).
5. Paste this connection string into your backend `.env` file as `MONGO_URI`.

---

### 🌐 Google OAuth Setup
1. Head over to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Configure the **OAuth Consent Screen** for your application.
4. Go to **Credentials**, click **Create Credentials**, and choose **OAuth Client ID** (select *Web Application*).
5. Add Authorized JavaScript origins: `http://localhost:5173` (development) and your production frontend URL.
6. Add Authorized Redirect URIs: `http://localhost:5000` (development) and your backend routing base URL.
7. Save the configuration and copy your generated **Client ID** to your backend/frontend `.env` files.

---

### 📧 Email Configuration
1. Register/Sign in to the email provider you intend to send verifications from (e.g. Gmail).
2. For Gmail, enable two-factor authentication (2FA) inside Google Account settings.
3. Navigate to **App Passwords** settings under your account dashboard and generate a new password key for mail.
4. Save the generated 16-character application password.
5. Populate `EMAIL_USER` with your email and `EMAIL_PASS` with this generated app password key in `backend/.env`.

---

## 📝 Assumptions Made

1. **Client-side User Agents Parsing**: Visitor browser and device classification are parsed on demand during redirection by evaluating the browser User-Agent request header inside backend redirect routers.
2. **Database Redirection Performance**: Redirection lookups search primarily by Indexed shortCode queries in MongoDB, ensuring rapid URL mappings.
3. **Email Verification Requirement**: Verification locks prevent newly registered users from generating links until validation triggers, mitigating abuse.
4. **Local Host Redirects fallback**: Custom short links fall back onto the local base server host namespace unless custom domains are set up.

---

## 🔮 Future Enhancements

- **Real-Time Analytics**: Visualizing incoming client views via secure WebSockets feeds.
- **Team Collaboration**: Allowing multiple organization members to manage links and view shared analytics.
- **Link Expiration Notifications**: Dispatching automatic warning emails when custom campaign links are about to expire.
- **Advanced Geolocation Analytics**: Deeper map representations illustrating city and state visitor origins.
- **Custom Domains**: Enabling enterprise consumers to route short URLs through their own top-level domain.

---


## 📦 Sample Database Entries

### 👤 User Document
```json
{
  "_id": "603d7b88939c3e449830501a",
  "name": "Nithish Parameswaran",
  "email": "nithish@example.com",
  "password": "$2a$10$Uv0pXw3yVn9C7qKzDq1eOuO8/G/rBw4E6m7v6L5x1e3Q8.J7V1/Ke",
  "isVerified": true,
  "verificationToken": null,
  "createdAt": "2026-06-13T10:00:00.000Z",
  "updatedAt": "2026-06-13T10:05:00.000Z",
  "__v": 0
}
```

### 🔗 URL Document
```json
{
  "_id": "603d7bc0939c3e449830501b",
  "userId": "603d7b88939c3e449830501a",
  "originalUrl": "https://www.google-antigravity.com/deepmind/research/paper/extremely-long-url-format",
  "shortCode": "aB3dE",
  "customAlias": "deepmind-paper",
  "clickCount": 234,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJY...",
  "expiryDate": "2026-12-31T23:59:59.000Z",
  "createdAt": "2026-06-13T10:10:00.000Z",
  "__v": 0
}
```

### 📊 Visit Document
```json
{
  "_id": "603d7c5a939c3e449830501c",
  "urlId": "603d7bc0939c3e449830501b",
  "ipAddress": "192.168.1.101",
  "browser": "Chrome",
  "device": "Desktop",
  "visitedAt": "2026-06-13T12:34:56.000Z",
  "__v": 0
}
```

---

## 🪵 Sample Logs

### 📥 Request Log
```http
POST /api/url/create HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "originalUrl": "https://react.dev/reference/react",
  "customAlias": "react-ref",
  "expiryDate": "2026-08-30"
}
```

### 📤 Response Log
```http
HTTP/1.1 201 Created
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "success": true,
  "message": "URL shortened successfully",
  "data": {
    "id": "603d7bc0939c3e449830501b",
    "originalUrl": "https://react.dev/reference/react",
    "shortUrl": "http://localhost:5000/react-ref",
    "shortCode": "xY9zR",
    "customAlias": "react-ref",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "expiryDate": "2026-08-30T00:00:00.000Z"
  }
}
```

---

## 🚀 Deployment

- **Frontend Application**: Deployed to [Vercel](https://vercel.com) for production performance.
- **Backend APIs Service**: Hosted on [Railway](https://railway.app) connected to source pipeline triggers.
- **Cloud Database**: Managed and stored securely on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

## 👨‍💻 Author

- **Name**: Nithish Parameswaran
- **Role**: AI & Data Science Student

---

## 🤝 Acknowledgements

- **React**: Frontend UI components rendering library.
- **Express**: Node JS routing engine and service API structure.
- **MongoDB**: Highly scalable document database.
- **Tailwind CSS**: Core utility-first layout styling.
- **Shadcn UI**: Seamless interactive UI components.
- **Recharts**: Beautiful interactive click charting.

---

This project is a part of a hackathon run by https://katomaran.com
