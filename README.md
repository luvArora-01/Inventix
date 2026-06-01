# Inventix

Track Smarter. Manage Better.

Inventix is a full-stack Inventory & Order Management System built for a Software Engineer Technical Assessment. It provides product management, customer management, order creation, inventory deduction, order cancellation, and dashboard statistics through a clean React frontend and FastAPI backend.

## Features

- Product CRUD with unique SKU validation
- Customer create/list/detail/delete with unique email validation
- Order creation with multiple products
- Automatic backend-calculated order totals
- Inventory deduction when orders are created
- Inventory restoration when orders are cancelled
- Low-stock dashboard reporting for products below 10 units
- Responsive React interface with sidebar navigation, forms, tables, loading states, and alerts
- Docker Compose setup for frontend, backend, and PostgreSQL

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy
- Frontend: React JavaScript, React Router, Axios, CSS Modules
- Database: PostgreSQL
- Containerization: Docker
- Orchestration: Docker Compose

## Folder Structure

```text
Inventix/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── dependencies.py
│   │   └── routes/
│   │       ├── products.py
│   │       ├── customers.py
│   │       ├── orders.py
│   │       └── dashboard.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
└── README.md
```

## Installation Steps

1. Install Docker Desktop.
2. Clone or open this repository.
3. Copy `.env.example` to `.env` and adjust values if needed.
4. Start the full stack with Docker Compose.

```bash
docker compose up --build
```

## Docker Setup

Docker Compose starts three services:

- `postgres`: PostgreSQL 17 Alpine with a named persistent volume
- `backend`: FastAPI on `http://localhost:8000`
- `frontend`: React production preview on `http://localhost:5173`

The database tables are created automatically by SQLAlchemy when the backend starts.

## Running Locally

Run everything with Docker:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

## Deployment Guide

### Backend on Render

1. Create a PostgreSQL database on Render.
2. Create a Web Service for the `backend` folder.
3. Set the build command to:

```bash
pip install -r requirements.txt
```

4. Set the start command to:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

5. Add `DATABASE_URL` using the Render PostgreSQL internal connection string.
6. Add `CORS_ORIGINS` with the deployed Vercel frontend URL.

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the root directory to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add `VITE_API_URL` with the deployed Render backend URL.

## API Documentation

FastAPI interactive documentation is available at:

```text
http://localhost:8000/docs
```

Main endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/dashboard` | Dashboard totals |
| POST | `/products` | Create product |
| GET | `/products` | List products |
| GET | `/products/{id}` | Retrieve product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| POST | `/customers` | Create customer |
| GET | `/customers` | List customers |
| GET | `/customers/{id}` | Retrieve customer |
| DELETE | `/customers/{id}` | Delete customer |
| POST | `/orders` | Create order |
| GET | `/orders` | List orders |
| GET | `/orders/{id}` | Retrieve order |
| DELETE | `/orders/{id}` | Cancel order |

## Screenshots

The running application contains the screens required for assessment submission:

- Dashboard statistic cards at `/dashboard`
- Product form and table at `/products`
- Customer form and table at `/customers`
- Order creation, order table, and order details at `/orders`

## Verification Checklist

- Frontend builds with `npm run build`
- Backend imports and starts with FastAPI
- PostgreSQL runs through Docker Compose
- Product and customer CRUD routes are available
- Order creation deducts inventory
- Order cancellation restores inventory
- Dashboard returns total products, customers, orders, and low-stock counts
