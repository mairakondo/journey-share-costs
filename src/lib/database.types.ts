export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      expenses: {
        Row: {
          amount: number;
          created_at: string;
          day: number;
          id: string;
          label: string;
          payer: string;
          place: string;
          source: string;
          split: Json;
          stop_id: string | null;
          time: string;
          trip_id: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          day: number;
          id?: string;
          label: string;
          payer: string;
          place?: string;
          source?: string;
          split?: Json;
          stop_id?: string | null;
          time: string;
          trip_id: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          day?: number;
          id?: string;
          label?: string;
          payer?: string;
          place?: string;
          source?: string;
          split?: Json;
          stop_id?: string | null;
          time?: string;
          trip_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_stop_id_fkey";
            columns: ["stop_id"];
            isOneToOne: false;
            referencedRelation: "stops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      photos: {
        Row: {
          created_at: string;
          day: number;
          id: string;
          place: string;
          stop_id: string | null;
          storage_path: string;
          time: string;
          trip_id: string;
        };
        Insert: {
          created_at?: string;
          day: number;
          id?: string;
          place?: string;
          stop_id?: string | null;
          storage_path: string;
          time: string;
          trip_id: string;
        };
        Update: {
          created_at?: string;
          day?: number;
          id?: string;
          place?: string;
          stop_id?: string | null;
          storage_path?: string;
          time?: string;
          trip_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photos_stop_id_fkey";
            columns: ["stop_id"];
            isOneToOne: false;
            referencedRelation: "stops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "photos_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          id: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      stops: {
        Row: {
          created_at: string;
          day: number;
          id: string;
          place: string;
          tag: string;
          time: string;
          title: string;
          trip_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          day: number;
          id?: string;
          place?: string;
          tag?: string;
          time: string;
          title: string;
          trip_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          day?: number;
          id?: string;
          place?: string;
          tag?: string;
          time?: string;
          title?: string;
          trip_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stops_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_invites: {
        Row: {
          code: string;
          created_at: string;
          created_by: string;
          expires_at: string;
          id: string;
          trip_id: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          created_by: string;
          expires_at?: string;
          id?: string;
          trip_id: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          created_by?: string;
          expires_at?: string;
          id?: string;
          trip_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_invites_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_invites_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_members: {
        Row: {
          created_at: string;
          role: string;
          trip_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role?: string;
          trip_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          role?: string;
          trip_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          created_at: string;
          created_by: string;
          destination: string | null;
          end_date: string | null;
          id: string;
          name: string;
          start_date: string | null;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          destination?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          start_date?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          destination?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trips_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_trip_invite: { Args: { invite_code: string }; Returns: string };
      get_invite_preview: { Args: { invite_code: string }; Returns: Json };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];
