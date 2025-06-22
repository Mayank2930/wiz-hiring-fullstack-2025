import { Link } from "react-router-dom";

interface Props {
  id: number;
  title: string;
  creator_name: string;    // make sure your API returns this
  slot_count: number;
}

export default function EventCard({
  id,
  title,
  creator_name,
  slot_count,
}: Props) {
  return (
    <div className="bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">By {creator_name}</p>
        <p className="text-sm text-gray-600 mt-3">
          {slot_count} slot{slot_count !== 1 ? "s" : ""} available
        </p>
      </div>
      <div className="p-4 bg-gray-50 text-right">
        <Link
          to={`/events/${id}`}
          className="text-indigo-600 hover:underline font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
