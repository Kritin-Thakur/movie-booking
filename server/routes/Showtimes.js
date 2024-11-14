const express = require('express');
const { Movie, Theater, Screen, Showtime } = require('../models');  // Import your models
const router = express.Router();

router.post('/createShowtime', async (req, res) => {
    const { date, endTime, movieId, screenNumber, startTime, theaterId  } = req.body;

    try {
        // Ensure the MovieID and TheaterID are integers
        const movie = await Movie.findOne({
            where: { MovieID: movieId }
        });

        if (!movie) {
            return res.status(400).json({ error: "Movie not found" });
        }

        const theater = await Theater.findOne({
            where: { TheaterID: theaterId }
        });

        if (!theater) {
            return res.status(400).json({ error: "Theater not found" });
        }

        // Find the ScreenID by ScreenNumber and TheaterID
        const screen = await Screen.findOne({
            where: {
                TheaterID: theaterId,
                ScreenNumber: screenNumber
            }
        });

        if (!screen) {
            return res.status(400).json({ error: "Screen not found" });
        }

        // Format the StartTime to YYYYMMDDHHmmss format for uniqueness
        const formattedStartTime = new Date(startTime);
        const startTimeString = formattedStartTime.toISOString().replace(/[-:T]/g, '').slice(0, 14);  // Removes "-" ":" and "T", keeping first 14 digits for YYYYMMDDHHmmss

        // Generate the ShowtimeID by concatenating MovieID, ScreenNumber, and formatted StartTime


        // Create the new Showtime
        const showtime = await Showtime.create({
            StartTime: startTime,  // Handle as a DATETIME
            EndTime: endTime,  // Handle as a DATETIME
            Date: date,  // Handle as a DATE
            MovieID: movieId,
            ScreenID: screen.ScreenID,  // Use the ScreenID for the showtime
        });

        return res.status(200).json({
            message: "Showtime created successfully",
            showtime,
        });

    } catch (error) {
        console.error("Error creating showtime:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Assuming you have the correct associations between Showtime, Screen, Theater, and Movie

// Route to fetch showtimes for a specific movie in a specific theater
router.get('/:movieId/theaters/:theaterId', async (req, res) => {
    const { movieId, theaterId } = req.params;

    try {
        const showtimes = await Showtime.findAll({
            where: {
                MovieID: movieId, // Ensure movieId matches
                '$Screen.TheaterID$': theaterId // Ensure theaterId matches
            },
            include: [{
                model: Screen,
                include: [{
                    model: Theater,
                    where: { TheaterID: theaterId }, // Filter for the selected theater
                    attributes: [] // Don't return the theater data, just use for filtering
                }]
            }],
            attributes: ['ShowtimeID', 'StartTime', 'EndTime'] // Only relevant fields
        });

        if (showtimes.length === 0) {
            return res.status(404).json({ error: "No showtimes found for this movie at the selected theater" });
        }

        res.json(showtimes); // Return the list of showtimes
    } catch (error) {
        console.error("Error fetching showtimes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
