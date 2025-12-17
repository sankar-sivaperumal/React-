/* /* import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import Student from './student';
import Course from './course';
import Enrollment from './enrollment';
import StudentDeatils from './studentDetails';
import FormsLayout from './Forms/formslayout';

// import Login from './login';

export default function Main() {
  return (
    <Router>
     
      <NavBar />  
      <div className="container mt-3">  
        <Routes>
          <Route path="/students" element={<Student />} />  
          <Route path="/courses" element={<Course />} /> 
          <Route path="/enrollments" element={<Enrollment />} />  
          <Route path="/studentDetails" element={<StudentDeatils />} />
          <Route path="/formslayout" element={<FormsLayout />} />
        </Routes>
      </div>
  
    </Router>
  );
} */

/* import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Student from './student';
import Course from './course';
import Enrollment from './enrollment';
import StudentDetails from './studentDetails';
import FormsLayout from './Forms/formslayout';

export default function Main() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/students" element={<Student />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/enrollments" element={<Enrollment />} />
          <Route path="/studentDetails" element={<StudentDetails />} />
          <Route path="/formslayout/*" element={<FormsLayout />} />
        </Routes>
      </div>
    </Router>
  );
}
 */

/* import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import Student from './student';
import Course from './course';
import Enrollment from './enrollment';
import StudentDetails from './studentDetails';
import FormsLayout from './Forms/formslayout';
import NextPage from './Forms/NextPage'; 

export default function Main() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/students" element={<Student />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/enrollments" element={<Enrollment />} />
          <Route path="/studentDetails" element={<StudentDetails />} />
          <Route path="/formslayout/*" element={<FormsLayout />} />
          <Route path="/NextPage" element={<NextPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
  */



/* import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import Student from './student';
import Course from './course';
import Enrollment from './enrollment';
import StudentDetails from './studentDetails';
import FormsLayout from './Forms/formslayout';
import { FormProvider } from './Forms/formcontext'; 

export default function Main() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/students" element={<Student />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/enrollments" element={<Enrollment />} />
          <Route path="/studentDetails" element={<StudentDetails />} />
          
    
          <Route 
            path="/formslayout/*" 
            element={
              <FormProvider>
                <FormsLayout />
              </FormProvider>
            } 
          />

        
        </Routes>
      </div>
    </Router>
  );
}
 */

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import Signup from './Signup';  
import Login from './login';    

import Students from './student';       
import Courses from './course';         
import Enrollments from './enrollment'; 
import StudentDetails from './studentDetails';  
import FormsLayout from './Forms/formslayout'; 
import { FormProvider } from './Forms/formcontext'; 

export default function Main() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-3">
        <Routes>
         
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/student-details" element={<StudentDetails />} />
          <Route 
            path="/formslayout/*" 
            element={
              <FormProvider>
                <FormsLayout />
              </FormProvider>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
