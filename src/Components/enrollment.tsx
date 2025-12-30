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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;  
  const [totalItems, setTotalItems] = useState(0); 
  const [cachedData, setCachedData] = useState<{ [key: number]: Enrollment[] }>({}); 

  useEffect(() => {
    
    if (cachedData[currentPage]) {
      setData(cachedData[currentPage]);
      return; 
    }
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", itemsPerPage.toString());

    fetch(`http://localhost:5000/enrollments?${params.toString()}`)
      .then((res) => res.json())
      .then((response: { data: Enrollment[]; total: number }) => {
        const fetchedData = response.data || response; 
        setData(fetchedData);
        setCachedData((prev) => ({
          ...prev,
          [currentPage]: fetchedData,
        }));
        setTotalItems(response.total || fetchedData.length);
      })
      .catch(Error)
       
  }, [currentPage]); 

      /* PAGINATION LOGIC */
      const totalPages = Math.ceil(totalItems / itemsPerPage);  

      const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
      };

      const prevPage = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
      };

  return (
    <>
      <h2>Enrollments</h2>

    {/* ENROLLMENT TABLE */}
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Enrollment ID</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((enrollment) => (
              <tr key={enrollment.enrollment_id}>
                <td>{enrollment.enrollment_id}</td>
                <td>{enrollment.students?.student_id ?? "-"}</td>
                <td>{enrollment.students?.name ?? "-"}</td>
                <td>{enrollment.marks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>


      {/* PAGINATION CONTROLS */}
      <div className="pagination-controls">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        >
          Previous
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Enrollment;
