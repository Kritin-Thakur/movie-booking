import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                navigate('/login'); // Redirect to login if not logged in
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/bookings/showbookings', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'accessToken': accessToken,
                    }
                });

                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setBookings(data); // Store fetched bookings
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('An error occurred while fetching bookings.');
            }
        };

        fetchBookings();
    }, [navigate]);

    return (
        <div className="bookings-wrapper">
            <h1>Your Bookings</h1>
            {error && <div className="error">{error}</div>}
            {bookings.length > 0 ? (
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>S. No</th>
                            <th>Movie Title</th>
                            <th>Theater Name</th>
                            <th>Screen</th>
                            <th>Showtime</th>
                            <th>End Time</th>
                            <th>Total Amount</th>
                            <th>Payment Status</th>
                            <th>Booking Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.BookingID}>
                                <td>{booking.RowNumber}</td>
                                <td>{booking.Title}</td>
                                <td>{booking.TheaterName}</td>
                                <td>{booking.ScreenNumber}</td>
                                <td>{new Date(booking.StartTime).toLocaleString()}</td>
                                <td>{new Date(booking.EndTime).toLocaleString()}</td>
                                <td>${booking.TotalAmount}</td>
                                <td>{booking.PaymentStatus}</td>
                                <td>{new Date(booking.BookingDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
}

export default Bookings;
