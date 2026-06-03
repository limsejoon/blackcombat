export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          starts_at: string | null;
          ends_at: string | null;
          status: "upcoming" | "ongoing" | "finished";
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          status?: "upcoming" | "ongoing" | "finished";
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          status?: "upcoming" | "ongoing" | "finished";
        };
      };
      players: {
        Row: {
          id: string;
          tournament_id: string;
          name: string;
          nickname: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          name: string;
          nickname?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          nickname?: string | null;
          image_url?: string | null;
        };
      };
      donations: {
        Row: {
          id: string;
          tournament_id: string;
          player_id: string;
          donor_id: string;
          donor_nickname: string;
          amount: number;
          message: string;
          is_hidden: boolean;
          payment_key: string | null;
          order_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          player_id: string;
          donor_id?: string | null;
          donor_nickname: string;
          amount: number;
          message: string;
          is_hidden?: boolean;
          payment_key?: string | null;
          order_id: string;
          created_at?: string;
        };
        Update: {
          is_hidden?: boolean;
        };
      };
    };
  };
};

// 편의 타입
export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"];
export type Player = Database["public"]["Tables"]["players"]["Row"];
export type Donation = Database["public"]["Tables"]["donations"]["Row"];
export type DonationWithPlayer = Donation & { players: Pick<Player, "name" | "nickname"> };
