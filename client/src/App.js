import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Registration from './pages/LoginRegister/RegistrationForm';
import Login from './pages/LoginRegister/LoginForm';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import CreateShowtime from './pages/CreateShowtime';
import CreateMovie from './pages/CreateMovie';
import AddTheater from './pages/AddTheater';
import WelcomePage from './pages/WelcomePage';
import PaymentProcessing from './pages/PaymentProcessing';
import UserBookings from './pages/UserBookings';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const location = useLocation();

  // Navbar rendering logic
  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  // Adjusting the navbar visibility logic
  const shouldShowNavbar = !["/welcome", "/login", "/register"].includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNavbar && (
        <div className="navbar">
          <Link to="/home">Home Page</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/welcome" onClick={handleLogout}>Logout</Link>
              <Link to="/create-showtime">Create Showtime</Link>
              <Link to="/create-movie">Create Movie</Link>
              <Link to="/add-theater">Add Theater</Link>
            </>
          )}
        </div>
      )}

      <Routes>
        {/* Set the initial page to /welcome */}
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/create-showtime" element={<CreateShowtime />} />
        <Route path="/create-movie" element={<CreateMovie />} />
        <Route path="/add-theater" element={<AddTheater />} />
        <Route path="/bookings" element={<UserBookings />} />
        <Route path="/payment-processing/:bookingID" element={<PaymentProcessing />} />

      </Routes>
    </div>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
