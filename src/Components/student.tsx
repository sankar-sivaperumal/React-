/*  import { useEffect, useState } from "react";
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

export default Student; */
 

/* import { useEffect, useState, useMemo } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Student>(); 
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); 
  const [filters, setFilters] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
  });
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Fetch data from the backend
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

  // Sorting logic
  const sortedData = useMemo(() => {
    let sorted = [...data];

    if (sortField && sortOrder) {
      sorted.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [data, sortField, sortOrder]);

  // Filtering logic
  const filteredData = useMemo(() => {
    return sortedData.filter((student) => {
      return (
        (!filters.name || student.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.age || student.age.toString() === filters.age) &&
        (!filters.gender || student.gender.toLowerCase() === filters.gender.toLowerCase()) &&
        (!filters.city || student.city.toLowerCase().includes(filters.city.toLowerCase()))
      );
    });
  }, [sortedData, filters]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (activeFilter) {
      setFilters({
        ...filters,
        [activeFilter]: value,
      });
    }
  };

  // Handle sort button clicks
  const handleSortClick = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Clear sort field
  const clearSort = () => {
    setSortField("name"); 
    setSortOrder("asc");  
  };

  // Clear filter
  const clearFilter = () => {
    setActiveFilter(null);
    setFilters({
      name: "",
      age: "",
      gender: "",
      city: "",
    });
  };

  return (
    <>
      <h2>Students</h2>

      <div className="action-buttons">
        {/* Sort Button *
        <button
          onClick={() => setShowSortOptions(!showSortOptions)}
          className={`dropdown-button ${sortField ? "active" : ""}`}
        >
          Sort
          {sortField && <span className="dot"></span>}
          {sortField && (
            <span className="clear-button" onClick={clearSort}>
              &#10005;
            </span>
          )}
        </button>
        {showSortOptions && (
          <div className="dropdown-options">
            <button
              onClick={() => handleSortClick("name")}
              className={sortField === "name" ? "highlighted" : ""}
            >
              Sort by Name
            </button>
            <button
              onClick={() => handleSortClick("age")}
              className={sortField === "age" ? "highlighted" : ""}
            >
              Sort by Age
            </button>
            <button
              onClick={() => handleSortClick("city")}
              className={sortField === "city" ? "highlighted" : ""}
            >
              Sort by City
            </button>
            <button
              onClick={() => handleSortClick("student_id")}
              className={sortField === "student_id" ? "highlighted" : ""}
            >
              Sort by ID
            </button>
            <button
              onClick={() => handleSortClick("gender")}
              className={sortField === "gender" ? "highlighted" : ""}
            >
              Sort by Gender
            </button>
            <button
              onClick={() => handleSortClick("date_of_birth")}
              className={sortField === "date_of_birth" ? "highlighted" : ""}
            >
              Sort by Date of Birth
            </button>
            <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              Toggle {sortOrder === "asc" ? "Descending" : "Ascending"}
            </button>
          </div>
        )}

        {/* Filter Button *
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className={`dropdown-button ${activeFilter ? "active" : ""}`}
        >
          Filter
          {activeFilter && <span className="dot"></span>}
          {activeFilter && (
            <span className="clear-button" onClick={clearFilter}>
              &#10005;
            </span>
          )}
        </button>
        {showFilterOptions && (
          <div className="dropdown-options">
            <button onClick={() => setActiveFilter("name")} className={activeFilter === "name" ? "highlighted" : ""}>
              Filter by Name
            </button>
            <button onClick={() => setActiveFilter("age")} className={activeFilter === "age" ? "highlighted" : ""}>
              Filter by Age
            </button>
            <button onClick={() => setActiveFilter("gender")} className={activeFilter === "gender" ? "highlighted" : ""}>
              Filter by Gender
            </button>
            <button onClick={() => setActiveFilter("city")} className={activeFilter === "city" ? "highlighted" : ""}>
              Filter by City
            </button>
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
          {currentItems.map((student) => (
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

      {/* Pagination controls *
      <div className="pagination-controls">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
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
 */


