import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);  // Track login status
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // Use history for navigation

    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUserData = async () => {
            const accessToken = sessionStorage.getItem("accessToken");

            if (!accessToken) {
                setIsLoggedIn(false);  // If no access token, set isLoggedIn to false
                return;  // Do not continue fetching if no token
            }

            try {
                const response = await fetch('http://localhost:3001/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'accessToken': accessToken
                    }
                });
                
                const data = await response.json();
                if (data.error) {
                    // Handle case where token is invalid or any other error occurs
                    setError(data.error);
                    setIsLoggedIn(false);  // If the error is about being logged out, set to false
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


    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword) {
            setPasswordError("Both current and new passwords are required.");
            return;
        }

        const accessToken = sessionStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:3001/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'accessToken': accessToken,  // Send the token for authentication
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);  // Success message
                setPasswordError('');  // Clear previous error
            } else {
                setPasswordError(data.error || "Failed to update password");
                setMessage('');
            }
        } catch (err) {
            console.error("Error updating password:", err);
            setPasswordError("An error occurred. Please try again later.");
            setMessage('');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="profile-wrapper">
                <button onClick={() => window.location.href = '/register'}>
                    Create Account
                </button>
            </div>
        );
    }

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

                    <h2>Update Password</h2>
                    {/* Password Update Form */}
                    <form onSubmit={handlePasswordChange}>
                        <div>
                            <label>Current Password:</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>New Password:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        {passwordError && <div className="error">{passwordError}</div>}
                        {message && <div className="success">{message}</div>}
                        <button type="submit">Update Password</button>
                    </form>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
