const express = require("express");
const router = express.Router();
const { User } = require('../models'); // Users is the model of the Users database
const bcrypt = require("bcryptjs");
const { validateToken } = require('../middlewares/AuthMiddleware');

const { sign } = require('jsonwebtoken');


router.get("/", async(req, res) => {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
});

router.post("/", async (req, res) => { // Create new account
    try {
        const { UserName, Name, Email, Phone, Password } = req.body;

        console.log(req.body);
        // Check if existing user, phone number, mail is there
        const existingUser = await User.findOne({ where: { UserName } });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }
        
        const existingMail = await User.findOne({ where: { Email } });
        if (existingMail) {
            return res.status(400).json({ error: "Mail is already taken" });
        }
        
        const existingPh = await User.findOne({ where: { Phone } });
        if (existingPh) {
            return res.status(400).json({ error: "Phone number is already taken" });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(Password, 10);

        const newUser = await User.create({
            UserName,
            Name,
            Email,
            Phone,
            Password: hashedPassword
        });

        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.post("/login", async (req, res) => { // Login
    const {UserName, Password} = req.body;
    
    // Look for the user by username
    const user = await User.findOne({ where: {UserName}});
    
    // If the user doesn't exist, return an error message
    if (!user) {
        return res.json({error: "User doesn't exist!"});
    }

    // Compare the entered password with the hashed password stored in the database
    bcrypt.compare(Password, user.Password).then((match) => {
        if (!match) {
            return res.json({error: "Wrong password"});
        }

        // Generate the access token if username and password match
        const accessToken = sign(
            {username: user.UserName, email: user.Email, phonenumber: user.Phone},
            process.env.JWT_SECRET
        );

        // Send the access token as a response
        res.json({accessToken}); 
    }).catch(err => {
        return res.status(500).json({error: "Internal server error"});
    });
});

// Route to update password securely
router.put("/update-password", validateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
    }

    // Get the user from the JWT token
    const user = await User.findOne({ where: { UserName: req.user.username } });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.Password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash the new password before saving it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await User.update({ Password: hashedNewPassword }, { where: { UserName: req.user.username } });

    return res.status(200).json({ message: "Password updated successfully" });
});

module.exports = router;

module.exports = router;
