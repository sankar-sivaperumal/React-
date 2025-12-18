import { Link } from "react-router-dom";
import { useAuth } from "./Access/AuthContext";

function NavBar() {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="navbar navbar-expand-sm bg-primary">
      <div className="container-fluid">
        <ul className="navbar-nav">

         
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signup">
                  Signup
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">
                  Login
                </Link>
              </li>
            </>
          )}

          
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Formpage">
                  Form Page
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/students">
                  Students
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/enrollments">
                  Enrollments
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/courses">
                  Courses
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/student-details">
                  Student Records
                </Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
