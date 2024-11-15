const express = require("express");
const mysqlConnection = require('../mysql'); // Import mysql2 connection
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware"); // Assuming you have a validateToken middleware for authentication

// Route to create a new booking
router.post('/bookticket', validateToken, (req, res) => {
    const { ShowtimeID, BookingDate, PaymentStatus, TotalAmount, numberOfTickets } = req.body;
    const { username } = req.user; // Retrieve UserName from the decoded JWT token (matching the profile route)

    // Check if all required fields are present
    if (!ShowtimeID || !BookingDate || !PaymentStatus || !TotalAmount || !numberOfTickets) {
        return res.status(400).json({ error: "Missing required booking information." });
    }

    // Query to check if the showtime exists
    mysqlConnection.query(
        "SELECT * FROM Showtimes WHERE ShowtimeID = ?",
        [ShowtimeID],
        (err, showtimeResults) => {
            if (err) {
                console.error("Error validating showtime:", err);
                return res.status(500).json({ error: "An error occurred while validating the showtime." });
            }

            if (showtimeResults.length === 0) {
                return res.status(404).json({ error: "Showtime not found." });
            }

            // Insert the booking
            const insertBookingQuery = `
                INSERT INTO Bookings (UserName, ShowtimeID, BookingDate, PaymentStatus, TotalAmount)
                VALUES (?, ?, ?, ?, ?)
            `;
            mysqlConnection.query(
                insertBookingQuery,
                [username, ShowtimeID, BookingDate, PaymentStatus, TotalAmount],
                (err, bookingResults) => {
                    if (err) {
                        console.error("Error creating booking:", err);
                        return res.status(500).json({ error: "Failed to create booking. Please try again later." });
                    }

                    // Assuming you want to return the booking details including movie and theater info
                    const bookingID = bookingResults.insertId;
                    const selectBookingDetailsQuery = `
                        SELECT 
                            b.BookingID,
                            b.ShowtimeID,
                            b.BookingDate,
                            b.PaymentStatus,
                            b.TotalAmount,
                            s.StartTime,
                            s.EndTime,
                            sc.ScreenNumber,
                            t.TheaterName,
                            m.Title
                        FROM Bookings b
                        JOIN Showtimes s ON b.ShowtimeID = s.ShowtimeID
                        JOIN Screens sc ON s.ScreenID = sc.ScreenID
                        JOIN Theaters t ON sc.TheaterID = t.TheaterID
                        JOIN Movies m ON s.MovieID = m.MovieID
                        WHERE b.BookingID = ?
                    `;
                    mysqlConnection.query(selectBookingDetailsQuery, [bookingID], (err, bookingDetails) => {
                        if (err) {
                            console.error("Error fetching booking details:", err);
                            return res.status(500).json({ error: "Failed to fetch booking details." });
                        }

                        res.status(201).json({
                            message: "Booking successful!",
                            bookingDetails: bookingDetails[0] // Returning the detailed booking info
                        });
                    });
                }
            );
        }
    );
});


// Route to confirm payment for a booking
router.patch('/:bookingId/confirm-payment', validateToken, (req, res) => {
    const { bookingId } = req.params;  // Extract bookingId from URL params
    const { username } = req.user;     // Extract username from validated token

    // Query to check if the booking exists
    const checkBookingQuery = 'SELECT * FROM Bookings WHERE BookingID = ? AND UserName = ?';
    mysqlConnection.query(checkBookingQuery, [bookingId, username], (err, bookingResults) => {
        if (err) {
            console.error('Error checking booking:', err);
            return res.status(500).json({ error: 'An error occurred while verifying the booking.' });
        }

        if (bookingResults.length === 0) {
            return res.status(404).json({ error: 'Booking not found or you are not authorized to confirm this payment.' });
        }

        // If the booking is found, proceed with updating the payment status
        const updatePaymentStatusQuery = 'UPDATE Bookings SET PaymentStatus = ? WHERE BookingID = ?';
        mysqlConnection.query(updatePaymentStatusQuery, ['Paid', bookingId], (err, updateResults) => {
            if (err) {
                console.error('Error updating payment status:', err);
                return res.status(500).json({ error: 'An error occurred while confirming the payment.' });
            }

            // Return the updated booking details
            const selectBookingDetailsQuery = `
                SELECT 
                    b.BookingID, 
                    b.ShowtimeID, 
                    b.BookingDate, 
                    b.PaymentStatus, 
                    b.TotalAmount, 
                    s.StartTime, 
                    s.EndTime, 
                    sc.ScreenNumber, 
                    t.TheaterName, 
                    m.Title
                FROM Bookings b
                JOIN Showtimes s ON b.ShowtimeID = s.ShowtimeID
                JOIN Screens sc ON s.ScreenID = sc.ScreenID
                JOIN Theaters t ON sc.TheaterID = t.TheaterID
                JOIN Movies m ON s.MovieID = m.MovieID
                WHERE b.BookingID = ?
            `;

            mysqlConnection.query(selectBookingDetailsQuery, [bookingId], (err, bookingDetails) => {
                if (err) {
                    console.error('Error fetching booking details:', err);
                    return res.status(500).json({ error: 'Failed to fetch updated booking details.' });
                }

                res.status(200).json({
                    message: 'Payment confirmed successfully!',
                    bookingDetails: bookingDetails[0] // Return the updated booking details
                });
            });
        });
    });
});



// Gets all bookings of a user using jwt
router.get("/showbookings", validateToken, (req, res) => { 
    const { username } = req.user;  // Get the userName from the decoded JWT token
    console.log(username);
    const query = "CALL GetUserBookings(?)";

    mysqlConnection.query(query, [username], (err, results) => {
        if (err) {
            console.error("Error fetching bookings:", err);
            return res.status(500).json({ error: "An error occurred while fetching bookings." });
        }
    
        res.json(results[0]); // Return the result set
    });
});

module.exports = router;
