# TechFario Full-Stack Website

Modern dark SaaS-style frontend with a Node.js, Express, MongoDB, JWT, and Nodemailer backend.

## Live GitHub Pages Frontend

GitHub Pages publishes from the repository root, so the production static files are mirrored at the root:

- `index.html`
- `admin.html`
- `styles.css`
- `admin.css`
- `main.js`
- `admin.js`
- `site-config.js`

Live frontend:

```text
https://waleedchowdhury.github.io/TechFario/
```

GitHub Pages is static hosting only. It cannot run the Node.js backend. For a fully live production site,
deploy `backend/` to a Node host such as Render, Railway, Fly.io, or a VPS, use MongoDB Atlas, then set the
hosted API URL in `site-config.js`:

```js
window.TECHFARIO_CONFIG = {
  apiBaseUrl: 'https://your-backend-url.example.com'
};
```

The backend CORS configuration already allows the GitHub Pages origin and can also read comma-separated
production origins from `FRONTEND_URLS`.

## Folder Structure

```text
.
├── backend
│   ├── package.json
│   ├── .env.example
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── config
│       ├── middleware
│       ├── models
│       ├── routes
│       ├── scripts
│       └── utils
├── frontend
│   ├── index.html
│   ├── admin.html
│   ├── styles.css
│   ├── admin.css
│   ├── main.js
│   └── admin.js
├── package.json
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- SMTP credentials for the newsletter bulk email feature

## Setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agency_site
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URLS=https://waleedchowdhury.github.io,http://localhost:5000,http://localhost:4173
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM="Agency Team <hello@example.com>"
```

Create the first admin:

```bash
npm run seed:admin
```

Start the app:

```bash
npm start
```

Open:

- Public site: `http://localhost:5000`
- Admin panel: `http://localhost:5000/admin.html`

If MongoDB is not running yet and you only want to preview the static frontend:

```bash
npm run preview:frontend
```

Then open `http://localhost:4173`. Dynamic sections use graceful fallback content until the API is available.

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/team`
- `POST /api/team`
- `PUT /api/team/:id`
- `DELETE /api/team/:id`
- `GET /api/reviews`
- `GET /api/reviews/admin`
- `POST /api/reviews`
- `PUT /api/reviews/:id/verify`
- `DELETE /api/reviews/:id`
- `POST /api/newsletter/subscribe`
- `GET /api/newsletter/subscribers`
- `POST /api/newsletter/send-email`
- `POST /api/contact`
- `GET /api/admin/stats`

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```
