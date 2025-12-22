import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Access/AuthContext";
import { toast } from "react-toastify";

const NavBar: React.FC = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out");
    navigate("/login");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector(".nav-container");
      if (nav && !nav.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
  <div className="nav-container">

    {/* Hamburger */}
    <div
      className="hamburger"
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>

    {/* LEFT NAV LINKS */}
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

    {/* RIGHT LOGOUT SECTION */}
    {isLoggedIn && (
      <div className="logout-section">
        <span className="user-email ms-5">{currentUser?.email}</span>
        <button className="btn btn-sm btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}
  </div>
</nav>

  );
};

export default NavBar;
