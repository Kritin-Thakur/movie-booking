import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMovies = async (query = "") => {
        try {
            const response = await fetch(`http://localhost:3001/movies/search?query=${query}`);
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        fetchMovies(e.target.value);
    };

    return (
        <div className="home">
            <h1>Available Movies</h1>
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input" 
            />
            <div className="movies-list">
                {movies.map((movie) => (
                    <Link 
                        key={movie.MovieID} 
                        to={`/movie/${movie.MovieID}`} 
                        className="movie-card-link"
                    >
                        <div className="movie-card">
                            <img src="https://imgs.search.brave.com/ZCezEOzIo3AurSwUUO6Qzhp5Ai8DPFQVGlJXbpgO4cQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2FlL2E0/LzRkL2FlYTQ0ZDhk/YTU4OTE2YjllNmU0/NjY3NjRmODljYWY2/LmpwZw" alt="Movie Poster" className="movie-card-image" />
                            <h2>{movie.Title}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;
