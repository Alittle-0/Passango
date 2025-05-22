// src/appRoutes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import GetStarted from "../pages/GetStarted";
import About from "../pages/About";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Inside from "../pages/Inside";
import Create from "../pages/Create";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Template from "../pages/Template";
import Loading from "../pages/Loading";
import ProtectedRoute from "../components/Protected";
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<GetStarted />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/loading"
        element={
          <ProtectedRoute>
            <Loading />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inside"
        element={
          <ProtectedRoute>
            <Inside />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/template"
        element={
          <ProtectedRoute>
            <Template />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
