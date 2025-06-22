import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

interface Props {
  slotId: number;
  onBooked?: () => void;    
}

export default function BookingForm({ slotId, onBooked }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await api.post(`/events/${slotId}/bookings`, { name, email });
      toast.success("Booked! Check your email for confirmation.");

      if (onBooked) {
        onBooked();
      }

      setName("");
      setEmail("");
    } catch (err: unknown) {
      let msg = "Booking failed";
      interface ApiError {
        response?: {
          data?: {
            detail?: string;
          };
        };
      }
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as ApiError).response?.data?.detail
      ) {
        msg = (err as ApiError).response!.data!.detail!;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 space-y-2">
      <input
        disabled={loading}
        className="w-full border p-2 rounded"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        disabled={loading}
        className="w-full border p-2 rounded"
        placeholder="Your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !name || !email}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded 
                   hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Booking…" : "Book slot"}
      </button>
    </div>
  );
}
