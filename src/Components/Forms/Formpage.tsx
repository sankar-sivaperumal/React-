import React, { useState } from "react";
import { useFormData } from "./formcontext";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "../../App.css";

const FormPage: React.FC = () => {
  const { data, updateData, reset } = useFormData();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const validationMessages = {
    required: "This field is required.",
    selectCourse: "Please select a course.",
    invalidMarks: "Please enter a valid number for marks.",
  };

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof data, string>>
  >({});

  /*  AGE CALCULATION  */
  const calculateAge = (dob: string) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  /*  HANDLE CHANGE  */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // DOB → auto calculate age
    if (name === "date_of_birth") {
      const age = calculateAge(value);

      updateData({
        date_of_birth: value,
        age: age,
      });
    }
    // Marks (decimal)
    else if (name === "marks") {
      updateData({ [name]: value as any });
    }
    // Numeric fields
    else if (name === "course_id") {
      updateData({ [name]: value === "" ? "" : Number(value) });
    }
    // Other fields
    else {
      updateData({ [name]: value as any });
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /*  STEP VALIDATION  */
  const validateStep = () => {
    let currentErrors: Partial<Record<keyof typeof data, string>> = {};
    let isValid = true;

    if (step === 1) {
      if (!data.name) {
        currentErrors.name = validationMessages.required;
        isValid = false;
      }
      if (!data.age) {
        currentErrors.age = validationMessages.required;
        isValid = false;
      }
      if (!data.gender) {
        currentErrors.gender = validationMessages.required;
        isValid = false;
      }
      if (!data.city) {
        currentErrors.city = validationMessages.required;
        isValid = false;
      }
      if (!data.date_of_birth) {
        currentErrors.date_of_birth = validationMessages.required;
        isValid = false;
      }
    } else if (step === 2) {
      if (!data.course_id) {
        currentErrors.course_id = validationMessages.selectCourse;
        isValid = false;
      }

      if (data.marks !== "" && isNaN(Number(data.marks))) {
        currentErrors.marks = validationMessages.invalidMarks;
        isValid = false;
      }
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  /* SAVE & SUBMIT */
  const handleSave = async () => {
    const calculatedAge = calculateAge(data.date_of_birth);

    const marksString =
      data.marks !== "" && data.marks !== undefined && data.marks !== null
        ? parseFloat(data.marks.toString()).toFixed(2)
        : undefined;

    const payload = {
      ...data,
      age: calculatedAge,
      course_id: data.course_id ? Number(data.course_id) : undefined,
      marks: marksString,
    };

    try {
      await api.post("/students", payload);
      alert("Enrollment successful!");
      reset();
      setStep(1);
      navigate("/student");
    } catch (error: any) {
      console.error("Validation Error:", error.response?.data);
      alert(
        "Failed to save: " +
          (error.response?.data?.message || "Check your data")
      );
    }
  };

  return (
    <div>
   
      {step === 1 && (
        <div className="form-container">
          <h2>Student Details</h2>

          <div className="form">
            {/* Name */}
            <div className="form-group">
              <label>
                Name <span className="required">*</span>
              </label>
              <input name="name" value={data.name} onChange={handleChange} />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            {/* Age (AUTO CALCULATED) */}
            <div className="form-group">
              <label>
                Age <span className="required">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={data.age}
                readOnly
              />
              {errors.age && (
                <div className="error-message">{errors.age}</div>
              )}
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>
                Gender <span className="required">*</span>
              </label>
              <div className="gender-options">
                {["M", "F", "Other"].map((g) => (
                  <label key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={data.gender === g}
                      onChange={handleChange}
                    />
                    {g === "M" ? "Male" : g === "F" ? "Female" : "Other"}
                  </label>
                ))}
              </div>
              {errors.gender && (
                <div className="error-message">{errors.gender}</div>
              )}
            </div>

            {/* City */}
            <div className="form-group">
              <label>
                City <span className="required">*</span>
              </label>
              <select name="city" value={data.city} onChange={handleChange}>
                <option value="">Select City</option>
                <option value="Tirunelveli">Tirunelveli</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
                <option value="Tirchy">Tirchy</option>
              </select>
              {errors.city && (
                <div className="error-message">{errors.city}</div>
              )}
            </div>

            {/* DOB */}
            <div className="form-group">
              <label>
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={data.date_of_birth}
                onChange={handleChange}
              />
              {errors.date_of_birth && (
                <div className="error-message">
                  {errors.date_of_birth}
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button className="primary-button" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

     
      {step === 2 && (
        <div className="form-container">
          <h2>Course Selection</h2>

          <div className="form">
            <div className="form-group">
              <label>
                Course <span className="required">*</span>
              </label>
              <select
                name="course_id"
                value={data.course_id}
                onChange={handleChange}
              >
                <option value="">Select Course</option>
                <option value={101}>Maths</option>
                <option value={102}>Physics</option>
                <option value={103}>Chemistry</option>
                <option value={104}>Computer Science</option>
                <option value={105}>English</option>
              </select>
              {errors.course_id && (
                <div className="error-message">{errors.course_id}</div>
              )}
            </div>

            <div className="form-group">
              <label>Marks (Decimal allowed)</label>
              <input
                type="number"
                step="0.01"
                name="marks"
                value={data.marks}
                onChange={handleChange}
              />
              {errors.marks && (
                <div className="error-message">{errors.marks}</div>
              )}
            </div>

            <div className="action-buttons">
              <button className="back-button" onClick={handleBack}>
                Back
              </button>
              <button className="primary-button" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

     
      {step === 3 && (
        <div className="form-container">
          <h2>Preview & Confirm</h2>

          <div className="form">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Age:</strong> {data.age}</p>
            <p><strong>Gender:</strong> {data.gender}</p>
            <p><strong>City:</strong> {data.city}</p>
            <p><strong>DOB:</strong> {data.date_of_birth}</p>
            <p><strong>Course ID:</strong> {data.course_id}</p>
            <p><strong>Marks:</strong> {data.marks || "N/A"}</p>

            <div className="action-buttons">
              <button className="back-button" onClick={handleBack}>
                Back
              </button>
              <button className="confirm-button" onClick={handleSave}>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPage;
