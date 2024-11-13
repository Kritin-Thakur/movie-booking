import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Registration from './pages/LoginRegister/RegistrationForm';
import Login from './pages/LoginRegister/LoginForm';
import Profile from './pages/Profile'

function App() {
  return (
    <div className="App">
      <Router>
        <div className="navbar">
          <Link to="/"> Home Page </Link>
          <Link to="/register"> Register </Link>
          <Link to="/login"> Login </Link>
          <Link to="/profile"> Profile </Link>
        </div>
        <Routes>
          <Route path="/register" element ={<Registration />}/>
          <Route path="/login" element ={<Login />}/>
          <Route path="/profile" element ={<Profile />}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
