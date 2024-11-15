import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PaymentProcessing() {
    const { bookingID } = useParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate a payment processing delay
        setTimeout(() => {
            setIsProcessing(false); // Stop processing after 3 seconds
        }, 3000);
    }, []);

    const handleConfirmPayment = async () => {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            alert("You must be logged in to confirm payment.");
            return;
        }
        console.log(bookingID);

        try {
            const response = await fetch(`http://localhost:3001/bookings/${bookingID}/confirm-payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'accessToken': token
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Payment confirmed, redirect to a success page or dashboard
                navigate(`/profile`);
            } else {
                alert("Payment confirmation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Payment confirmation failed. Please try again.");
        }
    };

    return (
        <div className="payment-processing">
            <h2>Processing Payment...</h2>
            {isProcessing ? (
                <div>Buffering animation here...</div>
            ) : (
                <button onClick={handleConfirmPayment}>Confirm Payment</button>
            )}
        </div>
    );
}

export default PaymentProcessing;
