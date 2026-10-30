# ExpenseWise (Frontend)

A web application for personal finance: track expenses, manage savings goals and convert amounts between currencies.

**Live demo:** https://expensewise-frontend.vercel.app/

**Backend (Flask API):** https://github.com/alndbn/expensewise-backend

## Features
- Sign up and log in with JWT authentication
- Create, edit and delete expenses
- Manage savings goals
- Custom categories per user
- Multiple currencies with conversion via an external exchange rate API
- Protected pages with React Router

## Tech stack
- Frontend: React, Vite, React Router, GSAP
- Backend: Flask, SQLAlchemy, PostgreSQL (Neon)
- Deployment: Vercel (frontend), Render (backend)

## Note
The backend runs on Render's free tier, so the first request can take a few seconds.
