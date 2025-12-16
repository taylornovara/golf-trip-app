"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPlayer(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Player name required");
  }

  const supabase = await createServerClient();

  const { error } = await supabase.from("players").insert({ name });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/players");
}
