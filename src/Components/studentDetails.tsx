import { useEffect, useState } from "react";
import ConfirmDeleteModal from "../Components/Model/ConfirmDeleteModal";
import EditStudentModal from "../Components/Model/EditModel";
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

  // Delete states
  const [confirmStudentId, setConfirmStudentId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Edit states
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Student>>({});
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Fetch courses
  useEffect(() => {
    fetch("http://localhost:5000/courses/")
      .then((res) => res.json())
      .then((courses: Course[]) => {
        setData(courses);
        if (courses.length) setOpenCourseId(courses[0].course_id);
      });
  }, []);

  const toggle = (id: number) => setOpenCourseId((prev) => (prev === id ? null : id));

  const filteredEnrollments = (course: Course) =>
    course.enrollments.filter((e) => {
      const name = e.students?.name ?? "";
      const city = e.students?.city ?? "";
      const searchTerm = search ?? "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  // Delete student
  const handleDelete = async (studentId: number) => {
    try {
      setLoadingDelete(true);
      const res = await fetch(`http://localhost:5000/students/${studentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      setData((prev) =>
        prev.map((course) => ({
          ...course,
          enrollments: course.enrollments.filter((e) => e.students.student_id !== studentId),
        }))
      );
      setConfirmStudentId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  // Edit Data
  const handleEditSubmit = async () => {
    if (editingStudentId === null) return;

    const studentId = Number(editingStudentId);
    if (isNaN(studentId)) return;

    try {
      setLoadingEdit(true);

      //  update table immediately
      setData((prev) =>
        prev.map((course) => ({
          ...course,
          enrollments: course.enrollments.map((e) =>
            e.students.student_id === studentId
              ? { ...e, students: { ...e.students, ...editFormData } }
              : e
          ),
        }))
      );

      //  Send PUT request
      const res = await fetch(`http://localhost:5000/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) throw new Error("Failed to update");

      setEditingStudentId(null);
      setEditFormData({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEdit(false);
    }
  };
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
            <div className="course-header" onClick={() => toggle(course.course_id)}>
              <span>{course.course_name} — {course.teacher_name}</span>
              <span>{rows.length} students {isOpen ? "▲" : "▼"}</span>
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
                            onClick={() => {
                              if (e.students.student_id != null) {
                                setEditingStudentId(e.students.student_id);
                                setEditFormData({ ...e.students });
                              } else {
                                console.error("Invalid student_id:", e.students);
                              }
                            }}
                          >
                            Edit
                          </button>

                        <button
                          className="btn-delete"
                          onClick={() => setConfirmStudentId(e.students.student_id)}
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

      <ConfirmDeleteModal
        open={confirmStudentId !== null}
        loading={loadingDelete}
        onCancel={() => setConfirmStudentId(null)}
        onConfirm={() => confirmStudentId !== null && handleDelete(confirmStudentId)}
      />

      <EditStudentModal
        open={editingStudentId !== null}
        loading={loadingEdit}
        studentData={editFormData}
        onChange={(updated) => setEditFormData(updated)}
        onCancel={() => setEditingStudentId(null)}
        onSave={handleEditSubmit}
      />
    </div>
  );
}
