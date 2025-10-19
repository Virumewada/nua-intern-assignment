const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cors = require('cors'); // Import the CORS package

const app = express();
const PORT = 3000;

// --- Database Connection ---
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP default password is blank
    database: 'nua_assignment'
});

// --- Middleware ---
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // To parse JSON request bodies

// --- API Endpoints ---

// POST /api/users/fetch
// Fetches 1000 users and stores them in the database.
app.post('/api/users/fetch', async (req, res) => {
    try {
        console.log('Starting user fetch process...');
        for (let i = 1; i <= 50; i++) {
            const apiResponse = await axios.get(`https://randomuser.me/api/?results=20&page=${i}`);
            const users = apiResponse.data.results;
            const userDataForDB = users.map(user => [
                user.login.uuid, user.name.first, user.name.last, user.email, user.location.city
            ]);
            const sql = 'INSERT INTO users (uuid, first_name, last_name, email, city) VALUES ?';
            await pool.query(sql, [userDataForDB]);
        }
        res.status(201).json({ message: 'Successfully fetched and stored 1000 users.' });
    } catch (error) {
        console.error('Error during the fetch and store process:', error);
        res.status(500).json({ message: 'Failed to fetch and store users.' });
    }
});

// GET /api/users
// Lists all users from the database.
app.get('/api/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

// PUT /api/users/:uuid
// Updates a user's details.
app.put('/api/users/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const { first_name, last_name, email, city } = req.body;

        const sql = `
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, city = ? 
            WHERE uuid = ?
        `;
        
        const [result] = await pool.query(sql, [first_name, last_name, email, city, uuid]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user.' });
    }
});

// GET /
// A basic route to test if the server is running.
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});