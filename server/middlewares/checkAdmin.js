const { User } = require('../models'); // Import your User model

// Middleware to check if user is an admin
const checkAdmin = async (req, res, next) => {
    const { UserName } = req.body; // UserName will be sent in the request body or headers (adjust based on your flow)

    try {
        // Find the user by UserName
        const user = await User.findOne({ where: { UserName } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user is an admin
        if (user.isAdmin) {
            // User is an admin, proceed to the next middleware or route handler
            return next();
        } else {
            return res.status(403).json({ error: "You do not have admin privileges" });
        }
    } catch (error) {
        console.error("Error verifying admin user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = checkAdmin;
