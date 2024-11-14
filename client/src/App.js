import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Registration from './pages/LoginRegister/RegistrationForm';
import Login from './pages/LoginRegister/LoginForm';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import CreateShowtime from './pages/CreateShowtime'; // Import the CreateShowtime component
import CreateMovie from './pages/CreateMovie'; // Import the CreateMovie component
import AddTheater from './pages/AddTheater'; // Import the CreateMovie component


function LogoutLink({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove accessToken from sessionStorage to log the user out
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/login');  // Redirect to login page after logout
  };

  return (
    <Link to="/login" onClick={handleLogout}>Logout</Link>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for accessToken in sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="navbar">
          <Link to="/home"> Home Page </Link>
          {!isLoggedIn ? (
            <>
              <Link to="/register"> Register </Link>
              <Link to="/login"> Login </Link>
            </>
          ) : (
            <>
              <Link to="/profile"> Profile </Link>
              <LogoutLink setIsLoggedIn={setIsLoggedIn} />
              {/* Add link to create showtime (only visible to admins) */}
              <Link to="/create-showtime">Create Showtime</Link>
              <Link to="/create-movie">Create Movie</Link>
              <Link to="/add-theater">Add Theater</Link>
            </>
          )}
        </div>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />
          {/* Add the route for CreateShowtime */}
          <Route path="/create-showtime" element={<CreateShowtime />} />
          <Route path="/create-movie" element={<CreateMovie />} />
          <Route path="/add-theater" element={<AddTheater />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
