const express = require('express');
const { Theater, Showtime } = require('../models');  // Assuming you're using Sequelize ORM
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const theaters = await Theater.findAll({
            attributes: ['TheaterID', 'TheaterName', 'Location'], // Include TheaterID
        });
        res.json(theaters);  // Respond with the TheaterID and other details
    } catch (error) {
        console.error('Error fetching theaters:', error);
        res.status(500).json({ error: 'Failed to fetch theaters' });
    }
});


// Get showtimes for a specific theater
router.get('/showtimes/:theaterId/', async (req, res) => {
    const { theaterId } = req.params;
    try {
        const showtimes = await Showtime.findAll({
            where: { TheaterID: theaterId },
            include: [{
                model: Movie,
                attributes: ['Title']
            }],
            attributes: ['ShowtimeID', 'StartTime']
        });
        res.json(showtimes);
    } catch (error) {
        console.error("Error fetching showtimes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;


module.exports = router;
