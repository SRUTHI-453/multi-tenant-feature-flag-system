# Feature Flag Management System

A multi-tenant SaaS-like Feature Flag Management System built using Node.js, Express, MongoDB Atlas, and plain HTML/CSS/JavaScript.

The system supports:

- Super Admin management
- Organization-based feature flag management
- Public feature flag validation for end users

---

# 🚀 Live Deployment

## 🌐 Live URLs

| Application | Live URL |
|---|---|
| Main Application | https://multi-tenant-feature-flag-system.onrender.com |
| Super Admin | https://multi-tenant-feature-flag-system.onrender.com/super-admin |
| Org Admin | https://multi-tenant-feature-flag-system.onrender.com/admin |
| End User | https://multi-tenant-feature-flag-system.onrender.com/user |

---

# 📦 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT + bcryptjs |
| Frontend | HTML + CSS + JavaScript |
| Deployment | Render |

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/feature-flags.git
cd feature-flags
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Start Server

```bash
node server.js
```

Server runs on:

```bash
http://localhost:3000
```

---

# 🔐 Login Credentials

## 1. Super Admin

| Field | Value |
|---|---|
| URL | https://multi-tenant-feature-flag-system.onrender.com/super-admin |
| Email | superadmin@flagsys.io |
| Password | Admin@1234 |

> Super Admin credentials are hardcoded as per assignment requirements.

---

## 2. Org Admin

| Field | Value |
|---|---|
| URL | https://multi-tenant-feature-flag-system.onrender.com/admin |
| Email | alice@acme.com |
| Password | pass123 |

> Org Admins can also register through the Signup page.

---

## 3. End User

| Field | Value |
|---|---|
| URL | https://multi-tenant-feature-flag-system.onrender.com/user |
| Login Required | No |

> End users can directly check feature availability without authentication.

---

# 🏗️ Application Architecture

The project contains:

- 1 Node.js backend
- 3 separate frontend applications

---

# 📁 Project Structure

```bash
feature-flags/
│
├── backend/
│   ├── server.js
│   ├── config.js
│   ├── package.json
│   │
│   ├── db/
│   │   ├── connect.js
│   │   └── database.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Organization.js
│   │   ├── User.js
│   │   └── FeatureFlag.js
│   │
│   └── routes/
│       ├── superAdmin.js
│       ├── admin.js
│       └── flags.js
│
└── frontend/
    ├── super-admin/
    │   └── index.html
    │
    ├── admin/
    │   └── index.html
    │
    └── user/
        └── index.html
```

---

# 👥 Roles & Permissions

## 1. Super Admin

Capabilities:

- Login using static credentials
- Create organizations
- View all organizations

---

## 2. Organization Admin

Capabilities:

- Sign up
- Login
- Create feature flags
- Enable / Disable feature flags
- Delete feature flags
- Manage organization-specific flags

---

## 3. End User

Capabilities:

- Select organization
- Enter feature key
- Check whether feature is enabled or disabled

---

# 🔑 Authentication Flow

## Super Admin Authentication

- Uses static credentials from `config.js`
- JWT token generated after login

---

## Org Admin Authentication

- Password hashed using bcryptjs
- JWT token generated after login
- Role stored as `org_admin`

---

## End User

- No authentication required
- Public read-only endpoint

---

# 🗄️ MongoDB Atlas Configuration

## Database Details

| Field | Value |
|---|---|
| Database | feature_flags |
| Cluster | cluster0.rnsiukt.mongodb.net |

---

## MongoDB Connection

```js
mongoose.connect(process.env.MONGO_URI);
```

---

# 📡 API Documentation

# Super Admin APIs

Base URL:

```bash
/api/super-admin
```

---

## Login

### Endpoint

```http
POST /api/super-admin/login
```

### Request Body

```json
{
  "email": "superadmin@flagsys.io",
  "password": "Admin@1234"
}
```

### Response

```json
{
  "token": "JWT_TOKEN",
  "role": "super_admin",
  "email": "superadmin@flagsys.io"
}
```

---

## Create Organization

### Endpoint

```http
POST /api/super-admin/organizations
```

### Headers

```http
Authorization: Bearer TOKEN
```

### Request Body

```json
{
  "name": "Acme Corp"
}
```

---

## Get Organizations

### Endpoint

```http
GET /api/super-admin/organizations
```

### Headers

```http
Authorization: Bearer TOKEN
```

---

# Org Admin APIs

Base URL:

```bash
/api/admin
```

---

## Signup

### Endpoint

```http
POST /api/admin/signup
```

### Request Body

```json
{
  "email": "admin@acme.com",
  "password": "pass123",
  "organizationId": "ORG_ID"
}
```

---

## Login

### Endpoint

```http
POST /api/admin/login
```

### Request Body

```json
{
  "email": "admin@acme.com",
  "password": "pass123"
}
```

---

## Get Feature Flags

### Endpoint

```http
GET /api/admin/flags
```

### Headers

```http
Authorization: Bearer TOKEN
```

---

## Create Feature Flag

### Endpoint

```http
POST /api/admin/flags
```

### Headers

```http
Authorization: Bearer TOKEN
```

### Request Body

```json
{
  "featureKey": "dark_mode",
  "enabled": true
}
```

---

## Update Feature Flag

### Endpoint

```http
PATCH /api/admin/flags/:id
```

### Request Body

```json
{
  "enabled": false
}
```

---

## Delete Feature Flag

### Endpoint

```http
DELETE /api/admin/flags/:id
```

---

# Public APIs

Base URL:

```bash
/api/flags
```

---

## Check Feature Status

### Endpoint

```http
GET /api/flags/check
```

### Query Params

```bash
organizationId=ORG_ID
featureKey=dark_mode
```

### Example

```bash
/api/flags/check?organizationId=123&featureKey=dark_mode
```

### Response

```json
{
  "organizationId": "123",
  "organizationName": "Acme Corp",
  "featureKey": "dark_mode",
  "enabled": true,
  "exists": true
}
```

---

## Get Organizations

### Endpoint

```http
GET /api/flags/organizations
```

---

# 🧠 Database Models

# Organization Model

```js
{
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

# User Model

```js
{
  email: String,
  passwordHash: String,
  role: "org_admin",
  organization: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

# Feature Flag Model

```js
{
  featureKey: String,
  enabled: Boolean,
  organization: ObjectId,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

# 🔒 Security Features

- JWT Authentication
- Password hashing using bcryptjs
- Role-based authorization
- Organization-level data isolation
- Protected admin APIs
- MongoDB schema validation

---

# ✨ Key Features

- Multi-tenant architecture
- Role-based access control
- Public feature validation
- Responsive UI
- Persistent MongoDB storage
- Feature toggle management
- Organization isolation
- RESTful API design

---

# 🎯 Feature Flag Flow

## Step 1

Super Admin creates organization

↓

## Step 2

Org Admin signs up using organization

↓

## Step 3

Org Admin logs in

↓

## Step 4

Org Admin creates feature flags

↓

## Step 5

End User checks whether feature is enabled

---

# 📌 Design Decisions

| Decision | Reason |
|---|---|
| MongoDB Atlas | Easy cloud deployment |
| Plain HTML/CSS/JS | Lightweight frontend |
| JWT Authentication | Custom auth per assignment |
| Static Super Admin | Assignment requirement |
| Public User API | Simple feature validation |
| Organization-scoped flags | Multi-tenant isolation |


# 👩‍💻 Developed By

Sruthi R
