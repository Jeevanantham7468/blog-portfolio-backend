# Blog Portfolio — Backend API

Node.js + Express + MongoDB (Mongoose) REST API for the Blog Portfolio app.
Blog write operations are protected by **Firebase Authentication** (ID-token
verification).

## Tech stack

- Node.js / Express
- MongoDB with Mongoose
- Firebase Admin-less token verification (Google Identity Toolkit)
- CORS + dotenv

## Getting started

```bash
npm install
```

Create a `.env` file (copy `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/blogDB?retryWrites=true&w=majority
FIREBASE_API_KEY=your_firebase_web_api_key
```

Run:

```bash
npm start        # production
npm run dev      # auto-restart on change (Node --watch)
```

Expected output:

```
Server running on port 5000
MongoDB connected: blogDB
```

The `blogDB` database and `blogs` collection are created automatically on the
first insert.

## API

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/blogs` | Public | List all blogs (newest first) |
| GET | `/api/blogs/:id` | Public | Get one blog |
| PATCH | `/api/blogs/like/:id` | Public | Increment likes |
| POST | `/api/blogs` | Bearer token | Create a blog |
| PUT | `/api/blogs/:id` | Bearer token | Update a blog |
| DELETE | `/api/blogs/:id` | Bearer token | Delete a blog |

Protected routes expect `Authorization: Bearer <firebase-id-token>`. The token
is verified against Google's Identity Toolkit using `FIREBASE_API_KEY`.

## Project structure

```
index.js              # Express app + MongoDB connection
models/Blog.js        # Mongoose schema/model
routes/blogs.js       # CRUD + like routes
middleware/auth.js    # Firebase ID-token verification
```
