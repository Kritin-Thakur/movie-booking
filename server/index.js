const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json()); 
app.use(cors());

const database = require('./models'); // Sequelize for models and syncing

// Routers
const userRouter = require('./routes/Users');
const movieRouter = require('./routes/Movie');
const profileRouter = require('./routes/Profile');
const bookingsRouter = require('./routes/Bookings');
const theatersRouter = require('./routes/Theaters');
const showtimesRouter = require('./routes/Showtimes');

app.use('/auth', userRouter);
app.use('/movies', movieRouter);
app.use('/profile', profileRouter);
app.use('/bookings', bookingsRouter);
app.use('/theaters', theatersRouter);
app.use('/showtimes', showtimesRouter);

// Sync Sequelize models and start server
database.sequelize.sync({ force: false }).then(() => {
    app.listen(3001, () => {
        console.log("Server started on port 3001");
    });
});
