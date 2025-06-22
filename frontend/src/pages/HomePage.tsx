import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

interface EventSummary {
  id: number;
  title: string;
  creator_name: string;
  slot_count: number;
}

export default function HomePage() {
  const { userEmail } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<EventSummary[]>("/events");
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          throw new Error("Bad response format");
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load events";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleFirstEventClick() {
    if (userEmail) {
      navigate("/events/new");
    } else {
      navigate("/auth/signup");
    }
  }

  return (
    <>
      <header className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-lg">
            Browse and book slots for events created by our community.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="bg-white shadow rounded-lg p-8">
          {loading ? (
            <p className="text-center text-gray-600">Loading events…</p>
          ) : events.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-gray-700">No upcoming events found.</p>
              <button
                onClick={handleFirstEventClick}
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {userEmail ? "Create the first event" : "Sign up to create an event"}
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((evt) => (
                <EventCard key={evt.id} {...evt} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
