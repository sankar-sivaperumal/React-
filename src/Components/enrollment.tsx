
import { useEffect, useState } from "react";
import "../App.css";
interface Student {
  student_id: number;
  name: string;
}
interface Enrollment {
  enrollment_id: number;
  marks: string;
  students: Student | null;  
}
function Enrollment() {
  const [data, setData] = useState<Enrollment[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/enrollments/")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching enrollment data:", error);
      });
  }, []);

  return (
    <>
      <h2>Enrollments</h2>
      <table border={2}>
        <thead>
          <tr>
            <th>Enrollment ID</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {data.map((enrollment) => (
            <tr key={enrollment.enrollment_id}>
              <td>{enrollment.enrollment_id}</td>
              <td>{enrollment.students?.student_id }</td> 
              <td>{enrollment.students?.name}</td>
              <td>{enrollment.marks}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
export default Enrollment; 


