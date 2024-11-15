import React, { useState } from 'react';
import './styles.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setIsAdmin }) {  // Add setIsAdmin prop
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError('Both fields are required.');
            return;
        }

        try {
            // Login request
            const loginResponse = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserName: formData.username,
                    Password: formData.password
                })
            });

            const loginData = await loginResponse.json();
            
            if (loginResponse.status === 200 && loginData.accessToken) {
                sessionStorage.setItem("accessToken", loginData.accessToken);
                
                // Immediately fetch user profile to check admin status
                const profileResponse = await fetch('http://localhost:3001/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'accessToken': loginData.accessToken
                    }
                });
                
                const profileData = await profileResponse.json();
                
                // Store admin status and update states
                sessionStorage.setItem('isAdmin', profileData.isAdmin);
                setIsAdmin(profileData.isAdmin);
                setIsLoggedIn(true);
                
                navigate('/profile');
            } else {
                console.error('Login failed:', loginData);
                setError(loginData.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>

                {error && <div className="error">{error}</div>}

                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" /> Remember me </label>
                    <a href="#"> Forgot Password? </a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="../register"> Register </a></p>
                </div>
            </form>
        </div>
    );
}

export default Login;