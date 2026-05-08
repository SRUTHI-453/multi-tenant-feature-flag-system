# Feature Flag Management System

Multi-tenant feature flag system — Node.js + Express backend, MongoDB (Mongoose), three plain HTML frontends.

---

## Project Structure

```
feature-flags/
├── backend/
│   ├── server.js               # Express entry point
│   ├── config.js               # JWT, super admin creds, port
│   ├── .env                    # Environment variables (edit this!)
│   ├── db/
│   │   └── connect.js          # MongoDB connection
│   ├── models/
│   │   ├── Organization.js     # Org schema
│   │   ├── User.js             # User schema (org_admin role)
│   │   └── FeatureFlag.js      # Flag schema (unique per org)
│   ├── middleware/
│   │   └── auth.js             # JWT verify + role guard
│   └── routes/
│       ├── superAdmin.js       # /api/super-admin/*
│       ├── admin.js            # /api/admin/*
│       └── flags.js            # /api/flags/* (public)
└── frontend/
    ├── super-admin/index.html
    ├── admin/index.html
    └── user/index.html
```

---

## MongoDB Setup (Atlas — Free Tier)

1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a free **M0 cluster**
3. Under **Database Access** → Add a database user (username + password)
4. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all, for dev)
5. Click **Connect** → **Drivers** → copy the connection string
6. Paste it in `backend/.env`:

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/feature_flags?retryWrites=true&w=majority
```

### Local MongoDB (alternative)
```env
MONGO_URI=mongodb://localhost:27017/feature_flags
```

---

## Quick Start

```bash
cd backend
npm install
# Edit .env with your MONGO_URI first!
node server.js
```

Open:
| App          | URL                               |
|--------------|-----------------------------------|
| End User     | http://localhost:3000/user        |
| Org Admin    | http://localhost:3000/admin       |
| Super Admin  | http://localhost:3000/super-admin |

---

## Super Admin Credentials

| Field    | Value                   |
|----------|-------------------------|
| Email    | `superadmin@flagsys.io` |
| Password | `Admin@1234`            |

---

## API Reference

### Super Admin (`/api/super-admin`)
| Method | Path              | Auth         | Description        |
|--------|-------------------|--------------|--------------------|
| POST   | `/login`          | None         | Login              |
| POST   | `/organizations`  | super_admin  | Create org         |
| GET    | `/organizations`  | super_admin  | List all orgs      |

### Org Admin (`/api/admin`)
| Method | Path          | Auth      | Description     |
|--------|---------------|-----------|-----------------|
| POST   | `/signup`     | None      | Register admin  |
| POST   | `/login`      | None      | Login           |
| GET    | `/flags`      | org_admin | List flags      |
| POST   | `/flags`      | org_admin | Create flag     |
| PATCH  | `/flags/:id`  | org_admin | Update flag     |
| DELETE | `/flags/:id`  | org_admin | Delete flag     |

### Public (`/api/flags`)
| Method | Path                                             | Auth | Description        |
|--------|--------------------------------------------------|------|--------------------|
| GET    | `/check?organizationId=...&featureKey=...`       | None | Check flag status  |
| GET    | `/organizations`                                 | None | List orgs for UI   |

---

## Data Models

### Organization
```js
{ name: String (unique), createdAt, updatedAt }
```

### User
```js
{ email: String (unique), passwordHash: String, role: "org_admin", organization: ObjectId → Organization }
```

### FeatureFlag
```js
{ featureKey: String, enabled: Boolean, organization: ObjectId → Organization, createdBy: ObjectId → User }
// Compound unique index: { featureKey, organization }
```

---

## Design Decisions & Trade-offs

| Decision | Reasoning |
|---|---|
| **MongoDB / Mongoose** | Schema flexibility, easy to run free on Atlas, natural JSON fit for flag data |
| **JSON file → MongoDB** | Replaces the dev-only JSON file with real persistent NoSQL storage |
| **Custom JWT auth** | Per spec — no third-party providers. bcrypt for password hashing, 8h token expiry |
| **Static super admin creds** | Per spec — stored in `.env`, not in DB |
| **Public flag-check endpoint** | Spec asks for a simple form experience; no end-user login required |
| **Compound unique index on flags** | Prevents duplicate `featureKey` per org at the DB level, not just app level |
| **passwordHash excluded from toJSON** | `User.toJSON()` strips the hash — never accidentally returned in API responses |

---

## Self-grading

| Category                      | Score | Notes |
|-------------------------------|-------|-------|
| Performance                   | 7/10  | Indexed queries, no N+1 issues; no caching layer |
| Readability & Maintainability | 8/10  | Clear separation: models / routes / middleware |
| Stability                     | 7/10  | Input validation, proper HTTP codes, error handler; no rate limiting |
| Testability                   | 8/10  | Thin routes, logic in models — easy to unit test with `jest` + `mongodb-memory-server` |
