 import { useEffect, useRef, useState } from "react";
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
  // state variables
  const [data, setData] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [sortField, setSortField] = useState<keyof Student | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const cacheRef = useRef<
  Record<
    string,
    { data: Student[]; total: number }
  >
>({});


  // useeffect to fetch data
useEffect(() => {
  const cacheKey = JSON.stringify({
    page: currentPage,
    limit: itemsPerPage,
    sortField,
    sortOrder,
    filters,
  });

// Check cache first
  if (cacheRef.current[cacheKey]) {
    const cached = cacheRef.current[cacheKey];
    setData(cached.data);
    setTotalItems(cached.total);
    return;
  }

  const params = new URLSearchParams();
  params.append("page", currentPage.toString());
  params.append("limit", itemsPerPage.toString());

  if (sortField) {
    params.append("sortField", sortField);
    params.append("sortOrder", sortOrder);
  }
  
  // Append filters
  Object.keys(filters).forEach((key) => {
    const value = (filters as any)[key];
    if (value) params.append(key, value);
  });

  // Fetch data from server
    fetch(`http://localhost:5000/students?${params.toString()}`)
    .then((res) => res.json())
    .then((res: { data: Student[]; total: number }) => {
      setData(res.data);
      setTotalItems(res.total);

        // Store in cache
      cacheRef.current[cacheKey] = {
        data: res.data,
        total: res.total,
      };
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);
    });
}, [currentPage, sortField, sortOrder, filters]);


//  Handlers
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleSortClick = (field: keyof Student) => {
    if (sortField === field) {
      setSortField(null);
      setSortOrder("asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleFilterClick = (field: string) => {
    if (activeFilter === field) {
      setActiveFilter(null);
      setFilters({ name: "", age: "", gender: "", city: "" });
    } else {
      setActiveFilter(field);
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeFilter) return;
    setFilters({ ...filters, [activeFilter]: e.target.value });
    setCurrentPage(1);
  };


  return (
    <>
      <h2>Students</h2>

      {/* ACTION BUTTONS */}
      <div className="action-buttons">
        {/* SORT */}
        <button
          onClick={() => setShowSortOptions((v) => !v)}
          className={`dropdown-button ${sortField ? "active" : ""}`}
        >
          Sort {sortField && <span className="dot"></span>}
        </button>
        {showSortOptions && (
          <div className="dropdown-options">
            {(
              ["name", "age", "city", "student_id", "gender", "date_of_birth"] as (keyof Student)[]
            ).map((field) => (
              <button
                key={field}
                onClick={() => handleSortClick(field)}
                className={sortField === field ? "highlighted" : ""}
              >
                Sort by {field.replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        {/* FILTER */}
        <button
          onClick={() => setShowFilterOptions((v) => !v)}
          className={`dropdown-button ${activeFilter ? "active" : ""}`}
        >
          Filter {activeFilter && <span className="dot"></span>}
        </button>

        {showFilterOptions && (
          <div className="dropdown-options">
            {["name", "age", "gender", "city"].map((field) => (
              <button
                key={field}
                onClick={() => handleFilterClick(field)}
                className={activeFilter === field ? "highlighted" : ""}
              >
                Filter by {field}
              </button>
            ))}

            {activeFilter && (
              <div className="filter-input">
                <input
                  type={activeFilter === "age" ? "number" : "text"}
                  value={filters[activeFilter as keyof typeof filters]}
                  onChange={handleFilterChange}
                  placeholder={`Enter ${activeFilter}`}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* TABLE */}
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
              <td>{new Date(student.date_of_birth).toLocaleDateString()}</td>
              <td>{student.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default Student; 

