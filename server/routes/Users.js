const express = require("express");
const router = express.Router();
const { Users } = require('../models'); // Users is the model of the Users database
const bcrypt = require("bcryptjs");

const { sign } = require('jsonwebtoken');


router.get("/", async(req, res) => {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
});

router.post("/", async (req, res) => {
    try {
        const { UserName, Name, Email, Phone, Password } = req.body;


        // Check if existing user, phone number, mail is there
        const existingUser = await Users.findOne({ where: { UserName } });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }
        
        const existingMail = await Users.findOne({ where: { Email } });
        if (existingMail) {
            return res.status(400).json({ error: "Mail is already taken" });
        }
        
        const existingPh = await Users.findOne({ where: { Phone } });
        if (existingPh) {
            return res.status(400).json({ error: "Phone number is already taken" });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(Password, 10);

        const newUser = await Users.create({
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

router.post("/login", async (req, res) => {
    const {UserName, Password} = req.body;
    
    const user = await Users.findOne({ where: {UserName}});
    if (!user) return res.json({error: "User doesn't exist!"});
    
    bcrypt.compare(Password, user.Password).then((match) => {
        if (!match) return res.json({error: "Wrong Password"});

        const accessToken = sign(
            {username: user.UserName, email: user.Email, phonenumber: user.Phone},
            process.env.JWT_SECRET
        );
        res.json({accessToken}); 
    });
});


module.exports = router;
