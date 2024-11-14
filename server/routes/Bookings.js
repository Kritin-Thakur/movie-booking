const express = require("express");
const mysqlConnection = require('../mysql'); // Import mysql2 connection
const router = express.Router();

// Get bookings for a specific user by UserID
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT 
                b.BookingID,
                b.ShowtimeID,
                b.BookingDate,
                b.PaymentStatus,
                b.TotalAmount,
                (SELECT COUNT(*) FROM Booking_Seat WHERE Booking_Seat.BookingID = b.BookingID) AS TicketsBought,
                s.StartTime,
                s.EndTime,
                sc.ScreenNumber,
                t.TheaterName,
                m.Title
            FROM Booking b
            JOIN Showtime s ON b.ShowtimeID = s.ShowtimeID
            JOIN Screen sc ON s.ScreenID = sc.ScreenID
            JOIN Theater t ON sc.TheaterID = t.TheaterID
            JOIN Movie m ON s.MovieID = m.MovieID
            WHERE b.UserName = ?
        `;

        mysqlConnection.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching bookings:', err);
                return res.status(500).json({ error: "An error occurred while fetching bookings." });
            }

            res.json(results);  // Return the list of bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: "An error occurred while fetching bookings." });
    }
});

module.exports = router;
