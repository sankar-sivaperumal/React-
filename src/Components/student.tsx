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

const SORT_FIELDS: (keyof Student)[] = [
  "student_id",
  "name",
  "age",
  "gender",
  "date_of_birth",
  "city",
];

const FILTER_FIELDS: (keyof Pick<Student, "name" | "age" | "gender" | "city">)[] = [
  "name",
  "age",
  "gender",
  "city",
];

function Student() {
  const [data, setData] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [sortField, setSortField] = useState<keyof Student | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState<Record<string, string>>({
    name: "",
    age: "",
    gender: "",
    city: "",
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const cacheRef = useRef<Record<string, { data: Student[]; total: number }>>({});

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Debounce helper
  const debounce = (fn: Function, delay = 500) => {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Build cache key
  const buildCacheKey = (page = currentPage) =>
    JSON.stringify({ page, limit: itemsPerPage, sortField, sortOrder, filters });

  // Fetch students
  const fetchStudents = async (page = currentPage) => {
    const cacheKey = buildCacheKey(page);

    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      if (page === currentPage) setData(cached.data);
      setTotalItems(cached.total);
      return;
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", itemsPerPage.toString());
    if (sortField) {
      params.append("sortField", sortField);
      params.append("sortOrder", sortOrder);
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const res = await fetch(`http://localhost:5000/students?${params.toString()}`);
      const json: { data: Student[]; total: number } = await res.json();
      cacheRef.current[cacheKey] = { data: json.data, total: json.total };
      if (page === currentPage) setData(json.data);
      setTotalItems(json.total);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Fetch current and next page
  useEffect(() => {
    fetchStudents(currentPage);
    const nextPage = currentPage + 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (nextPage <= totalPages) fetchStudents(nextPage);
  }, [currentPage, sortField, sortOrder, filters]);

  // Pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  // Sort handler
  const handleSortClick = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Filter toggle handler
  const handleFilterClick = (field: string) => {
    if (activeFilter === field) {
      setActiveFilter(null);
      setFilters({ name: "", age: "", gender: "", city: "" });
    } else {
      setActiveFilter(field);
    }
    setCurrentPage(1);
  };

  // Filter 
  const handleFilterChange = debounce((field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  }, 500);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortOptions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterOptions(false);
        setActiveFilter(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <h2>Students</h2>

      {/* ACTION BUTTONS */}
      <div className="action-buttons">
        {/* SORT DROPDOWN */}
        <div ref={sortRef} className="dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSortOptions((v) => !v);
            }}
            className={`dropdown-button ${sortField ? "active" : ""}`}
          >
            Sort {sortField && <span className="dot"></span>}
          </button>
          {showSortOptions && (
            <div className="dropdown-options">
              {SORT_FIELDS.map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortClick(field)}
                  className={sortField === field ? "highlighted" : ""}
                >
                  {sortField === field ? `Sort by ${field} (${sortOrder})` : `Sort by ${field}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FILTER DROPDOWN */}
        <div ref={filterRef} className="dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilterOptions((v) => !v);
            }}
            className={`dropdown-button ${activeFilter ? "active" : ""}`}
          >
            Filter {activeFilter && <span className="dot"></span>}
          </button>
          {showFilterOptions && (
            <div className="dropdown-options">
              {FILTER_FIELDS.map((field) => (
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
                    defaultValue={filters[activeFilter]}
                    onChange={(e) => handleFilterChange(activeFilter, e.target.value)}
                    placeholder={`Enter ${activeFilter}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
        <div className="table-wrapper">
          <table>
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
        </div>


      {/* PAGINATION */}
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
