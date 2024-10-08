import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Dashboard from "./components/DashBord"; // Ensure the file name matches
import CreateEmployee from "./components/CreateEmployee";
import EmployeeList from "./components/EmployeeList";
import EditEmployee from "./components/EditEmployee";

function App() {
  return (
    <div className="bg-neutral-300 h-auto w-screen">
      <p className="text-blue-500 font-bold text-2xl p-7">LOGO HERE</p>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Registration />} path="/register" />
          <Route element={<Dashboard />} path="/dashboard/:ID" />
          <Route element={<CreateEmployee />} path="/create-employee" />
          <Route element={<EmployeeList />} path="/employee-list" />
          <Route element={<EditEmployee />} path="/edit-employee/:ID" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
