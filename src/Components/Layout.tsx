import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Signup from "./Login/Signup";
import Login from "./Login/login";
import Student from "./student";
import Courses from "./course";
import Enrollments from "./enrollment";
import StudentDetails from "./studentDetails";
import { FormProvider } from "./Forms/formcontext";
import { AuthProvider } from "../Components/Access/AuthContext";
import ProtectedRoute from "./Access/FlowGuard";
import FormPage from "./Forms/Formpage";

const Main: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NavBar />

        <div className="container mt-3">
          <Routes>
            
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

           
            <Route
              path="/Formpage/*"
              element={
                <ProtectedRoute>
                  <FormProvider>
                    <FormPage />
                  </FormProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <Student />
                </ProtectedRoute>
              }
            />

            <Route
              path="/enrollments"
              element={
                <ProtectedRoute>
                  <Enrollments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-details"
              element={
                <ProtectedRoute>
                  <StudentDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default Main;
