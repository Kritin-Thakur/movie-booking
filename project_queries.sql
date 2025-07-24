#####SQL Queries ()


-- Users Table
CREATE TABLE User (
    UserName VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE
);

-- Theater Table
CREATE TABLE Theater (
    TheaterID INT PRIMARY KEY AUTO_INCREMENT,
    TheaterName VARCHAR(255) NOT NULL,
    Location VARCHAR(255) NOT NULL
);

-- Screen Table
CREATE TABLE Screen (
    ScreenID INT PRIMARY KEY AUTO_INCREMENT,
    ScreenNumber INT NOT NULL,
    TheaterID INT,
    FOREIGN KEY (TheaterID) REFERENCES Theater(TheaterID)
);

-- Movie Table
CREATE TABLE Movie (
    MovieID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Genre VARCHAR(100) NOT NULL,
    Duration INT NOT NULL
);

-- Showtime Table
CREATE TABLE Showtime (
    ShowtimeID INT PRIMARY KEY AUTO_INCREMENT,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Date DATE NOT NULL,
    ScreenID INT,
    MovieID INT,
    FOREIGN KEY (ScreenID) REFERENCES Screen(ScreenID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID)
);

-- Booking Table
CREATE TABLE Booking (
    BookingID INT PRIMARY KEY AUTO_INCREMENT,
    BookingDate DATETIME NOT NULL,
    PaymentStatus VARCHAR(50) NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    UserName VARCHAR(255),
    ShowtimeID INT,
    FOREIGN KEY (UserName) REFERENCES User(UserName),
    FOREIGN KEY (ShowtimeID) REFERENCES Showtime(ShowtimeID)
);

-- Seat Table
CREATE TABLE Seat (
    SeatID INT PRIMARY KEY AUTO_INCREMENT,
    SeatNumber INT NOT NULL,
    SeatPrice DECIMAL(10, 2) NOT NULL,
    ScreenID INT,
    FOREIGN KEY (ScreenID) REFERENCES Screen(ScreenID)
);

-- Booking_Seat Table
CREATE TABLE Booking_Seat (
    BookingID INT,
    SeatID INT,
    PRIMARY KEY (BookingID, SeatID),
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID),
    FOREIGN KEY (SeatID) REFERENCES Seat(SeatID)
);

--- Trigger on screens table to auto insert required seats:


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


-- Procedure to getuserbookings:


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



-- function to get particular booking information:

DELIMITER $$

CREATE FUNCTION GetBookingDetails(bookingID INT)
RETURNS JSON
BEGIN
    DECLARE bookingDetails JSON;

    SELECT 
        JSON_OBJECT(
            'BookingID', b.BookingID,
            'ShowtimeID', b.ShowtimeID,
            'BookingDate', b.BookingDate,
            'PaymentStatus', b.PaymentStatus,
            'TotalAmount', b.TotalAmount,
            'StartTime', s.StartTime,
            'EndTime', s.EndTime,
            'ScreenNumber', sc.ScreenNumber,
            'TheaterName', t.TheaterName,
            'Title', m.Title
        ) INTO bookingDetails
    FROM Booking b
    JOIN Showtime s ON b.ShowtimeID = s.ShowtimeID
    JOIN Screen sc ON s.ScreenID = sc.ScreenID
    JOIN Theater t ON sc.TheaterID = t.TheaterID
    JOIN Movie m ON s.MovieID = m.MovieID
    WHERE b.BookingID = bookingID;

    RETURN bookingDetails;
END $$

DELIMITER ;


-- Queries:

-- update:
UPDATE Users SET Password = ? WHERE UserName = ?;

-- insert:
INSERT INTO Users (UserName, Name, Email, Phone, Password, isAdmin) VALUES (?, ?, ?, ?, ?, ?);

-- join:
SELECT ShowtimeID, StartTime, EndTime FROM Showtimes s
	JOIN Screens sc ON s.ScreenID = sc.ScreenID
	JOIN Theaters t ON sc.TheaterID = t.TheaterID
WHERE s.MovieID = ? AND t.TheaterID = ?;

-- nested query:
SELECT t.TheaterID, t.TheaterName, t.Location FROM Theaters t
WHERE t.TheaterID IN (
		SELECT sc.TheaterID FROM Screens sc
		WHERE sc.ScreenID IN (
				SELECT s.ScreenID FROM Showtimes s
				WHERE s.MovieID = ?
		)
);

