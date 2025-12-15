import { useEffect, useState } from "react";
import "../App.css"; 


interface Student {
  student_id: number; 
  name: string;
  age: number;
  gender: string;
  date_of_birth: string;
  city: string;
}

function Student() {
  const [data, setData] = useState<Student[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, []);

  return (
    <>
      <h2>Students</h2>
      
        <table border={2}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {data.map((student) => (
              <tr key={student.student_id}> 
                <td>{student.student_id}</td> 
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.date_of_birth}</td>
                <td>{student.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
     
    </>
  );
}

export default Student;
