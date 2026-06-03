"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TOURNAMENT_ID, PLAYER_ID_TO_FIGHTER } from "@/lib/fighterMap";

export function useDonations() {
  const [donations, setDonations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchDonations() {
      const { data, error } = await supabase
        .from("donations")
        .select("player_id, amount")
        .eq("tournament_id", TOURNAMENT_ID)
        .eq("is_hidden", false);

      if (error) {
        console.error("donations fetch error:", error);
        setIsLoading(false);
        return;
      }

      const totals: Record<string, number> = {};
      for (const row of (data ?? []) as { player_id: string; amount: number }[]) {
        const slug = PLAYER_ID_TO_FIGHTER[row.player_id];
        if (slug) totals[slug] = (totals[slug] ?? 0) + row.amount;
      }
      setDonations(totals);
      setIsLoading(false);
    }

    fetchDonations();

    // Realtime: 새 도네이션 INSERT 수신 시 즉시 반영
    const channel = supabase
      .channel("donations-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "donations",
          filter: `tournament_id=eq.${TOURNAMENT_ID}`,
        },
        (payload) => {
          const row = payload.new as { player_id: string; amount: number; is_hidden: boolean };
          if (row.is_hidden) return;
          const slug = PLAYER_ID_TO_FIGHTER[row.player_id];
          if (slug) {
            setDonations((prev) => ({
              ...prev,
              [slug]: (prev[slug] ?? 0) + row.amount,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { donations, setDonations, isLoading };
}
