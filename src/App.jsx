import Navbar from "./layout/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./layout/Footer";
import Signout from "./components/Signout";
import Hero from "./pages/Hero";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { storeContext } from "./context/storeContext";
import Project from "./pages/Project";

function App() {

  const {isAuth} = useContext(storeContext)

  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={isAuth ? <Dashboard /> : <Hero/>} />
        <Route
          path="/register"
          element={isAuth ? <Dashboard /> : <Register />}
        />
        <Route path="/login" element={isAuth ? <Dashboard/> : <Login />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Login />} />
        <Route path="/signout" element={isAuth ? <Signout /> : <Login />} />
        <Route path="/project/:projectId" element={isAuth ? <Project /> : <Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
