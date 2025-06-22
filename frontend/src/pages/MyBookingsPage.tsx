import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";

interface Booking {
  id: number;
  slot_id: number;
  created_at: string;
}

export default function MyBookingsPage() {
  const { userEmail } = useAuth();
  const [email, setEmail] = useState("");             
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toCancel, setToCancel] = useState<number | null>(null);

  const loadBookings = useCallback(async (targetEmail: string) => {
    try {
      const { data } = await api.get<Booking[]>(`/users/${targetEmail}/bookings`);
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings");
    }
  }, []); 

  useEffect(() => {
    if (userEmail) {
      loadBookings(userEmail);
    }
  }, [userEmail, loadBookings]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await loadBookings(email);
    }
  };

  const confirmCancel = async () => {
    if (toCancel === null) return;
    try {
      await api.request({
        method: "delete",
        url: `/bookings/${toCancel}`,
        data: { email: userEmail ?? email },
      });
      toast.success("Booking cancelled");
      setToCancel(null);
      await loadBookings(userEmail ?? email);
    } catch {
      toast.error("Could not cancel booking");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {!userEmail && (
        <form onSubmit={handleLookup} className="space-y-2">
          <p className="text-gray-700">
            Enter the email you used to book:
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-grow border p-2 rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              View
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              Booking #{b.id} — Slot {b.slot_id} on{" "}
              {new Date(b.created_at).toLocaleString()}
            </div>
            <button
              onClick={() => setToCancel(b.id)}
              className="text-red-600 hover:underline"
            >
              Cancel
            </button>
          </li>
        ))}
        {bookings.length === 0 && userEmail && (
          <p className="text-center text-gray-600">
            You have no bookings yet.
          </p>
        )}
      </ul>

      <ConfirmModal
        isOpen={toCancel !== null}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This cannot be undone."
        onConfirm={confirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </div>
  );
}
