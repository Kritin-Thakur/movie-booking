const express = require("express");
const router = express.Router();
const mysqlConnection = require('../mysql'); // Import mysql2 connection
const bcrypt = require("bcryptjs");
const { validateToken } = require('../middlewares/AuthMiddleware');
const { sign } = require('jsonwebtoken');

// Route to get all users
router.get("/", async (req, res) => {
    try {
        const query = 'SELECT UserName, Name, Email, Phone, isAdmin FROM Users'; // Adjust to your table structure
        mysqlConnection.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching users:", err);
                return res.status(500).json({ error: "Failed to fetch users" });
            }

            res.json(results); // Send all users as JSON
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route for registering a user
router.post("/register", async (req, res) => {
    try {
        const { UserName, Name, Email, Phone, Password, isAdmin = false } = req.body;

        console.log(req.body);

        // Check if existing user, phone number, or email exists using raw SQL
        const checkUserQuery = 'SELECT * FROM Users WHERE UserName = ?';
        mysqlConnection.query(checkUserQuery, [UserName], async (err, userResults) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (userResults.length > 0) return res.status(400).json({ error: "Username is already taken" });

            const checkMailQuery = 'SELECT * FROM Users WHERE Email = ?';
            mysqlConnection.query(checkMailQuery, [Email], async (err, emailResults) => {
                if (err) return res.status(500).json({ error: "Database error" });
                if (emailResults.length > 0) return res.status(400).json({ error: "Mail is already taken" });

                const checkPhoneQuery = 'SELECT * FROM Users WHERE Phone = ?';
                mysqlConnection.query(checkPhoneQuery, [Phone], async (err, phoneResults) => {
                    if (err) return res.status(500).json({ error: "Database error" });
                    if (phoneResults.length > 0) return res.status(400).json({ error: "Phone number is already taken" });

                    // Hash the password before saving it
                    const hashedPassword = await bcrypt.hash(Password, 10);

                    // Create the new user, including the isAdmin field
                    const insertQuery = 'INSERT INTO Users (UserName, Name, Email, Phone, Password, isAdmin) VALUES (?, ?, ?, ?, ?, ?)';
                    mysqlConnection.query(insertQuery, [UserName, Name, Email, Phone, hashedPassword, isAdmin], (err, results) => {
                        if (err) {
                            console.error("Error creating user:", err);
                            return res.status(500).json({ error: "Failed to create user" });
                        }

                        res.status(201).json({ message: 'User created successfully', user: { UserName, Name, Email, Phone, isAdmin } });
                    });
                });
            });
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Route for login
router.post("/login", async (req, res) => {
    const { UserName, Password } = req.body;

    const query = 'SELECT * FROM Users WHERE UserName = ?';
    mysqlConnection.query(query, [UserName], (err, results) => {
        if (err) {
            console.error("Error logging in:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.json({ error: "User doesn't exist!" });
        }

        const user = results[0]; // Assuming only one user is returned

        // Compare the entered password with the hashed password stored in the database
        bcrypt.compare(Password, user.Password).then((match) => {
            if (!match) {
                return res.json({ error: "Wrong password" });
            }

            // Generate the access token if username and password match
            const accessToken = sign(
                { username: user.UserName, email: user.Email, phonenumber: user.Phone },
                process.env.JWT_SECRET
            );

            res.json({ accessToken });
        }).catch(err => {
            return res.status(500).json({ error: "Internal server error" });
        });
    });
});

// Route to update password securely
router.put("/update-password", validateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
    }

    // Get the user from the JWT token
    const query = 'SELECT * FROM Users WHERE UserName = ?';
    mysqlConnection.query(query, [req.user.username], async (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];

        // Compare the current password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.Password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Hash the new password before saving it
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updateQuery = 'UPDATE Users SET Password = ? WHERE UserName = ?';
        mysqlConnection.query(updateQuery, [hashedNewPassword, req.user.username], (err, results) => {
            if (err) {
                console.error("Error updating password:", err);
                return res.status(500).json({ error: "Failed to update password" });
            }

            return res.status(200).json({ message: "Password updated successfully" });
        });
    });
});

module.exports = router;
