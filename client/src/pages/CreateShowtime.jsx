import React, { useState, useEffect } from 'react';

function CreateShowtime() {
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);  // State for theaters
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');
    const [movieId, setMovieId] = useState('');  // Store selected MovieID
    const [screenNumber, setScreenNumber] = useState('');  // Store selected ScreenNumber
    const [theaterId, setTheaterId] = useState('');  // Store selected TheaterID
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Fetch the list of movies and theaters
        const fetchMovies = async () => {
            const response = await fetch('http://localhost:3001/movies/showmovies');
            const data = await response.json();
            setMovies(data);  // Store movies with MovieID
        };

        const fetchTheaters = async () => {
            const response = await fetch('http://localhost:3001/theaters');
            const data = await response.json();
            setTheaters(data);  // Store theaters with TheaterID
        };

        fetchMovies();
        fetchTheaters();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure screenNumber is a number
        const screenNum = parseInt(screenNumber, 10);
        const movieID = parseInt(movieId, 10);
        const theaterID = parseInt(theaterId, 10);
    
        const dataToSend = {
            movieId: movieID,  // Send MovieID as an integer
            screenNumber: screenNum,  // Send ScreenNumber as a number
            theaterId: theaterID,  // Send TheaterID as an integer
            startTime,
            endTime,
            date,
        };
    
        console.log("Data being sent to backend:", dataToSend);  // Log the JSON data
    
        try {
            const response = await fetch('http://localhost:3001/showtimes/createShowtime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
    
            const data = await response.json();
            if (response.ok) {
                setStatus('Showtime created successfully');
            } else {
                setStatus(data.error || 'Failed to create showtime');
            }
        } catch (error) {
            console.error("Error creating showtime:", error);
            setStatus('Error creating showtime');
        }
    };
    
    return (
        <div>
            <h1>Create Showtime</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Movie:</label>
                    <select value={movieId} onChange={(e) => setMovieId(e.target.value)}>
                        <option value="">Select a movie</option>
                        {movies.map((movie) => (
                            <option key={movie.MovieID} value={movie.MovieID}>
                                {movie.Title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Screen:</label>
                    <select value={screenNumber} onChange={(e) => setScreenNumber(e.target.value)}>
                        <option value="">Select a screen</option>
                        {[1, 2, 3, 4, 5].map((screen) => (
                            <option key={screen} value={screen}>
                                Screen {screen}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Theater:</label>
                    <select value={theaterId} onChange={(e) => setTheaterId(e.target.value)}>
                        <option value="">Select a theater</option>
                        {theaters.map((theater) => (
                            <option key={theater.TheaterID} value={theater.TheaterID}>
                                {theater.TheaterName} - {theater.Location}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Start Time:</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>

                <div>
                    <label>End Time:</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>

                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <button type="submit">Create Showtime</button>
            </form>

            {status && <p>{status}</p>}
        </div>
    );
}

export default CreateShowtime;
