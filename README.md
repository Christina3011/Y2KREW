# Y2KREW — starter project

A basic full-stack starter for a nostalgic social networking platform.

## Requirements
- Node.js (LTS)
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup
1. Open this folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your MongoDB connection string and a private JWT secret to `.env`.
5. Run `npm run dev` (or `npm start`).
6. Open `http://localhost:5000`.

The Express server serves the frontend and exposes API routes under `/api`.

## Included
- Responsive landing/dashboard starter UI
- Registration and login API (password hashing + JWT)
- Basic post, board and time-capsule API structure
- Mongoose models
- Authentication middleware
- Account-specific profile customisation, including seven wallpapers, image uploads, accents, bio, music, interests and stickers
- Live profile preview with save and reset controls

## Important
This is a foundation, not a production-ready social network. Add input validation, authorization checks, rate limiting, secure upload handling, error handling and tests before deployment. The current UI uses demo content; connect it to the API as you implement each feature. Chat, friend requests, comments, notifications and real-time updates are planned extensions.

## Team split suggestion
- Member 1: authentication, profiles and posts
- Member 2: friends, messages and moodboards
- Member 3: time capsules, notifications and integration

## API starter endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/profile/me` (requires a login token)
- `PATCH /api/profile/me` (requires a login token; saves only the current user's profile)
- `GET /api/posts`
- `POST /api/posts` (requires Bearer token)
- `GET /api/boards`
- `POST /api/boards` (requires Bearer token)
- `GET /api/capsules` (requires Bearer token)
- `POST /api/capsules` (requires Bearer token)

Time capsule content should only be returned after its unlock date. The starter route filters locked capsules from the response.
