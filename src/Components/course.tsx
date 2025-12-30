import { useEffect, useState } from "react";
import "../App.css";

interface Courses {
    course_id: number;
    course_name: string;
    teacher_name: string;
}

function Courses() {
  const [data, setData] = useState<Courses[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/courses/")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch(Error)
  }, []);

  return (
    <>
      <h2>Courses</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Teacher Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((course) => (
              <tr key={course.course_id}>
                <td>{course.course_id}</td>
                <td>{course.course_name}</td>
                <td>{course.teacher_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Courses;
