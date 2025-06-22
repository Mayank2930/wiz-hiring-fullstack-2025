import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SlotPicker from "../components/SlotPicker";
import type { NewSlot } from "../components/SlotPicker";
import { toast } from "react-toastify";

export default function CreateEventPage() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState<NewSlot[]>([
    { start: "", end: "", capacity: 1 },
  ]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (slots.length === 0) {
      toast.error("Add at least one slot");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        slots: slots.map(s => ({
          start_time: new Date(s.start).toISOString(),
          end_time:   new Date(s.end!).toISOString(),
          max_capacity: s.capacity,
        })),
      };
      const { data } = await api.post("/events", payload);
      toast.success("Event created!");
      const eventData = data as { id: string };
      nav(`/events/${eventData.id}`);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "detail" in err.response.data) {
        // @ts-expect-error: dynamic error shape from axios
        toast.error(err.response.data.detail || "Failed to create event");
      } else {
        toast.error("Failed to create event");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Create New Event</h1>

      <input
        disabled={loading}
        className="w-full border p-2 rounded"
        placeholder="Event title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        disabled={loading}
        className="w-full border p-2 rounded h-24"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <SlotPicker slots={slots} setSlots={setSlots} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 text-white px-4 py-2 rounded 
                   hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create Event"}
      </button>
    </div>
  );
}
