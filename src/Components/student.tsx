import { useEffect, useRef, useState } from "react";
import "../App.css";
import api from "./Forms/api";

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

const FILTER_FIELDS: (keyof Pick<
  Student,
  "name" | "age" | "gender" | "city"
>)[] = ["name", "age", "gender", "city"];

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

  const cacheRef = useRef<Record<string, { data: Student[]; total: number }>>(
    {}
  );
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // ------------------ Utilities ------------------
  const debounce = (fn: Function, delay = 500) => {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const buildCacheKey = (page = currentPage) =>
    JSON.stringify({
      page,
      limit: itemsPerPage,
      sortField,
      sortOrder,
      filters,
    });

  // ------------------ Fetch Students ------------------
  const fetchStudents = async (page = currentPage) => {
    const cacheKey = buildCacheKey(page);

    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setData(cached.data);
      setTotalItems(cached.total);
      return;
    }

    const params: any = {
      page,
      limit: itemsPerPage,
    };

    if (sortField) {
      params.sortField = sortField;
      params.sortOrder = sortOrder;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    try {
      const res = await api.get("/students", { params });
      const result = res.data;

      const fetchedData = result.data || [];
      const fetchedTotal = result.total || 0;

      cacheRef.current[cacheKey] = {
        data: fetchedData,
        total: fetchedTotal,
      };

      setData(fetchedData);
      setTotalItems(fetchedTotal);
    } catch (err: any) {
      console.error("Error fetching students:", err.response?.data || err.message);
      setData([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage, sortField, sortOrder, filters]);

  // ------------------ Pagination ------------------
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  const prevPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  // ------------------ Sorting ------------------
  const handleSortClick = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // ------------------ Filtering ------------------
  const handleFilterClick = (field: string) => {
    if (activeFilter === field) {
      setActiveFilter(null);
      setFilters({ name: "", age: "", gender: "", city: "" });
    } else {
      setActiveFilter(field);
    }
    setCurrentPage(1);
  };

  const handleFilterChange = debounce((field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  }, 500);

  // ------------------ Outside Click ------------------
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortOptions(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterOptions(false);
        setActiveFilter(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ------------------ UI ------------------
  return (
    <>
      <h2>Students</h2>

      <div className="action-buttons">
        {/* Sort */}
        <div ref={sortRef} className="dropdown-container">
          <button
            className={`dropdown-button ${sortField ? "active" : ""}`}
            onClick={() => setShowSortOptions((v) => !v)}
          >
            Sort {sortField && <span className="dot" />}
          </button>

          {showSortOptions && (
            <div className="dropdown-options">
              {SORT_FIELDS.map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortClick(field)}
                  className={sortField === field ? "highlighted" : ""}
                >
                  {field} {sortField === field ? `(${sortOrder})` : ""}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter */}
        <div ref={filterRef} className="dropdown-container">
          <button
            className={`dropdown-button ${activeFilter ? "active" : ""}`}
            onClick={() => setShowFilterOptions((v) => !v)}
          >
            Filter {activeFilter && <span className="dot" />}
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
                    id={`filter-${activeFilter}`}
                    name={`filter-${activeFilter}`}
                    type={activeFilter === "age" ? "number" : "text"}
                    value={filters[activeFilter]}
                    onChange={(e) =>
                      handleFilterChange(activeFilter, e.target.value)
                    }
                    placeholder={`Enter ${activeFilter}`}
                    autoComplete="off"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
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
                <td>
                  {student.date_of_birth
                    ? new Date(student.date_of_birth).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{student.city}</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No students found or Unauthorized access.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-controls">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`pagination-button ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          Previous
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className={`pagination-button ${
            currentPage >= totalPages ? "disabled" : ""
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Student;
