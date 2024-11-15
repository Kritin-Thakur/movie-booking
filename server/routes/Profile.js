const express = require("express");
const router = express.Router();
const mysqlConnection = require('../mysql'); // Import the mysql2 connection
const { validateToken } = require('../middlewares/AuthMiddleware');

// Route to get profile information
router.get("/", validateToken, async (req, res) => {
    try {
        // After validation, extract UserName from the token
        const { username } = req.user;

        // SQL query to fetch the user details
        const query = 'SELECT UserName, Name, Email, Phone, isAdmin FROM Users WHERE UserName = ?';

        mysqlConnection.query(query, [username], (err, results) => {
            if (err) {
                console.error("Error fetching profile:", err);
                return res.status(500).json({ error: "An error occurred while fetching profile information" });
            }

            // If user is found
            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            // Send the fetched user data as JSON
            res.json(results[0]); // Since `results` is an array, return the first user
        });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "An error occurred while fetching profile information" });
    }
});

module.exports = router;
