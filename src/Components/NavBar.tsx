import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Access/AuthContext";

function NavBar() {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
  
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          {!isLoggedIn && (
            <>
              <li><Link to="/signup">Signup</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}

          {isLoggedIn && (
            <>
              <li><Link to="/Formpage">Form Page</Link></li>
              <li><Link to="/students">Students</Link></li>
              <li><Link to="/enrollments">Enrollments</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/student-details">Student Records</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
