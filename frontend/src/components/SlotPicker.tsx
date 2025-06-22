export interface NewSlot {
  start   : string; 
  end?    : string; 
  capacity: number;
}

interface Props {
  slots: NewSlot[];
  setSlots: (s: NewSlot[]) => void;
}

export default function SlotPicker({ slots, setSlots }: Props) {
  function updateSlot(i: number, field: keyof NewSlot, value: NewSlot[keyof NewSlot]) {
    const newArr = [...slots];
    newArr[i] = { ...newArr[i], [field]: value };
    setSlots(newArr);
  }

  return (
    <div className="space-y-4">
      {slots.map((slot, i) => (
        <div key={i} className="flex space-x-2 items-end">
          <div>
            <label className="block text-sm">Start</label>
            <input
              type="datetime-local"
              value={slot.start}
              onChange={e => updateSlot(i, "start", e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">End</label>
            <input
              type="datetime-local"
              value={slot.end ?? ""}
              onChange={e => updateSlot(i, "end", e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Capacity</label>
            <input
              type="number"
              min={1}
              value={slot.capacity}
              onChange={e => updateSlot(i, "capacity", +e.target.value)}
              className="border p-2 rounded w-20"
            />
          </div>
          <button
            onClick={() =>
              setSlots(slots.filter((_, idx) => idx !== i))
            }
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          setSlots([...slots, { start: "", end: "", capacity: 1 }])
        }
        className="text-indigo-600 hover:underline"
      >
        + Add slot
      </button>
    </div>
  );
}
