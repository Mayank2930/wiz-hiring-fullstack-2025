import { formatUTCToLocal } from "../utils/date";
import BookingForm from "./BookingForm";

export interface Slot {
  id: number;
  start_time: string;
  end_time: string;
  max_capacity: number;
  remaining_capacity: number
}

interface Props {
  slots: Slot[];
  onBooked?: () => void;
}
export default function SlotList({ slots, onBooked }: Props) {
  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <div key={slot.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>Start:</strong> {formatUTCToLocal(slot.start_time)}</p>
              <p><strong>End:</strong>   {formatUTCToLocal(slot.end_time)}</p>
            </div>
            <span className="text-sm text-gray-500">
              Remaining: {slot.remaining_capacity}
            </span>
          </div>
          <BookingForm slotId={slot.id} onBooked={onBooked} />
        </div>
      ))}
    </div>
  );
}
