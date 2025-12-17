import { Route, Routes } from "react-router-dom";
import FormPage from "./Formpage";


export default function FormsLayout() {
  return (
    <div>
      <h2>Form Layout</h2>
      <Routes>
        <Route path="Formpage" element={<FormPage />} />
       
      </Routes>
    </div>
  );
}
