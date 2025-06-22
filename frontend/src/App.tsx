import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { userEmail } = useAuth();
  return userEmail ? children : <Navigate to="/auth/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>         {/* ← now wraps everything */}
        <div className="min-h-screen flex flex-col">
          <Navbar />          {/* Links here now have a Router */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route
                path="/events/new"
                element={
                  <RequireAuth>
                    <CreateEventPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/bookings"
                element={
                  <RequireAuth>
                    <MyBookingsPage />
                  </RequireAuth>
                }
              />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

