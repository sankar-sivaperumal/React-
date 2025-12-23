import { useEffect, useState } from "react";
import ConfirmDeleteModal from "../Components/Model/ConfirmDeleteModal";
import EditStudentModal from "../Components/Model/EditModel";
import { toast } from "react-toastify";
import "../App.css";
import api from "./Forms/api";

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
  const [confirmStudentId, setConfirmStudentId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Student>>({});
  const [loadingEdit, setLoadingEdit] = useState(false);
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


  // 2. Fetch logic using 'api' instance
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/");
      const courses: Course[] = res.data; 
      setData(courses);
      if (courses.length && openCourseId === null) setOpenCourseId(courses[0].course_id);
    } catch (err: any) {
      console.error("Fetch failed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggle = (id: number) =>
    setOpenCourseId((prev) => (prev === id ? null : id));

  const filteredEnrollments = (course: Course) =>
    course.enrollments.filter((e) => {
      const name = e.students?.name ?? "";
      const city = e.students?.city ?? "";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        city.toLowerCase().includes(search.toLowerCase())
      );
    });

  // 3. DELETE function using 'api'
  const handleDelete = async (studentId: number) => {
    try {
      setLoadingDelete(true);
      
      await api.delete(`/students/${studentId}`);

      toast.success("Student deleted successfully");
      setConfirmStudentId(null);

      await sleep(3000);
      await fetchCourses(); 
    } catch (err: any) {
      console.error("Delete failed:", err.response?.data || err.message);
      toast.error("Failed to delete student: Unauthorized");
    } finally {
      setLoadingDelete(false);
    }
  };

  // 4. EDIT/PUT function using 'api'
  const handleEditSubmit = async () => {
    if (editingStudentId === null) return;

    try {
      setLoadingEdit(true);
      
      await api.put(`/students/${editingStudentId}`, editFormData);

      toast.success("Student updated successfully");
      setEditingStudentId(null);
      setEditFormData({});
      await sleep(2000);
      await fetchCourses(); 
    } catch (err: any) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error("Failed to update student: Unauthorized");
    } finally {
      setLoadingEdit(false);
    }
  };

   // UI

  return (
    <div className="container">
      <h2 className="title">Student Records</h2>

      <input
        id="student-search"
        name="search"
        type="search"
        className="search"
        placeholder="Search student name or city"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="search"
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
              <div className="table-wrapper">
                <table >
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
                            disabled={loadingEdit}
                            onClick={() => {
                              setEditingStudentId(e.students.student_id);
                              setEditFormData({ ...e.students });
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            disabled={loadingDelete}
                            onClick={() =>
                              setConfirmStudentId(e.students.student_id)
                            }
                          >
                            {loadingDelete ? (
                              <span className="loader" />
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      <ConfirmDeleteModal
        open={confirmStudentId !== null}
        loading={loadingDelete}
        onCancel={() => setConfirmStudentId(null)}
        onConfirm={() =>
          confirmStudentId !== null &&
          handleDelete(confirmStudentId)
        }
      />

      <EditStudentModal
        open={editingStudentId !== null}
        loading={loadingEdit}
        studentData={editFormData}
        onChange={(updated) => setEditFormData(updated)}
        onCancel={() => setEditingStudentId(null)}
        onSave={handleEditSubmit}
      />

      {(loadingDelete || loadingEdit) && (
        <div className="overlay">
          <span className="loader" style={{ width: 40, height: 40 }} />
        </div>
      )}
    </div>
  );
}
