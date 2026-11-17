
# Student Record Management API

## Description
A REST API developed using Node.js and Express.js
to manage student records.

## Technologies Used
- Node.js
- Express.js
- JavaScript

## Installation

Run the following commands:

npm install

## Start Server

node server.js

## Server URL

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| POST | /api/students | Add student |
| GET | /api/students/:id | Get student by ID |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |
| GET | /api/students/filter?branch=CSE | Filter by branch |

## Data Storage
All student records are stored in an
in-memory JavaScript array.
