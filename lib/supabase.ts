import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
      };
      decisions: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          analysis: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          analysis: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          decision_id: string;
          title: string;
          status: "pending" | "in_progress" | "completed";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          decision_id: string;
          title: string;
          status?: "pending" | "in_progress" | "completed";
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          role: string;
          opportunity: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          role: string;
          opportunity: string;
          created_at?: string;
        };
      };
      net_worth: {
        Row: {
          id: string;
          user_id: string;
          total: number;
          breakdown: Record<string, number>;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total: number;
          breakdown: Record<string, number>;
          updated_at?: string;
        };
      };
    };
  };
};
