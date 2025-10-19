# Nua Full-Stack Internship Assignment

A full-stack user management application built for an internship assignment. The app fetches user data from a public API, stores it in a MySQL database, and allows users to view, filter, and edit the information through a Vue.js front-end.

## Tech Stack

* [cite_start]**Frontend:** Vue.js, Vuetify, Axios [cite: 54]
* [cite_start]**Backend:** Node.js, Express [cite: 54]
* [cite_start]**Database:** MySQL [cite: 54]

## How to Run This Project

### Prerequisites

* Node.js
* A running MySQL server (like from XAMPP)

### Backend Setup

1.  Navigate to the `backend` folder: `cd backend`
2.  Install dependencies: `npm install`
3.  Ensure the MySQL server is running and a database named `nua_assignment` exists.
4.  Run the server: `node index.js`
5.  The server will run on `http://localhost:3000`.
6.  Use an API tool like Postman to make a **POST** request to `http://localhost:3000/api/users/fetch` to populate the database.

### Frontend Setup

1.  Navigate to the `frontend` folder: `cd frontend`
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`
4.  Open the URL provided (usually `http://localhost:5173`) in your browser.
