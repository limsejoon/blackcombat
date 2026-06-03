"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/types/database";

export function useComments(tournamentId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchComments() {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("comments fetch error:", error);
      } else {
        setComments(data ?? []);
      }
      setIsLoading(false);
    }

    fetchComments();

    // Realtime: 새 댓글 INSERT 수신 시 피드 맨 위에 추가
    const channel = supabase
      .channel("comments-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId]);

  const sendComment = useCallback(
    async (content: string, authorName: string, fighterSlug?: string) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournament_id: tournamentId,
          author_name: authorName,
          content,
          fighter_slug: fighterSlug ?? null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "댓글 저장에 실패했습니다");
      }
    },
    [tournamentId]
  );

  return { comments, isLoading, sendComment };
}
