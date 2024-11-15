import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Registration from './pages/LoginRegister/RegistrationForm';
import Login from './pages/LoginRegister/LoginForm';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import CreateShowtime from './pages/CreateShowtime';
import CreateMovie from './pages/CreateMovie';
import AddTheater from './pages/AddTheater';
import PaymentProcessing from './pages/PaymentProcessing';
import UserBookings from './pages/UserBookings';

function LogoutLink({ setIsLoggedIn, setIsAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <Link to="/login" onClick={handleLogout}>Logout</Link>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);

      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:3001/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'accessToken': token
            }
          });
          const data = await response.json();
          if (data && data.isAdmin !== undefined) {
            setIsAdmin(data.isAdmin);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false); 
        }
      };

      fetchUserData();
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setLoading(false); 
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <div className="App">
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
              <LogoutLink setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />
              {isAdmin ? (
                <>
                  <Link to="/create-showtime">Create Showtime</Link>
                  <Link to="/create-movie">Create Movie</Link>
                  <Link to="/add-theater">Add Theater</Link>
                </>
              ) : (
              <>
                  
              </>
            )}


            </>
          )}
        </div>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />
          <Route path="/create-showtime" element={<CreateShowtime />} />
          <Route path="/create-movie" element={<CreateMovie />} />
          <Route path="/add-theater" element={<AddTheater />} />
          <Route path="/payment-processing/:bookingID" element={<PaymentProcessing />} />
          <Route path="/bookings" element={<UserBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
