# Student Authentication System

A MERN stack project that allows students to register, log in, access a protected dashboard, update their password, change course details, and log out securely.

## Features

- Student registration with duplicate email protection
- JWT-based login authentication
- Protected dashboard route
- Password update with old password verification
- Course update for logged-in students
- Axios-powered API integration
- Responsive UI with custom CSS
- Deployment-ready Render and Vercel configuration

## Project Structure

```text
MSE 2 DEMO/
|-- backend/
|-- frontend/
|-- render.yaml
`-- README.md
```

## Backend Setup

1. Open `backend/.env.example` and create a new `.env` file from it.
2. Add your MongoDB connection string and JWT secret.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the backend:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

## Frontend Setup

1. Open `frontend/.env.example` and create a new `.env` file from it.
2. Set `VITE_API_URL=http://localhost:5000/api`.
3. Install dependencies:

```bash
cd frontend
npm install
```

4. Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Available API Endpoints

- `POST /api/register`
- `POST /api/login`
- `GET /api/profile`
- `PUT /api/update-password`
- `PUT /api/update-course`

## Deployment

### Render

- Use the included `render.yaml` file to create the backend and static frontend services.
- Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `VITE_API_URL` in Render.

### Vercel

- Deploy the `frontend` folder to Vercel.
- Set `VITE_API_URL` to your deployed backend API URL.
- The included `frontend/vercel.json` keeps React routes working after refresh.
