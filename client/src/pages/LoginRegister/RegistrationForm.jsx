import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles.css';

function Registration() {
    // State to store the form values
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // State to handle validation errors
    const [errors, setErrors] = useState('');

    // State to handle success confirmation
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();  // Use useNavigate for redirection

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Validate form inputs
    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setErrors('Passwords do not match.');
            return false;
        }
        if (!formData.name || !formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            setErrors('All fields are required.');
            return false;
        }
        setErrors('');
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before sending the data
        if (!validateForm()) return;

        // Send the POST request to the backend API
        try {
            const response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserName: formData.username,
                    Name: formData.name,
                    Email: formData.email,
                    Phone: formData.phone,
                    Password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful registration (e.g., redirect or display success message)
                console.log('User registered successfully:', data);
                setSuccessMessage('Registration successful! Please log in.');
                setErrors('');  // Clear any previous errors
                setTimeout(() => {
                    // After 3 seconds, redirect to login page
                    navigate('/login');
                }, 1500);
            } else {
                // Handle error response from the server
                console.error('Error during registration:', data);
                setErrors(data.error || 'Registration failed. Please try again.');
                setSuccessMessage('');  // Clear success message if registration fails
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors('An error occurred. Please try again later.');
            setSuccessMessage('');  // Clear success message if there is an error
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Register!</h1>

                {/* Display error message if any */}
                {errors && <div className="error">{errors}</div>}
                {successMessage && <div className="success">{successMessage}</div>}

                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                    />
                </div>

                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required 
                    />
                </div>

                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                    />
                </div>

                <div className="input-box">
                    <input 
                        type="tel" 
                        placeholder="Phone No" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                    />
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
                </div>

                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="Retype Password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required 
                    />
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;


