import React, { useEffect, useState } from 'react';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3001/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'accessToken': sessionStorage.getItem("accessToken") // Changed to 'accessToken'
                    }
                });
                
                const data = await response.json();
                if (data.error) {
                    // Handle case where token is invalid or any other error occurs
                    setError(data.error);
                } else {
                    // Set user data if successfully fetched
                    setUserData(data);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('An error occurred while fetching profile information.');
            }
        };

        fetchUserData();
    }, []);

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="profile-wrapper">
            {userData ? (
                <div className="profile-details">
                    <h1>Profile</h1>
                    <p><strong>Username:</strong> {userData.UserName}</p>
                    <p><strong>Name:</strong> {userData.Name}</p>
                    <p><strong>Email:</strong> {userData.Email}</p>
                    <p><strong>Phone:</strong> {userData.Phone}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
