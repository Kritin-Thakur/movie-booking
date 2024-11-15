const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://user:password@localhost:3306/database_name'); // Replace with your connection info

async function createTriggersAndProcedures() {
    try {
        // Trigger to auto-insert required seats after a new screen is created
        await sequelize.query(`
            DELIMITER //

            CREATE TRIGGER after_screen_insert
            AFTER INSERT ON Screens
            FOR EACH ROW
            BEGIN
                DECLARE i INT DEFAULT 1;
                DECLARE seat_price DECIMAL(10, 2) DEFAULT 10.00;  -- Set the default seat price

                -- Loop to insert 50 seats with SeatNumber 1 to 50
                WHILE i <= 50 DO
                    INSERT INTO Seats (SeatNumber, ScreenID, SeatPrice)
                    VALUES (i, NEW.ScreenID, seat_price);
                    SET i = i + 1;
                END WHILE;
            END //

            DELIMITER ;
        `);

        // Trigger to auto-insert 5 screens after a new theater is created
        await sequelize.query(`
            DELIMITER $$

            CREATE TRIGGER after_theater_insert
            AFTER INSERT ON Theaters
            FOR EACH ROW
            BEGIN
                DECLARE i INT DEFAULT 1;

                -- Loop to insert 5 new screens for each new theater
                WHILE i <= 5 DO
                    INSERT INTO Screens (ScreenNumber, TheaterID)
                    VALUES (i, NEW.TheaterID); -- Use NEW.TheaterID to reference the inserted theater's ID
                    SET i = i + 1;
                END WHILE;
            END $$

            DELIMITER ;
        `);

        // Procedure to get user bookings
        await sequelize.query(`
            DELIMITER $$

            CREATE PROCEDURE GetUserBookings(IN userName VARCHAR(255))
            BEGIN
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY b.BookingDate) AS RowNumber,
                    b.BookingID,
                    b.ShowtimeID,
                    b.BookingDate,
                    b.PaymentStatus,
                    b.TotalAmount,
                    (SELECT COUNT(*) FROM Booking_Seats WHERE Booking_Seats.BookingID = b.BookingID) AS TicketsBought,
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
                WHERE b.UserName = userName;
            END $$

            DELIMITER ;
        `);

        console.log("Triggers and procedures created successfully!");
    } catch (error) {
        console.error("Error executing SQL queries:", error);
    }
}

// Call the function to create the triggers and procedures
createTriggersAndProcedures();
