import React, { useState } from 'react';
import './styles.css';
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
    // State to store the form data
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // State to handle any errors
    const [error, setError] = useState('');

    // Handle input changes and update form data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!formData.username || !formData.password) {
            setError('Both fields are required.');
            return;
        }

        // Send the POST request to the backend API
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserName: formData.username,
                    Password: formData.password
                })
            });

            // Parse the response data
            const data = await response.json();
            
            if (response.status === 200) {
                // Successful login
                console.log('Login successful:', data.accessToken);
                sessionStorage.setItem("accessToken", data.accessToken);
                // You can redirect or show a success message here
                // For example, you can use React Router to redirect to a dashboard:
                // history.push('/dashboard');
            } else {
                // Handle errors returned from the server
                console.error('Login failed:', data);
                setError(data.error || 'Login failed. Please try again.');
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

                {/* Show error message if there's an error */}
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
