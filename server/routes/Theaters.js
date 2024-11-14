const express = require('express');
const mysqlConnection = require('../mysql');  // Import mysql2 connection
const router = express.Router();

// Get list of theaters
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT TheaterID, TheaterName, Location FROM Theaters'; // Adjust the query as needed based on your database structure
        mysqlConnection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching theaters:', err);
                return res.status(500).json({ error: 'Failed to fetch theaters' });
            }

            res.json(results); // Respond with the list of theaters
        });
    } catch (error) {
        console.error('Error fetching theaters:', error);
        res.status(500).json({ error: 'Failed to fetch theaters' });
    }
});

// Get showtimes for a specific theater
router.get('/showtimes/:theaterId', async (req, res) => {
    const { theaterId } = req.params;
    try {
        const query = `
            SELECT ShowtimeID, StartTime, m.Title AS MovieTitle
            FROM Showtimes s
            JOIN Movies m ON m.MovieID = s.MovieID
            WHERE s.TheaterID = ?
        `;
        mysqlConnection.query(query, [theaterId], (err, results) => {
            if (err) {
                console.error('Error fetching showtimes:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json(results); // Respond with the list of showtimes for the theater
        });
    } catch (error) {
        console.error('Error fetching showtimes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new theater
router.post('/addtheater', async (req, res) => {
    try {
        const { TheaterName, Location } = req.body;

        if (!TheaterName || !Location) {
            return res.status(400).json({ error: 'Theater Name and Location are required.' });
        }

        // Check if the theater already exists
        const checkQuery = 'SELECT * FROM Theaters WHERE TheaterName = ?';
        mysqlConnection.query(checkQuery, [TheaterName], (err, results) => {
            if (err) {
                console.error('Error checking for existing theater:', err);
                return res.status(500).json({ error: 'Failed to check theater existence' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Theater name already exists.' });
            }

            // Create the new theater
            const insertQuery = 'INSERT INTO Theaters (TheaterName, Location) VALUES (?, ?)';
            mysqlConnection.query(insertQuery, [TheaterName, Location], (err, results) => {
                if (err) {
                    console.error('Error creating theater:', err);
                    return res.status(500).json({ error: 'Failed to create theater' });
                }

                res.status(201).json({ message: 'Theater created successfully', newTheater: { TheaterName, Location } });
            });
        });
    } catch (err) {
        console.error('Error adding theater:', err);
        res.status(500).json({ error: 'Failed to create theater' });
    }
});

module.exports = router;
