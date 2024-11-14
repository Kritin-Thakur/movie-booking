import React, { useState } from 'react';

function AddTheater() {
    const [TheaterName, setTheaterName] = useState('');
    const [Location, setLocation] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure that TheaterName and Location are not empty
        if (!TheaterName || !Location) {
            setStatus('Both Theater Name and Location are required.');
            return;
        }

        const dataToSend = {
            TheaterName,
            Location,
        };

        console.log("Data being sent to backend:", dataToSend); // Log the JSON data

        try {
            const response = await fetch('http://localhost:3001/theaters/addtheater', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            if (response.ok) {
                setStatus('Theater created successfully');
                setTheaterName('');
                setLocation('');
            } else {
                setStatus(data.error || 'Failed to create theater');
            }
        } catch (error) {
            console.error("Error creating theater:", error);
            setStatus('Error creating theater');
        }
    };

    return (
        <div>
            <h1>Add New Theater</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Theater Name:</label>
                    <input
                        type="text"
                        value={TheaterName}
                        onChange={(e) => setTheaterName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={Location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Create Theater</button>
            </form>

            {status && <p>{status}</p>}
        </div>
    );
}

export default AddTheater;
