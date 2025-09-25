export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          completion_date: string | null
          created_at: string
          distance_km: number | null
          farmer_id: string
          farmer_load_id: string
          id: string
          status: string
          total_price: number
          truck_owner_id: string
          truck_route_id: string
          updated_at: string
        }
        Insert: {
          booking_date?: string
          completion_date?: string | null
          created_at?: string
          distance_km?: number | null
          farmer_id: string
          farmer_load_id: string
          id?: string
          status?: string
          total_price: number
          truck_owner_id: string
          truck_route_id: string
          updated_at?: string
        }
        Update: {
          booking_date?: string
          completion_date?: string | null
          created_at?: string
          distance_km?: number | null
          farmer_id?: string
          farmer_load_id?: string
          id?: string
          status?: string
          total_price?: number
          truck_owner_id?: string
          truck_route_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_farmer_load_id_fkey"
            columns: ["farmer_load_id"]
            isOneToOne: false
            referencedRelation: "farmer_loads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_truck_owner_id_fkey"
            columns: ["truck_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_truck_route_id_fkey"
            columns: ["truck_route_id"]
            isOneToOne: false
            referencedRelation: "truck_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_loads: {
        Row: {
          created_at: string
          crop_type: string
          destination: string
          estimated_price: number | null
          farmer_id: string
          id: string
          pickup_date: string
          pickup_location: string
          pickup_time: string | null
          quantity: number
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_type: string
          destination: string
          estimated_price?: number | null
          farmer_id: string
          id?: string
          pickup_date: string
          pickup_location: string
          pickup_time?: string | null
          quantity: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_type?: string
          destination?: string
          estimated_price?: number | null
          farmer_id?: string
          id?: string
          pickup_date?: string
          pickup_location?: string
          pickup_time?: string | null
          quantity?: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_loads_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          location: string
          phone: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          location: string
          phone: string
          updated_at?: string
          user_id: string
          user_type: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          location?: string
          phone?: string
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      truck_routes: {
        Row: {
          available_date: string
          available_time: string | null
          capacity: number
          capacity_unit: string
          created_at: string
          end_location: string
          id: string
          price_per_km: number
          start_location: string
          status: string
          truck_owner_id: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          available_date: string
          available_time?: string | null
          capacity: number
          capacity_unit?: string
          created_at?: string
          end_location: string
          id?: string
          price_per_km: number
          start_location: string
          status?: string
          truck_owner_id: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          available_date?: string
          available_time?: string | null
          capacity?: number
          capacity_unit?: string
          created_at?: string
          end_location?: string
          id?: string
          price_per_km?: number
          start_location?: string
          status?: string
          truck_owner_id?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "truck_routes_truck_owner_id_fkey"
            columns: ["truck_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
