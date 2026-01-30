# TM470 Booking System

## Project Overview  
A full-stack booking system using **Node.js, Express, React, and MySQL**. Users can manage bookings through a web interface, with a secure backend for data processing.

## Folder Structure  
tm470-booking-system/  
│── backend/  # API service (Node.js + Express + MySQL)  
│── frontend/  # Web app (React)

## How to Run the Project  
### Backend (API Server)  
- Navigate to the backend folder: `cd backend`  
- Install dependencies: `npm install`  
- Start the API server: `node server.js`  
- Runs on **http://localhost:5001**  

### Frontend (React App)  
- Navigate to the frontend folder: `cd frontend`  
- Install dependencies: `npm install`  
- Start the frontend: `npm start`  
- Runs on **http://localhost:3000**  

## API Endpoints  
| Method | Endpoint         | Description                    |  
|--------|-----------------|--------------------------------|  
| `GET`  | `/test`         | Checks if API is running.      |  
| `POST` | `/bookings`     | Creates a new booking.         |  
| `GET`  | `/bookings/:id` | Retrieves a specific booking.  |  

## Environment Variables (`.env`)  
- **Backend** should include a `.env` file with:  
  DB_HOST=your-database-host  
  DB_USER=your-database-username  
  DB_PASS=your-database-password  
- **Ensure `.env` is listed in `.gitignore`** to prevent sensitive information from being uploaded to GitHub.

## Git & Version Control  
- **Check `.gitignore`** to ensure it includes:  
  /node_modules  
  /.env  
  *.sql  
  /build  
- **Commit changes safely:**  
  `git add .`  
  `git commit -m "Updated project setup"`  
  `git push origin main`  

**Effect:** This README ensures easy setup, version control, and maintenance for future development.
