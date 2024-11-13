const express = require("express");
const router = express.Router();
const { Users } = require('../models'); // Users is the model of the Users database
const { validateToken } = require('../middlewares/AuthMiddleware');

// Route to get profile information
router.get("/", validateToken, async (req, res) => {
    try {
        // After validation, extract UserName from the token
        const { username } = req.user;

        // Fetch the user details from the database
        const user = await Users.findOne({
            where: { UserName: username },
            attributes: ['UserName', 'Name', 'Email', 'Phone'] // Only fetch specific columns
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user data as JSON
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "An error occurred while fetching profile information" });
    }
});

module.exports = router;
