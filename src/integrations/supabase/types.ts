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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agency_branches: {
        Row: {
          agency_id: string
          city: string
          created_at: string
          id: string
          phone: string | null
          quarter: string | null
        }
        Insert: {
          agency_id: string
          city: string
          created_at?: string
          id?: string
          phone?: string | null
          quarter?: string | null
        }
        Update: {
          agency_id?: string
          city?: string
          created_at?: string
          id?: string
          phone?: string | null
          quarter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_branches_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "bus_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_agencies: {
        Row: {
          active: boolean
          created_at: string
          id: string
          logo_url: string | null
          name: string
          phone: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      shipments: {
        Row: {
          agency_id: string | null
          amount: number
          branch_from: string | null
          branch_to: string | null
          buyer_id: string
          claimed_at: string | null
          created_at: string
          driver_phone: string | null
          escrow_held: boolean
          id: string
          item_title: string | null
          order_id: string | null
          receipt_code: string
          seller_id: string | null
          status: Database["public"]["Enums"]["shipment_status"]
          updated_at: string
          vehicle_plate: string | null
        }
        Insert: {
          agency_id?: string | null
          amount?: number
          branch_from?: string | null
          branch_to?: string | null
          buyer_id: string
          claimed_at?: string | null
          created_at?: string
          driver_phone?: string | null
          escrow_held?: boolean
          id?: string
          item_title?: string | null
          order_id?: string | null
          receipt_code: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          updated_at?: string
          vehicle_plate?: string | null
        }
        Update: {
          agency_id?: string | null
          amount?: number
          branch_from?: string | null
          branch_to?: string | null
          buyer_id?: string
          claimed_at?: string | null
          created_at?: string
          driver_phone?: string | null
          escrow_held?: boolean
          id?: string
          item_title?: string | null
          order_id?: string | null
          receipt_code?: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          updated_at?: string
          vehicle_plate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "bus_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_branch_from_fkey"
            columns: ["branch_from"]
            isOneToOne: false
            referencedRelation: "agency_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_branch_to_fkey"
            columns: ["branch_to"]
            isOneToOne: false
            referencedRelation: "agency_branches"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          cinetpay_transaction_id: string | null
          created_at: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["wallet_tx_status"]
          type: Database["public"]["Enums"]["wallet_tx_type"]
          user_id: string
        }
        Insert: {
          amount: number
          cinetpay_transaction_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["wallet_tx_status"]
          type: Database["public"]["Enums"]["wallet_tx_type"]
          user_id: string
        }
        Update: {
          amount?: number
          cinetpay_transaction_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["wallet_tx_status"]
          type?: Database["public"]["Enums"]["wallet_tx_type"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          currency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          currency?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          currency?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      shipment_status:
        | "pending_at_seller"
        | "received_by_agency"
        | "in_transit"
        | "arrived_at_destination"
        | "claimed_by_buyer"
        | "confirmed_by_buyer"
      wallet_tx_status: "success" | "pending" | "failed"
      wallet_tx_type: "topup" | "payment" | "refund" | "commission" | "payout"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      shipment_status: [
        "pending_at_seller",
        "received_by_agency",
        "in_transit",
        "arrived_at_destination",
        "claimed_by_buyer",
        "confirmed_by_buyer",
      ],
      wallet_tx_status: ["success", "pending", "failed"],
      wallet_tx_type: ["topup", "payment", "refund", "commission", "payout"],
    },
  },
} as const
