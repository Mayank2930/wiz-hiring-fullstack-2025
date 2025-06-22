// src/pages/EventDetailsPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import SlotList from "../components/SlotList";
import type { Slot } from "../components/SlotList"
import { toast } from "react-toastify";

interface EventDetail {
  id: number;
  title: string;
  description: string;
  slots: Slot[];   // Slot now includes remaining_capacity
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);

  const loadEvent = useCallback(async () => {
    try {
      const res = await api.get<EventDetail>(`/events/${id}`);
      setEvent(res.data);
    } catch {
      toast.error("Could not load event");
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  if (!event) return <p>Loading…</p>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-700">{event.description}</p>
      {/* pass loadEvent down so BookingForm can trigger a refresh */}
      <SlotList slots={event.slots} onBooked={loadEvent} />
    </div>
  );
}
