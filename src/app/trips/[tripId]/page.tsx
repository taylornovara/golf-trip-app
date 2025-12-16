import { createServerClient } from "@/lib/supabase/server";
import { addPlayerToTrip } from "../actions";

export default async function TripPage({
  params,
}: {
  params: { tripId: string };
}) {
  const supabase = await createServerClient();
  const tripId = params.tripId;

  // Trip
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  // All players
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("name");

  // Players already on this trip
  const { data: tripPlayers } = await supabase
    .from("trip_players")
    .select("player_id")
    .eq("trip_id", tripId);

  const playerIdsOnTrip = new Set(tripPlayers?.map((tp) => tp.player_id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{trip?.name}</h1>

      <section>
        <h2 className="text-lg font-semibold">Add Players</h2>

        <ul className="space-y-2">
          {players?.map((player) => {
            const alreadyAdded = playerIdsOnTrip.has(player.id);

            return (
              <li
                key={player.id}
                className="flex items-center justify-between border p-2 rounded"
              >
                <span>{player.name}</span>

                {alreadyAdded ? (
                  <span className="text-sm text-gray-500">Already added</span>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      await addPlayerToTrip(tripId, player.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-sm px-3 py-1 border rounded"
                    >
                      Add
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
