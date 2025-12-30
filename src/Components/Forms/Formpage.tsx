import React, { useState } from "react";
import { useFormData } from "./formcontext";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "../../App.css";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

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

// Date Helpers with age auto calaculated

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

  const formatDateDDMMYYYY = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

// Handle Change

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      updateData({
        date_of_birth: value,
        age: calculateAge(value),
      });
    } else if (name === "course_id") {
      updateData({ [name]: value === "" ? "" : Number(value) });
    } else {
      updateData({ [name]: value as any });
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

//  Step validation

  const validateStep = () => {
    let currentErrors: Partial<Record<keyof typeof data, string>> = {};
    let isValid = true;

    if (step === 1) {
      if (!data.name) currentErrors.name = validationMessages.required;
      if (!data.age) currentErrors.age = validationMessages.required;
      if (!data.gender) currentErrors.gender = validationMessages.required;
      if (!data.city) currentErrors.city = validationMessages.required;
      if (!data.date_of_birth)
        currentErrors.date_of_birth = validationMessages.required;

      isValid = Object.keys(currentErrors).length === 0;
    }

    if (step === 2) {
      if (!data.course_id)
        currentErrors.course_id = validationMessages.selectCourse;

      if (data.marks !== "" && isNaN(Number(data.marks)))
        currentErrors.marks = validationMessages.invalidMarks;

      isValid = Object.keys(currentErrors).length === 0;
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNext = () => validateStep() && setStep(step + 1);
  const handleBack = () => setStep(step - 1);

// Save

const handleSave = async () => {
  const payload = {
    ...data,
    // Send date in ISO format (yyyy-mm-dd)
    date_of_birth: data.date_of_birth, 
    age: calculateAge(data.date_of_birth),
    course_id: data.course_id ? Number(data.course_id) : undefined,
    marks: data.marks !== "" ? Number(data.marks).toFixed(2) : undefined,
  };

  try {
    await api.post("/students", payload);
    toast.success("Enrollment successful!");
    reset();
    setStep(1);
    navigate("/students");
  } catch (error: any) {
    toast.error(
      "Failed to save: " + (error.response?.data?.message || "Check your data")
    );
  }
};

// UI
  return (
    <div>
      {step === 1 && (
        <div className="form-container">
          <h2>Student Details</h2>

          <div className="form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={data.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            {/* Age */}
            <div className="form-group">
              <label htmlFor="age">
                Age <span className="required">*</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={data.age}
                readOnly
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <fieldset className="gender-options">
                <legend>
                  Gender <span className="required">*</span>
                </legend>

                <div className="radio-group-wrapper">
                  {[
                    { value: "M", label: "Male" },
                    { value: "F", label: "Female" },
                    { value: "Other", label: "Other" },
                  ].map((g) => (
                    <label key={g.value}>
                      <input
                        type="radio"
                        name="gender"
                        value={g.value}
                        checked={data.gender === g.value}
                        onChange={handleChange}
                      />
                      {g.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {errors.gender && (
                <div className="error-message">{errors.gender}</div>
              )}
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <select
                id="city"
                name="city"
                value={data.city}
                onChange={handleChange}
              >
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
              <label htmlFor="date_of_birth">
                Date of Birth <span className="required">*</span>
              </label>
            <DatePicker
                selected={data.date_of_birth ? new Date(data.date_of_birth) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    const iso = date.toISOString().split("T")[0];
                    updateData({
                      date_of_birth: iso,
                      age: calculateAge(iso),
                    });
                  }
                }}
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                id="date_of_birth"
                name="date_of_birth"
                customInput={
                  <input
                    value={
                      data.date_of_birth
                        ? formatDateDDMMYYYY(data.date_of_birth)
                        : ""
                    }
                    onClick={(e) => e.currentTarget.focus()}
                    readOnly
                    className="form-control"
                    autoComplete="off"
                  />
                }
              />
                {errors.date_of_birth && (
                <div className="error-message">
                  {errors.date_of_birth}
                </div>
              )}
            </div>

            <button className="primary-button" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="form-container">
          <h2>Course Selection</h2>

          <div className="form">
            <div className="form-group">
              <label htmlFor="course_id">
                Courses <span className="required">*</span>
              </label>

              <select
                id="course_id"
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
              <label htmlFor="marks">Marks</label>
              <input
                id="marks"
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

            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <button className="primary-button" onClick={handleNext}>
              Next
            </button>
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
            <p>
              <strong>DOB:</strong>{" "}
              {formatDateDDMMYYYY(data.date_of_birth)}
            </p>
            <p><strong>Course:</strong> {data.course_id}</p>
            <p><strong>Marks:</strong> {data.marks || "N/A"}</p>

            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <button className="confirm-button" onClick={handleSave}>
              Confirm & Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPage;
