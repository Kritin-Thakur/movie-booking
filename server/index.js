const express = require('express');
const app = express();
const cors = require('cors');
// Import dotenv to load the .env file
require('dotenv').config();

app.use(express.json()); // Allows us to parse the req and res body which are in json format
app.use(cors());

const db = require('./models');

// Routers- used to make index.js file much cleaner by compartmentalizing the requests.
const userRouter = require('./routes/Users');
const movieRouter = require('./routes/Movies');
const profileRouter = require('./routes/Profile');


app.use('/auth', userRouter); // app.use(path, callback (the functions in the routes files declared in the constants above))
app.use('/movies', movieRouter);
app.use('/profile', profileRouter);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server started on port 3001");
    });
});

