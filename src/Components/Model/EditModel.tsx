import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import Student from "../student";

export interface EditStudentModalProps {
  open: boolean;
  loading: boolean;
  studentData: Partial<Student>;
  onChange: (data: Partial<Student>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditStudentModal({
  open,
  loading,
  studentData,
  onChange,
  onCancel,
  onSave,
}: EditStudentModalProps) {
  const [localData, setLocalData] = useState<Partial<Student>>(studentData);

    // Sync student data with studentsdetails
  useEffect(() => {
    setLocalData(studentData);
  }, [studentData]);

  if (!open) return null;

  // Auto calculate age
  const calculateAge = (dob?: string) => {
    if (!dob) return undefined;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleChange = (field: keyof Student, value: any) => {
    let updatedValue = value;

    if (field === "age") {
      // Store age as no or undefined
      updatedValue = value === "" ? undefined : Number(value);
      if (isNaN(updatedValue)) updatedValue = undefined;
    }

        // update age from dob automatically
    if (field === "date_of_birth") {
      const age = calculateAge(value);
      setLocalData((prev) => {
        const updated = { ...prev, date_of_birth: value, age };
        onChange(updated);  // changes from parent to child
        return updated;
      });
      return;
    }

    const updated = { ...localData, [field]: updatedValue };
    setLocalData(updated);
    onChange(updated); // changes from parent to child
  };

  return createPortal(
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <h3>Edit Student</h3>

        <div className="modal-body">
          <input
            placeholder="Name"
            value={localData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <input
            placeholder="Age"
            type="number"
            value={localData.age !== undefined ? localData.age : ""}
            onChange={(e) => handleChange("age", e.target.value)}
          />
          <input
            placeholder="Gender"
            value={localData.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
          />
          <input
            placeholder="City"
            value={localData.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          <input
            placeholder="Date of Birth"
            type="date"
            value={localData.date_of_birth || ""}
            onChange={(e) => handleChange("date_of_birth", e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn-cancel me-3"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button className="btn-confirm" onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
