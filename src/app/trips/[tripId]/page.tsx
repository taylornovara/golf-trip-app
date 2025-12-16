import { createServerClient } from "@/lib/supabase/server";

type Props = {
  params: { tripId: string };
};

export default async function TripDetailPage({ params }: Props) {
  const supabase = await createServerClient();

  const { data: trip, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", params.tripId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{trip.name}</h1>
      <p>Trip ID: {trip.id}</p>
    </div>
  );
}
