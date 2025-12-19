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

export default function StudentDetails() {
  const [data, setData] = useState<Course[]>([]);
  const [openCourseId, setOpenCourseId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // Delete records
  async function handleDelete(studentId: number) {
    const response = await fetch(
      `http://localhost:5000/students/${studentId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete student");
    }

    // Remove student from UI after delete
    setData((prev) =>
      prev.map((course) => ({
        ...course,
        enrollments: course.enrollments.filter(
          (e) => e.students.student_id !== studentId
        ),
      }))
    );
  }

 //Edit records
  async function handleEdit(studentId: number, updatedData: Student) {
    const response = await fetch(
      `http://localhost:5000/students/${studentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update student");
    }
  }

  useEffect(() => {
    fetch("http://localhost:5000/courses/")
      .then((res) => res.json())
      .then((courses: Course[]) => {
        setData(courses);
        if (courses.length) setOpenCourseId(courses[0].course_id);
      });
  }, []);

  const toggle = (id: number) => {
    setOpenCourseId((prev) => (prev === id ? null : id));
  };

  const filteredEnrollments = (course: Course) =>
    course.enrollments.filter(
      (e) =>
        e.students.name.toLowerCase().includes(search.toLowerCase()) ||
        e.students.city.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="container">
      <h2 className="title">Student Records</h2>

      <input
        className="search"
        placeholder="Search student name or city"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {data.map((course) => {
        const isOpen = openCourseId === course.course_id;
        const rows = filteredEnrollments(course);

        return (
          <div key={course.course_id} className="course-card">
            <div
              className="course-header"
              onClick={() => toggle(course.course_id)}
            >
              <span>
                {course.course_name} — {course.teacher_name}
              </span>
              <span>
                {rows.length} students {isOpen ? "▲" : "▼"}
              </span>
            </div>

            {isOpen && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Enroll ID</th>
                    <th>Name</th>
                    <th>Marks</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>City</th>
                    <th>DOB</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => (
                    <tr key={e.enrollment_id}>
                      <td>{e.enrollment_id}</td>
                      <td>{e.students.name}</td>
                      <td>{e.marks}</td>
                      <td>{e.students.age}</td>
                      <td>{e.students.gender}</td>
                      <td>{e.students.city}</td>
                      <td>{e.students.date_of_birth}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleEdit(e.students.student_id, e.students)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(e.students.student_id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