// filter & sort with deselect option version

import { useEffect, useState, useMemo } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Student>(); 
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

  // Fetch data from the backend
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

  // Sorting logic
  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortField && sortOrder) {
      sorted.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [data, sortField, sortOrder]);

  // Filtering logic
  const filteredData = useMemo(() => {
    return sortedData.filter((student) => {
      return (
        (!filters.name || student.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.age || student.age.toString() === filters.age) &&
        (!filters.gender || student.gender.toLowerCase() === filters.gender.toLowerCase()) &&
        (!filters.city || student.city.toLowerCase().includes(filters.city.toLowerCase()))
      );
    });
  }, [sortedData, filters]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (activeFilter) {
      setFilters({
        ...filters,
        [activeFilter]: value,
      });
    }
  };

  // Handle sort button clicks
  const handleSortClick = (field: keyof Student) => {
    if (sortField === field) {
      
      setSortField(null as any); 
      setSortOrder("asc"); 
    } else {
      setSortField(field);
      setSortOrder("asc"); 
    }
  };

  // Handle filter selection and deselection
  const handleFilterClick = (field: string) => {
    if (activeFilter === field) {
      
      setActiveFilter(null);
      setFilters({
        name: "",
        age: "",
        gender: "",
        city: "",
      });
    } else {
      setActiveFilter(field);
    }
  };

  return (
    <>
      <h2>Students</h2>

      <div className="action-buttons">
       {/* sort button */}
        <button
          onClick={() => setShowSortOptions(!showSortOptions)}
          className={`dropdown-button ${sortField ? "active" : ""}`}
        >
          Sort
          {sortField && <span className="dot"></span>}
        </button>
        {showSortOptions && (
          <div className="dropdown-options">
            <button
              onClick={() => handleSortClick("name")}
              className={sortField === "name" ? "highlighted" : ""}
            >
              Sort by Name
            </button>
            <button
              onClick={() => handleSortClick("age")}
              className={sortField === "age" ? "highlighted" : ""}
            >
              Sort by Age
            </button>
            <button
              onClick={() => handleSortClick("city")}
              className={sortField === "city" ? "highlighted" : ""}
            >
              Sort by City
            </button>
            <button
              onClick={() => handleSortClick("student_id")}
              className={sortField === "student_id" ? "highlighted" : ""}
            >
              Sort by ID
            </button>
            <button
              onClick={() => handleSortClick("gender")}
              className={sortField === "gender" ? "highlighted" : ""}
            >
              Sort by Gender
            </button>
            <button
              onClick={() => handleSortClick("date_of_birth")}
              className={sortField === "date_of_birth" ? "highlighted" : ""}
            >
              Sort by Date of Birth
            </button>
          </div>
        )}

        {/* Filter Button */}
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className={`dropdown-button ${activeFilter ? "active" : ""}`}
        >
          Filter
          {activeFilter && <span className="dot"></span>}
        </button>
        {showFilterOptions && (
          <div className="dropdown-options">
            <button
              onClick={() => handleFilterClick("name")}
              className={activeFilter === "name" ? "highlighted" : ""}
            >
              Filter by Name
            </button>
            <button
              onClick={() => handleFilterClick("age")}
              className={activeFilter === "age" ? "highlighted" : ""}
            >
              Filter by Age
            </button>
            <button
              onClick={() => handleFilterClick("gender")}
              className={activeFilter === "gender" ? "highlighted" : ""}
            >
              Filter by Gender
            </button>
            <button
              onClick={() => handleFilterClick("city")}
              className={activeFilter === "city" ? "highlighted" : ""}
            >
              Filter by City
            </button>

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
          {currentItems.map((student) => (
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

      {/* Pagination controls */}
      <div className="pagination-controls">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
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
