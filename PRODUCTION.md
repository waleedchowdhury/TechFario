# TechFario Production Setup

The frontend is live on GitHub Pages:

```text
https://waleedchowdhury.github.io/TechFario/
```

GitHub Pages cannot run the Node.js backend. To make forms, admin login, projects, team, reviews, and newsletter
work for real users, deploy `backend/` to a Node host and connect MongoDB Atlas.

## Recommended Backend Path

1. Create a MongoDB Atlas cluster.
2. Copy the Atlas connection string.
3. Deploy this repo to Render using `render.yaml`.
4. Set `MONGO_URI` in Render to the Atlas connection string.
5. Set SMTP values in Render for newsletter email sending.
6. After Render gives you a backend URL, update both `site-config.js` and `frontend/site-config.js`:

```js
window.TECHFARIO_CONFIG = {
  apiBaseUrl: 'https://your-render-service.onrender.com'
};
```

7. Run `npm run sync:pages`.
8. Commit and push the updated `site-config.js` files.

## Local Full-Stack URL

When MongoDB and the backend are running locally:

```text
http://localhost:5000
```

## Common Render Deploy Failure

If Render says the deploy failed, check the service logs. The most common causes are:

- `MONGO_URI is required`: the Render environment variable is empty.
- `ECONNREFUSED 127.0.0.1:27017`: the value points to local MongoDB, which does not exist inside Render.
- `querySrv ENOTFOUND` or authentication errors: the Atlas URI, username, password, or cluster host is wrong.
- Server selection timeout: Atlas Network Access does not allow the Render service to connect.

Use a MongoDB Atlas URI, not a localhost URI:

```text
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/techfario?retryWrites=true&w=majority
```
