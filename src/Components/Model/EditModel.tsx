import { createPortal } from "react-dom";
import { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import Student from "../student";

export interface EditStudentModalProps {
  open: boolean;
  loading: boolean;
  studentData: Partial<Student>;
  onChange: (data: Partial<Student>) => void;
  onCancel: () => void;
  onSave: () => void;
}

/* Allowed Cities */
const ALLOWED_CITIES = [
  "Tirunelveli",
  "Chennai",
  "Bangalore",
  "Coimbatore",
  "Madurai",
  "Tirchy",
];
/* Custom Date Input */
interface DateInputProps {
  value?: string;
  onClick?: () => void;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onClick }, ref) => (
    <div className="datepicker-wrapper">
      <input
        ref={ref}
        id="date_of_birth"
        name="date_of_birth"
        className="input"
        type="text"
        value={value || ""}
        readOnly
        onClick={onClick}
        placeholder="DD-MM-YYYY"
        autoComplete="off"
      />
      <FaCalendarAlt className="calendar-icon" />
    </div>
  )
);

DateInput.displayName = "DateInput";

/* Main Component */
export default function EditStudentModal({
  open,
  loading,
  studentData,
  onChange,
  onCancel,
  onSave,
}: EditStudentModalProps) {
  const [localData, setLocalData] = useState<Partial<Student>>({});

  useEffect(() => {
    if (open) setLocalData(studentData);
  }, [open, studentData]);

  if (!open) return null;

  /* Helpers age auto calculated*/
  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  const handleDOBChange = (date: Date | null) => {
    if (!date) return;

    const age = calculateAge(date);
    const isoDate = date.toISOString().split("T")[0];

    const updated: Partial<Student> = {
      ...localData,
      date_of_birth: isoDate,
      age,
    };

    setLocalData(updated);
    onChange(updated);
  };

  const handleChange = (field: keyof Student, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  /* UI */
  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="confirm-modal">
        <h3>Edit Student</h3>

        <div className="modal-body">
          {/* Name */}
          <input
            id="student-name"
            name="fullName"
            className="input"
            placeholder="Full Name"
            value={localData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            autoComplete="name"
          />

          {/* Age */}
          <input
            id="student-age"
            name="age"
            className="input"
            type="number"
            placeholder="Age"
            value={localData.age ?? ""}
            readOnly
          />

          {/* Gender */}
          <input
            id="student-gender"
            name="gender"
            className="input"
            placeholder="Gender"
            value={localData.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
          />

          {/* City  */}
          <select
            id="student-city"
            name="city"
            className="input"
            value={localData.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
          >
            <option value="" disabled>
              Select City
            </option>
            {ALLOWED_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Date Picker */}
          <DatePicker
            selected={
              localData.date_of_birth
                ? new Date(localData.date_of_birth)
                : null
            }
            onChange={handleDOBChange}
            dateFormat="dd-MM-yyyy"
            maxDate={new Date()}
            customInput={<DateInput />}
            renderCustomHeader={({ date, changeYear, changeMonth }) => (
              <div className="datepicker-header">
                <select
                  value={date.getMonth()}
                  onChange={(e) => changeMonth(Number(e.target.value))}
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={date.getFullYear()}
                  onChange={(e) => changeYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-confirm"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
