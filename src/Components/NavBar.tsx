import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-primary text-color-black">
      <div className="container-fluid">
        <ul className="navbar-nav ">
          <li><Link className="nav-link" to="/students">Students</Link></li>
          <li><Link className="nav-link" to="/courses">Courses</Link></li>
          <li><Link className="nav-link" to="/enrollments">Enrollments</Link></li>
        </ul>
      </div>
    </nav>
  </>
  );
}

export default NavBar;
