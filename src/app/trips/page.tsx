import { createServerClient } from "@/lib/supabase/server";
import { createTrip } from "./actions";


export default async function TripsPage() {
  const supabase = await createServerClient();

  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Trips</h1>

      <ul className="space-y-2">
        {trips.map((trip) => (
          <li key={trip.id} className="border p-3 rounded">
            <a href={`/trips/${trip.id}`} className="font-medium">
              {trip.name}
            </a>
          </li>
        ))}
      </ul>

      <form action={createTrip} className="space-y-2">
        <input
          name="name"
          placeholder="Trip name"
          className="border p-2 rounded w-full"
        />
        <button className="px-4 py-2 bg-black text-white rounded">
          Create Trip
        </button>
      </form>
    </div>
  );
}
