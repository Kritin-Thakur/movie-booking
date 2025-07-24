import React, { useState } from 'react';


function AddMovie() {
    const [Title, setTitle] = useState('');
    const [Genre, setGenre] = useState('');
    const [Duration, setDuration] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const movieDuration = parseInt(Duration, 10);
        if (isNaN(movieDuration)) {
            setStatus('Duration must be a valid integer.');
            return;
        }

        const dataToSend = {
            Title,
            Genre,
            Duration: movieDuration,
        };

        try {
            const response = await fetch('http://localhost:3001/movies/addmovie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            if (response.ok) {
                setStatus('Movie created successfully');
                setTitle('');
                setGenre('');
                setDuration('');
            } else {
                setStatus(data.error || 'Failed to create movie');
            }
        } catch (error) {
            setStatus('Error creating movie');
        }
    };

    return (
        <div className="add-movie-wrapper">
            <form className="add-movie-form" onSubmit={handleSubmit}>
                <h1>Add New Movie</h1>

                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={Title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Genre:</label>
                    <input
                        type="text"
                        value={Genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Duration (minutes):</label>
                    <input
                        type="number"
                        value={Duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Create Movie</button>

                {status && (
                    <p className={status.includes('success') ? 'success' : 'error'}>
                        {status}
                    </p>
                )}
            </form>
        </div>
    );
}

export default AddMovie;
