export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      expenses: {
        Row: {
          amount: number;
          created_at: string;
          day: number | null;
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
          day?: number | null;
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
          day?: number | null;
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
      member_locations: {
        Row: {
          accuracy_m: number | null;
          expires_at: string;
          lat: number;
          lon: number;
          trip_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          accuracy_m?: number | null;
          expires_at: string;
          lat: number;
          lon: number;
          trip_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          accuracy_m?: number | null;
          expires_at?: string;
          lat?: number;
          lon?: number;
          trip_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "member_locations_trip_id_fkey";
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
          tag_color: string;
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
          tag_color?: string;
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
          tag_color?: string;
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
          planned_budget: number | null;
          start_date: string | null;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          destination?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          planned_budget?: number | null;
          start_date?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          destination?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          planned_budget?: number | null;
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
      is_trip_member: { Args: { p_trip_id: string }; Returns: boolean };
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

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
