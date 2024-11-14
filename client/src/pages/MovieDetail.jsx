import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetail() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);  // Initialize as empty array
    const [selectedTheater, setSelectedTheater] = useState('');
    const [numTickets, setNumTickets] = useState(1);
    const [showTimes, setShowTimes] = useState([]);
    const [bookingStatus, setBookingStatus] = useState("");
    const [notFound, setNotFound] = useState(false);

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
                setTheaters(Array.isArray(data) ? data : []);  // Ensure data is an array
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

    const handleTicketBooking = async () => {
        const userId = 1;
        const showTime = new Date().toISOString();

        try {
            const response = await fetch('http://localhost:3001/movies/bookticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    movieId,
                    showTime,
                    numberOfTickets: numTickets,
                    theater: selectedTheater
                })
            });

            const data = await response.json();
            setBookingStatus(`Booking confirmed! Ticket ID: ${data.id}`);
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

            {/* Show message if no theaters are available */}
            {theaters.length === 0 ? (
                <div>Sorry, no shows available right now. Check back later!</div>
            ) : (
                <>
                    {/* Dropdown for selecting theater */}
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

                    {/* Dropdown for selecting showtime */}
                    {selectedTheater && (
                        <div>
                            <label htmlFor="showtime">Select Showtime:</label>
                            <select id="showtime">
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
                    <button onClick={handleTicketBooking}>Book Tickets</button>
                </>
            )}

            


            {bookingStatus && <p>{bookingStatus}</p>}
        </div>
    );
}

export default MovieDetail;
