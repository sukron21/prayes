import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../page/dashboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
