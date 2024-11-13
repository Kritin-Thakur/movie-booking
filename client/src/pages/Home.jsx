import React, { useEffect, useState } from 'react';

function Home() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch movies from backend based on search term
    const fetchMovies = async (query = "") => {
        try {
            const response = await fetch(`http://localhost:3001/movies/search?query=${query}`);
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    // Fetch all movies on initial load
    useEffect(() => {
        fetchMovies();
    }, []);

    // Handle search input change
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        fetchMovies(e.target.value); // Fetch movies based on search term
    };

    return (
        <div className="home">
            <h1>Available Movies</h1>
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <div className="movies-list">
                {movies.map((movie) => (
                    <div key={movie.MovieID} className="movie-card">
                        <h2>{movie.Title}</h2>
                        <p>Genre: {movie.Genre}</p>
                        <p>Duration: {movie.Duration} minutes</p>
                        {/* Add more movie details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
