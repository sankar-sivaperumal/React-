import  { createContext, useContext, useState, type ReactNode } from "react";


// Types

export interface StudentFormData {
  name: string;
  age: number | "";
  gender: "M" | "F" | "Other" | "";
  city?: string;
  date_of_birth: string;
  course_id?: number | "";
  course_name?: string;
  teacher_name?: string;
  marks?: number | "";
}

interface FormContextType {
  data: StudentFormData;
  updateData: (values: Partial<StudentFormData>) => void;
  reset: () => void;
}

const defaultData: StudentFormData = {
  name: "",
  age: "",
  gender: "",
  city: "",
  date_of_birth: "",
  course_id: "",
  course_name: "",
  teacher_name: "",
  marks: "",
};


// Context

const FormContext = createContext<FormContextType | null>(null);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<StudentFormData>(defaultData);

  const updateData = (values: Partial<StudentFormData>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  const reset = () => setData(defaultData);

  return (
    <FormContext.Provider value={{ data, updateData, reset }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use form data
export const useFormData = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useFormData must be inside FormProvider");
  return context;
};
