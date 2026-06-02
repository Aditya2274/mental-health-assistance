# ThoughtCare
Mental Health Assistance Web Application

Frontend (Vercel): https://thoughtcare.vercel.app  
Backend (Render): Deployed on Render

---

## About the Project

ThoughtCare is a full-stack mental health assistance web application designed to provide a secure and supportive digital environment for users. The platform combines traditional authentication with Google OAuth and uses Redis for session and authentication control to ensure performance, scalability, and security.

The application follows a decoupled architecture where the frontend and backend are deployed independently for better scalability and maintainability.

---

## Key Features

- Manual user authentication (Email and Password)
- Google OAuth 2.0 authentication
- Secure session management using Redis
- Role-based access control (if applicable)
- RESTful backend APIs
- Responsive and user-friendly frontend
- Production-ready deployment

---

## Technology Stack

### Frontend
- React (JavaScript)
- HTML, CSS
- Axios / Fetch for API communication
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- REST API architecture
- Deployed on Render

### Database and Caching
- MongoDB — primary database for persistent storage
- Redis — authentication and session control

### Authentication
- Manual login (email and password)
- Google OAuth 2.0
- JWT with Redis-based session handling

---

## System Architecture

User  
↓  
React Frontend (Vercel)  
↓ HTTPS (REST APIs)  
Node.js Backend (Render)  
↓  
MongoDB (Persistent Data)  
↓  
Redis (Authentication and Sessions)

---

## Getting Started (Local Setup)

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google OAuth credentials

---

## Environment Variables

### Backend (.env)

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
REDIS_URL=your_redis_connection_url  
GOOGLE_CLIENT_ID=your_google_client_id  
GOOGLE_CLIENT_SECRET=your_google_client_secret  
GOOGLE_CALLBACK_URL=your_google_callback_url  
FRONTEND_URL=http://localhost:3000

---

### Frontend (.env)

REACT_APP_API_BASE_URL=http://localhost:5000  
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

---

## Running the Project Locally

### Backend

cd backend  
npm install  
npm start  

Backend runs on http://localhost:5000

---

### Frontend

cd frontend  
npm install  
npm start  

Frontend runs on http://localhost:3000

---

## Authentication Flow

### Manual Login

1. User submits email and password  
2. Backend validates credentials  
3. JWT is issued and session is tracked using Redis  
4. User gains access to protected routes  

### Google Authentication

1. User logs in using Google  
2. Google OAuth callback is handled by the backend  
3. User record is created or updated in MongoDB  
4. Session is managed using Redis  

Redis enables fast session validation, logout handling, and token invalidation.

---

## Folder Structure

mental-health-assistance/

backend/  
controllers/  
routes/  
models/  
config/  
middleware/  
server.js  

frontend/  
src/  
public/  
package.json  

.gitignore  
README.md

---

## Deployment

### Frontend (Vercel)

- Automatically deployed from GitHub
- Environment variables configured in the Vercel dashboard

### Backend (Render)

- Node.js web service
- Environment variables managed via Render dashboard
- MongoDB and Redis connected using cloud services

---

## Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit changes with clear messages  
4. Open a pull request  
