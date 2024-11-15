import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MovieDetail() {
    const { movieId } = useParams();
    const navigate = useNavigate();  // Hook to navigate to different routes
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState('');
    const [numTickets, setNumTickets] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showTimes, setShowTimes] = useState([]);
    const [bookingStatus, setBookingStatus] = useState("");
    const [notFound, setNotFound] = useState(false);
    const ticketPrice = 10; // Define ticket price or fetch from API if dynamic

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`http://localhost:3001/movies/${movieId}`);
                const data = await response.json();
                if (response.ok) {
                    setMovie(data);
                } else if (data.error === "Movie not found") {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovie();
    }, [movieId]);

    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                const response = await fetch(`http://localhost:3001/movies/${movieId}/theaters`);
                const data = await response.json();
                setTheaters(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching theaters:", error);
            }
        };

        if (movieId) {
            fetchTheaters();
        }
    }, [movieId]);

    useEffect(() => {
        const fetchShowTimes = async () => {
            if (selectedTheater) {
                try {
                    const response = await fetch(`http://localhost:3001/showtimes/${movieId}/theaters/${selectedTheater}`);
                    const data = await response.json();
                    setShowTimes(data);
                } catch (error) {
                    console.error("Error fetching showtimes:", error);
                }
            }
        };

        fetchShowTimes();
    }, [selectedTheater, movieId]);

    useEffect(() => {
        setTotalAmount(numTickets * ticketPrice);
    }, [numTickets]);

    const handleTicketBooking = async () => {
        const bookingDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Converts to 'YYYY-MM-DD HH:MM:SS'
        const token = sessionStorage.getItem('accessToken'); // Retrieve JWT from session storage
    
        if (!token) {
            setBookingStatus("You must be logged in to book tickets.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/bookings/bookticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accessToken': token // Pass JWT in the Authorization header
                },
                body: JSON.stringify({
                    ShowtimeID: selectedShowtime,
                    BookingDate: bookingDate, // Send the properly formatted BookingDate
                    PaymentStatus: "Pending", // Default to "Pending"
                    TotalAmount: totalAmount,
                    numberOfTickets: numTickets
                })
            });
    
            const data = await response.json();
            if (response.ok) {
                // Redirect to the PaymentProcessing page
                navigate(`/payment-processing/${data.bookingDetails.BookingID}`);
            } else {
                setBookingStatus(data.error || "Booking failed. Please try again.");
            }
        } catch (error) {
            console.error("Error booking ticket:", error);
            setBookingStatus("Booking failed. Please try again.");
        }
    };

    if (notFound) {
        return <div>Sorry, no showtimes right now. Check back later!</div>;
    }

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-detail">
            <h1>{movie.Title}</h1>
            <p>Genre: {movie.Genre}</p>
            <p>Duration: {movie.Duration} minutes</p>
            <p>Description: {movie.Description}</p>

            {theaters.length === 0 ? (
                <div>Sorry, no shows available right now. Check back later!</div>
            ) : (
                <>
                    <div>
                        <label htmlFor="theater">Select Theater:</label>
                        <select
                            id="theater"
                            value={selectedTheater}
                            onChange={(e) => setSelectedTheater(e.target.value)}
                        >
                            <option value="">Select a theater</option>
                            {theaters.map((theater) => (
                                <option key={theater.TheaterID} value={theater.TheaterID}>
                                    {theater.TheaterName} - {theater.Location}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedTheater && (
                        <div>
                            <label htmlFor="showtime">Select Showtime:</label>
                            <select
                                id="showtime"
                                value={selectedShowtime}
                                onChange={(e) => setSelectedShowtime(e.target.value)}
                            >
                                <option value="">Select a showtime</option>
                                {showTimes.length > 0 ? (
                                    showTimes.map((show) => (
                                        <option key={show.ShowtimeID} value={show.ShowtimeID}>
                                            {new Date(show.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {" to "}
                                            {new Date(show.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No showtimes available</option>
                                )}
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="numTickets">Number of Tickets:</label>
                        <input
                            type="number"
                            id="numTickets"
                            value={numTickets}
                            onChange={(e) => setNumTickets(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                    <p>Total Amount: ${totalAmount.toFixed(2)}</p>
                    <button onClick={handleTicketBooking}>Book Tickets</button>
                </>
            )}

            {bookingStatus && <p>{bookingStatus}</p>}
        </div>
    );
}

export default MovieDetail;
