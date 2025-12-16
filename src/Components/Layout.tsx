import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import Student from './student';
import Course from './course';
import Enrollment from './enrollment';
import StudentDeatils from './studentDetails';
// import Login from './login';

export default function Main() {
  return (
    <Router>
      {/* <Login /> */}
      <NavBar />  
      <div className="container mt-3">  
        <Routes>
          <Route path="/students" element={<Student />} />  
          <Route path="/courses" element={<Course />} /> 
          <Route path="/enrollments" element={<Enrollment />} />  
          <Route path="/studentDetails" element={<StudentDeatils />} />
        </Routes>
      </div>
   
    </Router>
  );
}