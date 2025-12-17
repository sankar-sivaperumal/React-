import React, { useState } from "react";
import { useFormData } from "./formcontext";
import api from "./api";
import './index.css'

const FormPage: React.FC = () => {
  const { data, updateData, reset } = useFormData();
  const [step, setStep] = useState(1);

  const validationMessages = {
    required: "This field is required.",
    selectCourse: "Please select a course.",
    invalidMarks: "Please enter a valid number for marks.",
  };

  const [errors, setErrors] = useState<Partial<Record<keyof typeof data, string>>>({});


  // Handle input changes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric and decimal fields
    if (name === "marks") {
     
      updateData({ [name]: value as any });
    } else if (name === "age" || name === "course_id") {
      updateData({ [name]: value === "" ? "" : Number(value) });
    } else {
      updateData({ [name]: value as any });
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Step validation
  
  const validateStep = () => {
    let currentErrors: Partial<Record<keyof typeof data, string>> = {};
    let isValid = true;

    if (step === 1) {
      if (!data.name) { currentErrors.name = validationMessages.required; isValid = false; }
      if (!data.age) { currentErrors.age = validationMessages.required; isValid = false; }
      if (!data.gender) { currentErrors.gender = validationMessages.required; isValid = false; }
      if (!data.city) { currentErrors.city = validationMessages.required; isValid = false; }
      if (!data.date_of_birth) { currentErrors.date_of_birth = validationMessages.required; isValid = false; }
    } else if (step === 2) {
      if (!data.course_id) { currentErrors.course_id = validationMessages.selectCourse; isValid = false; }
      
    
      if (data.marks !== "" && isNaN(Number(data.marks))) {
        currentErrors.marks = validationMessages.invalidMarks;
        isValid = false;
      }
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNext = () => { if (validateStep()) setStep(step + 1); };
  const handleBack = () => setStep(step - 1);


  // Final submit
 
const handleSave = async () => {
 
  const marksString = data.marks !== "" && data.marks !== undefined && data.marks !== null
    ? parseFloat(data.marks.toString()).toFixed(2) 
    : undefined;

  const payload = {
    ...data,
    age: Number(data.age),
    course_id: data.course_id ? Number(data.course_id) : undefined,
    marks: marksString, 
  };

  try {
    await api.post("/students", payload);
    alert("Enrollment successful!");
    reset();
    setStep(1);
  } catch (error: any) {
    console.error("Validation Error:", error.response?.data);
    alert("Failed to save: " + (error.response?.data?.message || "Check your data"));
  }
};


  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      {step === 1 && (
        <div>
          <h2>Student Details</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Name *</label><br/>
            <input name="name" value={data.name} onChange={handleChange} />
            {errors.name && <div style={{ color: "red", fontSize: "12px" }}>{errors.name}</div>}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Age *</label><br/>
            <input type="number" name="age" value={data.age} onChange={handleChange} />
            {errors.age && <div style={{ color: "red", fontSize: "12px" }}>{errors.age}</div>}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Gender *</label><br/>
            {["M", "F", "Other"].map((g) => (
              <label key={g} style={{ marginRight: "10px" }}>
                <input type="radio" name="gender" value={g} checked={data.gender === g} onChange={handleChange} />
                {g === "M" ? "Male" : g === "F" ? "Female" : "Other"}
              </label>
            ))}
            {errors.gender && <div style={{ color: "red", fontSize: "12px" }}>{errors.gender}</div>}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>City *</label><br/>
            <select name="city" value={data.city} onChange={handleChange}>
              <option value="">Select City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
            </select>
            {errors.city && <div style={{ color: "red", fontSize: "12px" }}>{errors.city}</div>}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Date of Birth *</label><br/>
            <input type="date" name="date_of_birth" value={data.date_of_birth} onChange={handleChange} />
            {errors.date_of_birth && <div style={{ color: "red", fontSize: "12px" }}>{errors.date_of_birth}</div>}
          </div>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2> Course Selection</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Course *</label><br/>
            <select name="course_id" value={data.course_id} onChange={handleChange}>
              <option value="">Select Course</option>
              <option value={101}>Maths</option>
              <option value={102}>Physics</option>
              <option value={103}>Chemistry</option>
            </select>
            {errors.course_id && <div style={{ color: "red", fontSize: "12px" }}>{errors.course_id}</div>}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Marks (Decimal allowed)</label><br/>
            <input 
              type="number" 
              step="0.01" 
              name="marks" 
              value={data.marks} 
              onChange={handleChange}
              placeholder="e.g. 85.50"
            />
            {errors.marks && <div style={{ color: "red", fontSize: "12px" }}>{errors.marks}</div>}
          </div>
          <button onClick={handleBack} style={{ marginRight: "10px" }}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2> Preview & Confirm</h2>
          <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Age:</strong> {data.age}</p>
            <p><strong>Gender:</strong> {data.gender}</p>
            <p><strong>City:</strong> {data.city}</p>
            <p><strong>DOB:</strong> {data.date_of_birth}</p>
            <p><strong>Course ID:</strong> {data.course_id}</p>
            <p><strong>Marks:</strong> {data.marks || "N/A"}</p>
          </div>
          <button onClick={handleBack} style={{ marginRight: "10px" }}>Back</button>
          <button onClick={handleSave} style={{ backgroundColor: "green", color: "white" }}>Confirm & Submit</button>
        </div>
      )}
    </div>
  );
};

export default FormPage;
