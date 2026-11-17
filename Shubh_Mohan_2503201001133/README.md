# Product Inventory Management API (Set C)

This project is a REST API developed with Node.js and Express.js for managing product inventory, adhering to the requirements of the MERN Midterm Practical Assessment (Set C).

## Features
- In-memory data store with initial seed records (ID 301, 302, 303).
- Endpoints for retrieving all products, creating a product, fetching by ID, updating (PUT), deleting, and case-insensitive category filtering.
- Input validation verifying numeric price/quantity and boolean inStock values.

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation & Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   Or for development with nodemon:
   ```bash
   npm run dev
   ```

The server runs on `http://localhost:3000`.

## API Endpoints Summary

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| GET | `/api/products` | Get all products | 200 |
| GET | `/api/products/:id` | Get product by ID | 200, 404, 400 |
| GET | `/api/products/filter?category=value` | Filter by category (case-insensitive) | 200, 400 |
| POST | `/api/products` | Create new product | 201, 400 |
| PUT | `/api/products/:id` | Update product by ID | 200, 404, 400 |
| DELETE | `/api/products/:id` | Delete product by ID | 200, 404, 400 |

## Testing
Test endpoints using Postman, Thunder Client, or cURL.
