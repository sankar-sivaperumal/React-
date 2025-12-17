/* import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-primary text-color-black">
      <div className="container-fluid">
        <ul className="navbar-nav ">
          <li><Link className="nav-link" to="/students">Students</Link></li>
          <li><Link className="nav-link" to="/courses">Courses</Link></li>
          <li><Link className="nav-link" to="/enrollments">Enrollments</Link></li>
          <li><Link className="nav-link" to="/studentDetails">StudentRecords</Link></li>
          <li><Link className="nav-link" to="/formslayout/FormPage">FormPage</Link></li>
        </ul>
      </div>
    </nav>
  </>
  );
}

export default NavBar;
 */


/* import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-sm bg-primary text-color-black">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li><Link className="nav-link" to="/students">Students</Link></li>
          <li><Link className="nav-link" to="/courses">Courses</Link></li>
          <li><Link className="nav-link" to="/enrollments">Enrollments</Link></li>
          <li><Link className="nav-link" to="/studentDetails">Student Records</Link></li>
         
          <li><Link className="nav-link" to="/formslayout/Formpage">Form Page</Link></li>  
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
 */

import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-sm bg-primary text-color-black">
      <div className="container-fluid">
        <ul className="navbar-nav">
          {/* Existing Links */}
          <li><Link className="nav-link" to="/students">Students</Link></li>
          <li><Link className="nav-link" to="/courses">Courses</Link></li>
          <li><Link className="nav-link" to="/enrollments">Enrollments</Link></li>
          <li><Link className="nav-link" to="/student-details">Student Records</Link></li>
          
          {/* New Links */}
          <li><Link className="nav-link" to="/signup">Signup</Link></li>  
          <li><Link className="nav-link" to="/login">Login</Link></li>   
        
          
          {/* Update for FormsLayout */}
          <li><Link className="nav-link" to="/formslayout/Formpage">Form Page</Link></li>  
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
