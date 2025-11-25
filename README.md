# High-Scale E-Commerce Inventory & Order Processing System

This is a Node.js-based high-scale e-commerce backend project with PostgreSQL, Redis, and RabbitMQ integration. It includes authentication, product & inventory management, order processing, admin analytics, caching, and queueing.

---

# Features

* **Authentication & Role-Based Access** (Admin/User)
* **Product & Inventory Management** with atomic stock updates
* **Order Processing** with transactions and inventory checks
* **Advanced Product Search** with pagination & filters
* **Admin Sales Analytics** (daily sales, top products)
* **Caching** using Redis for product listings & details
* **Queueing** using RabbitMQ for asynchronous tasks (analytics)

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Cache & Queue:** Redis, RabbitMQ
* **Testing & API:** Postman
* **Others:** Knex.js for database queries, bcrypt for password hashing

---

## Prerequisites

* Node.js
* PostgreSQL
* Redis
* RabbitMQ

---

## Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables (create `.env` file):

```env
PORT=
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
RABBITMQ_URL=
```

5. Run database migrations:

```bash
npm run migrate
```

7. Start the server:

```bash
npm start
```

Server will run on `http://localhost:4000`

---

## API Documentation

You can find the full API documentation [here](https://docs.google.com/document/d/195dpHSqhIyksMSD_cA_DHFBdaZU-2-d0tKLiIYqTVR8/edit?usp=sharing).

It includes routes for:

* Authentication (`/auth/register`, `/auth/login`)
* Products (`/products`)
* Orders (`/orders`)
* Admin Analytics (`/admin/analytics`)

---

## Folder Structure

```
├── src
│   ├── controllers
│   ├── migrations
│   ├── routes
│   ├── services
│   ├── models
│   ├── utils
│   └── index.js
└── README.md
```

