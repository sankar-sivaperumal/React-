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

// Custom DatePicker input with calendar icon
interface DateInputProps {
  value?: string;
  onClick?: () => void;
}

const DateInput = forwardRef<HTMLDivElement, DateInputProps>(
  ({ value, onClick }, ref) => (
    <div className="datepicker-input" onClick={onClick} ref={ref}>
      <input
        className="input"
        type="text"
        value={value}
        readOnly
        placeholder="DD-MM-YYYY"
      />
      <FaCalendarAlt className="calendar-icon" />
    </div>
  )
);

export default function EditStudentModal({
  open,
  loading,
  studentData,
  onChange,
  onCancel,
  onSave,
}: EditStudentModalProps) {
  const [localData, setLocalData] = useState<Partial<Student>>({});

  // Sync only when modal opens
  useEffect(() => {
    if (open) setLocalData(studentData);
  }, [open, studentData]);

  if (!open) return null;

  // Calculate age from DOB
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

    const updated: Partial<Student> = { ...localData, date_of_birth: isoDate, age };
    setLocalData(updated);
    onChange(updated);
  };

  const handleChange = (field: keyof Student, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  return createPortal(
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <h3>Edit Student</h3>

        <div className="modal-body">
          <input
            className="input"
            placeholder="Name"
            value={localData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <input
            className="input"
            placeholder="Age"
            type="number"
            value={localData.age ?? ""}
            readOnly
          />

          <input
            className="input"
            placeholder="Gender"
            value={localData.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
          />

          <input
            className="input"
            placeholder="City"
            value={localData.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <DatePicker
            selected={
              localData.date_of_birth ? new Date(localData.date_of_birth) : null
            }
            onChange={handleDOBChange}
            dateFormat="dd-MM-yyyy"
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            customInput={<DateInput />}
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
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
