import { useEffect, useState } from "react";
import "../App.css";

interface Student {
  student_id: number;
  name: string;
  age: number;
  gender: string;
  city: string;
  date_of_birth: string;
  files: string[];
}

interface Enrollment {
  enrollment_id: number;
  marks: string;
  students: Student;
}

interface Course {
  course_id: number;
  course_name: string;
  teacher_name: string;
  enrollments: Enrollment[];
}

function StudentDetails() {
  const [data, setData] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/courses/")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });
  }, []);

 
  const handleEdit = (enrollment: Enrollment) => {
    console.log("Edit clicked for:", enrollment);
 
  };

  const handleDelete = (enrollmentId: number) => {
    console.log("Delete clicked for enrollment ID:", enrollmentId);
 
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Student Records</h2>

      {data.map((course) => (
        <div key={course.course_id} style={{ marginBottom: "20px" }}>
          <table border={2} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th colSpan={8} style={{ textAlign: "center" }}>
                  {course.course_name} - <span>{course.teacher_name}</span>
                  <br />
                  <span>Course ID: {course.course_id}</span>
                </th>
              </tr>
              <tr>
                <th>Enrollment ID</th>
                <th>Student Name</th>
                <th>Marks</th>
                <th>Age</th>
                <th>Gender</th>
                <th>City</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {course.enrollments.map((enrollment) => (
                <tr key={enrollment.enrollment_id}>
                  <td>{enrollment.enrollment_id}</td>
                  <td>{enrollment.students.name}</td>
                  <td>{enrollment.marks}</td>
                  <td>{enrollment.students.age}</td>
                  <td>{enrollment.students.gender}</td>
                  <td>{enrollment.students.city}</td>
                  <td>{enrollment.students.date_of_birth}</td>
                  <td>
                    <button className="btn me-3"style={{ backgroundColor: '#3f4db8', color: 'white', borderColor: '#3f4db8' }} onClick={() => handleEdit(enrollment)}>Edit</button>
                    <button  className="btn btn-danger"onClick={() => handleDelete(enrollment.enrollment_id)}> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

export default StudentDetails;
