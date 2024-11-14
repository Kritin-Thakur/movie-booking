const express = require('express');
const mysqlConnection = require('../mysql');  // Import your mysql2 connection
const router = express.Router();

// Route to create a new Showtime
router.post('/createShowtime', async (req, res) => {
    const { date, endTime, movieId, screenNumber, startTime, theaterId } = req.body;

    try {
        // Ensure the MovieID and TheaterID are integers
        const movieQuery = 'SELECT * FROM Movies WHERE MovieID = ?';
        mysqlConnection.query(movieQuery, [movieId], async (err, movieResults) => {
            if (err) {
                console.error('Error fetching movie:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (movieResults.length === 0) {
                return res.status(400).json({ error: 'Movie not found' });
            }

            const theaterQuery = 'SELECT * FROM Theaters WHERE TheaterID = ?';
            mysqlConnection.query(theaterQuery, [theaterId], async (err, theaterResults) => {
                if (err) {
                    console.error('Error fetching theater:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (theaterResults.length === 0) {
                    return res.status(400).json({ error: 'Theater not found' });
                }

                // Find the ScreenID by ScreenNumber and TheaterID
                const screenQuery = 'SELECT * FROM Screens WHERE TheaterID = ? AND ScreenNumber = ?';
                mysqlConnection.query(screenQuery, [theaterId, screenNumber], async (err, screenResults) => {
                    if (err) {
                        console.error('Error fetching screen:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    if (screenResults.length === 0) {
                        return res.status(400).json({ error: 'Screen not found' });
                    }

                    // Format the StartTime to YYYYMMDDHHmmss format for uniqueness
                    const formattedStartTime = new Date(startTime);
                    const startTimeString = formattedStartTime.toISOString().replace(/[-:T]/g, '').slice(0, 14);  // Removes "-" ":" and "T", keeping first 14 digits for YYYYMMDDHHmmss

                    // Generate the ShowtimeID by concatenating MovieID, ScreenNumber, and formatted StartTime (optional)
                    const showtimeID = `${movieId}-${screenNumber}-${startTimeString}`;

                    // Insert the new Showtime into the database
                    const insertShowtimeQuery = `
                        INSERT INTO Showtimes (StartTime, EndTime, Date, MovieID, ScreenID)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    mysqlConnection.query(insertShowtimeQuery, [startTime, endTime, date, movieId, screenResults[0].ScreenID], (err, result) => {
                        if (err) {
                            console.error('Error creating showtime:', err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }

                        res.status(200).json({
                            message: 'Showtime created successfully',
                            showtime: {
                                ShowtimeID: showtimeID,
                                StartTime: startTime,
                                EndTime: endTime,
                                Date: date,
                                MovieID: movieId,
                                ScreenID: screenResults[0].ScreenID,
                            }
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error creating showtime:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch showtimes for a specific movie in a specific theater
router.get('/:movieId/theaters/:theaterId', async (req, res) => {
    const { movieId, theaterId } = req.params;

    try {
        const query = `
            SELECT ShowtimeID, StartTime, EndTime 
            FROM Showtimes s
            JOIN Screens sc ON s.ScreenID = sc.ScreenID
            JOIN Theaters t ON sc.TheaterID = t.TheaterID
            WHERE s.MovieID = ? AND t.TheaterID = ?
        `;
        mysqlConnection.query(query, [movieId, theaterId], (err, results) => {
            if (err) {
                console.error('Error fetching showtimes:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'No showtimes found for this movie at the selected theater' });
            }

            res.json(results);  // Return the list of showtimes
        });
    } catch (error) {
        console.error('Error fetching showtimes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
