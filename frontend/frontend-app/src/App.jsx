import { Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import Dashboard from "./Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;