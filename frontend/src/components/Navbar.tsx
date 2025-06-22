import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { userEmail, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Mini-Calendly
        </Link>
        <div className="space-x-4">
          {userEmail ? (
            <>
              <Link
                to="/events/new"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Event
              </Link>
              {/* ← Add this */}
              <Link
                to="/bookings"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                My Bookings
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="px-4 py-2 text-indigo-600 hover:underline">
                Login
              </Link>
              <Link to="/auth/signup" className="px-4 py-2 text-green-600 hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
