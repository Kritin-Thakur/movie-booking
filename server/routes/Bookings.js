const express = require("express");
const router = express.Router();
const { Booking, Showtime, Theater, Screen, Movie, Booking_Seat } = require("../models"); // Import your models

router.get("/:userId", async (req, res) => {
    const userId = req.params;

    try {
        const bookings = await Booking.findAll({
            where: { UserName: userId },
            attributes: [
                'BookingID',
                'ShowtimeID',
                'BookingDate',
                'PaymentStatus',
                'TotalAmount',
                [Sequelize.literal('(SELECT COUNT(*) FROM Booking_Seat WHERE Booking_Seat.BookingID = Booking.BookingID)'), 'TicketsBought']
            ],
            include: [
                {
                    model: Showtime,
                    attributes: ['StartTime', 'EndTime'],
                    include: [
                        {
                            model: Screen,
                            attributes: ['ScreenNumber'],
                            include: [
                                {
                                    model: Theater,
                                    attributes: ['TheaterName']
                                }
                            ]
                        },
                        {
                            model: Movie,
                            attributes: ['Title']
                        }
                    ]
                }
            ]
        });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching bookings." });
    }
});

module.exports = router;
