const express = require("express");
const mysqlConnection = require('../mysql'); // Import your mysql2 connection
const router = express.Router();

// Route to get all movies
router.get('/showmovies', async (req, res) => {
    try {
        const query = 'SELECT MovieID, Title, Genre, Duration FROM Movies';
        mysqlConnection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching movies:', err);
                return res.status(500).json({ error: 'Failed to fetch movies' });
            }
            res.json(results);  // Respond with the MovieID and other details
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Route to add a new movie
router.post("/addmovie", async (req, res) => {
    const newMovie = req.body;
    const { Title, Genre, Duration } = newMovie;

    try {
        const query = `
            INSERT INTO Movies (Title, Genre, Duration)
            VALUES (?, ?, ?)
        `;
        mysqlConnection.query(query, [Title, Genre, Duration], (err, result) => {
            if (err) {
                console.error('Error adding movie:', err);
                return res.status(500).json({ error: 'Failed to add movie' });
            }
            res.json(newMovie);  // Return the movie details after successful insertion
        });
    } catch (err) {
        console.error('Error adding movie:', err);
        res.status(500).json({ error: 'Failed to add movie' });
    }
});

// Route to search for movies by title
router.get("/search", async (req, res) => {
    const { query } = req.query; // The search term sent from the front end

    try {
        const searchQuery = query
            ? 'SELECT * FROM Movies WHERE Title LIKE ?'  // If a search term is provided, filter movies by title
            : 'SELECT * FROM Movies'; // Fetch all movies if no search term

        mysqlConnection.query(searchQuery, [`%${query}%`], (err, results) => {
            if (err) {
                console.error('Error fetching movies:', err);
                return res.status(500).json({ error: 'Failed to fetch movies' });
            }
            res.json(results);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch movies." });
    }
});

// Route to get a specific movie by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM Movies WHERE MovieID = ?';
        mysqlConnection.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching movie details:', err);
                return res.status(500).json({ error: 'Error fetching movie details' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Movie not found" });
            }

            res.json(results[0]);
        });
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: "Error fetching movie details" });
    }
});

// Route to get theaters showing a specific movie
router.get('/:movieId/theaters', async (req, res) => {
    const { movieId } = req.params;

    try {
        const query = `
            SELECT t.TheaterID, t.TheaterName, t.Location 
            FROM Showtimes s
            JOIN Screens sc ON s.ScreenID = sc.ScreenID
            JOIN Theaters t ON sc.TheaterID = t.TheaterID
            WHERE s.MovieID = ?
        `;
        mysqlConnection.query(query, [movieId], (err, results) => {
            if (err) {
                console.error('Error fetching theaters:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'No theaters showing this movie' });
            }

            res.json(results); // Return the list of theaters
        });
    } catch (error) {
        console.error('Error fetching theaters:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
