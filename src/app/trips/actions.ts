"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTrip(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Trip name is required");
  }

  const supabase = await createServerClient();

  const { error } = await supabase.from("trips").insert({
    name,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/trips");
}

export async function addPlayerToTrip(tripId: string, playerId: string) {
  const supabase =  await createServerClient();

  const { error } = await supabase.from("trip_players").insert({
    trip_id: tripId,
    player_id: playerId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/trips/${tripId}`);
}
