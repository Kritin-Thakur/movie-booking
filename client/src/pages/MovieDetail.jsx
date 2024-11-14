import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetail() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('');
    const [numTickets, setNumTickets] = useState(1);
    const [showTimes, setShowTimes] = useState([]);  // For showtimes of the selected theater
    const [bookingStatus, setBookingStatus] = useState("");

    // Fetch movie details
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`http://localhost:3001/movies/${movieId}`);
                const data = await response.json();
                setMovie(data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovie();
    }, [movieId]);

    // Fetch theaters that are showing the movie
    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                const response = await fetch(`http://localhost:3001/movies/${movieId}/theaters`);
                const data = await response.json();
                setTheaters(data);
            } catch (error) {
                console.error("Error fetching theaters:", error);
            }
        };

        if (movieId) {
            fetchTheaters();
        }
    }, [movieId]);

    // Fetch showtimes for the selected theater and movie
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
    }, [selectedTheater, movieId]);  // Trigger when either selectedTheater or movieId changes


    // Handle ticket booking
    const handleTicketBooking = async () => {
        const userId = 1; // Replace with actual user ID
        const showTime = new Date().toISOString(); // Replace with selected showtime if needed
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
                    theater: selectedTheater // Pass the selected theater
                })
            });
            const data = await response.json();
            setBookingStatus(`Booking confirmed! Ticket ID: ${data.id}`);
        } catch (error) {
            console.error("Error booking ticket:", error);
            setBookingStatus("Booking failed. Please try again.");
        }
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-detail">
            <h1>{movie.Title}</h1>
            <p>Genre: {movie.Genre}</p>
            <p>Duration: {movie.Duration} minutes</p>
            <p>Description: {movie.Description}</p>

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
                        {showTimes.map((show) => (
                            <option key={show.ShowtimeID} value={show.ShowtimeID}>
                                {new Date(show.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                {" to "} 
                                {new Date(show.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </option>
                        ))}
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

            {bookingStatus && <p>{bookingStatus}</p>}
        </div>
    );
}

export default MovieDetail;
