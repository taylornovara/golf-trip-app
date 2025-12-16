import { createServerClient } from "@/lib/supabase/server";
import { createPlayer } from "./actions";

export default async function PlayersPage() {
  const supabase = await createServerClient();

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("name");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Players</h1>

      <ul>
        {players?.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>

      <form action={createPlayer} className="space-y-2">
        <input
          name="name"
          placeholder="Player name"
          className="border p-2 rounded w-full"
        />
        <button className="px-4 py-2 bg-black text-white rounded">
          Add Player
        </button>
      </form>
    </div>
  );
}
