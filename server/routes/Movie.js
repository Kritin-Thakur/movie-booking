const express = require("express");
const router = express.Router();
const { Movie, Showtime, Screen, Theater } = require('../models'); // Import Showtime, Screen, and Theater
const { Op } = require("sequelize");



router.get('/showmovies', async (req, res) => {
    try {
        const movies = await Movie.findAll({
            attributes: ['MovieID', 'Title', 'Genre', 'Duration'], // Include MovieID
        });
        res.json(movies);  // Respond with the MovieID and other details
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

module.exports = router;

router.post("/addmovie", async (req, res) => {
    const newMovie = req.body;
    await Movie.create(newMovie);
    res.json(req.body);
});


// Route to get all movies or search by title
router.get("/search", async (req, res) => {
    const { query } = req.query; // The search term sent from the front end

    try {
        // If a search term is provided, filter movies by title
        const movies = query
            ? await Movie.findAll({ where: { title: { [Op.like]: `%${query}%` } } })
            : await Movie.findAll(); // Fetch all movies if no search term

        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch movies." });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findOne({ where: { MovieID: id } });
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ error: "Movie not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching movie details" });
    }
});


// Assuming this is your movie router

// Get theaters showing a specific movie
router.get('/:movieId/theaters', async (req, res) => {
    const { movieId } = req.params;
    try {
        // Find showtimes related to the movie, with Screen and Theater information included
        const showtimes = await Showtime.findAll({
            where: { MovieID: movieId }, // Ensure this matches the foreign key in Showtime
            include: [{
                model: Screen,  // Include Screen model to connect Theater
                include: [{
                    model: Theater,  // Include Theater model
                    attributes: ['TheaterID', 'TheaterName', 'Location']  // Select only the necessary fields
                }]
            }]
        });

        if (showtimes.length === 0) {
            return res.status(404).json({ error: "No theaters showing this movie" });
        }

        // Map the showtimes to extract theater information
        const theaters = showtimes.map(showtime => ({
            TheaterID: showtime.Screen.Theater.TheaterID,
            TheaterName: showtime.Screen.Theater.TheaterName,
            Location: showtime.Screen.Theater.Location
        }));

        res.json(theaters); // Return the list of theaters
    } catch (error) {
        console.error("Error fetching theaters:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
