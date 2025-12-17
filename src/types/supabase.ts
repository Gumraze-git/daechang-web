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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name_en: string | null
          name_ko: string
          specs: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name_en?: string | null
          name_ko: string
          specs?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name_en?: string | null
          name_ko?: string
          specs?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      history: {
        Row: {
          content_en: string | null
          content_ko: string
          created_at: string
          id: string
          month: string
          year: string
        }
        Insert: {
          content_en?: string | null
          content_ko: string
          created_at?: string
          id?: string
          month: string
          year: string
        }
        Update: {
          content_en?: string | null
          content_ko?: string
          created_at?: string
          id?: string
          month?: string
          year?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          body_en: string | null
          body_ko: string | null
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          is_pinned: boolean | null
          published_at: string | null
          status: string | null
          title_en: string | null
          title_ko: string
          updated_at: string
          views: number | null
        }
        Insert: {
          body_en?: string | null
          body_ko?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          published_at?: string | null
          status?: string | null
          title_en?: string | null
          title_ko: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          body_en?: string | null
          body_ko?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          published_at?: string | null
          status?: string | null
          title_en?: string | null
          title_ko?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name_en: string | null
          name_ko: string
          type: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name_en?: string | null
          name_ko: string
          type?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name_en?: string | null
          name_ko?: string
          type?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      product_notices: {
        Row: {
          notice_id: string
          product_id: string
        }
        Insert: {
          notice_id: string
          product_id: string
        }
        Update: {
          notice_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_notices_notice_id_fkey"
            columns: ["notice_id"]
            isOneToOne: false
            referencedRelation: "notices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_notices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          capacity: string | null
          category_code: string
          created_at: string
          desc_en: string | null
          desc_ko: string | null
          id: string
          images: string[] | null
          model_no: string | null
          name_en: string
          name_ko: string
          partner_id: string | null
          specs: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          capacity?: string | null
          category_code: string
          created_at?: string
          desc_en?: string | null
          desc_ko?: string | null
          id?: string
          images?: string[] | null
          model_no?: string | null
          name_en: string
          name_ko: string
          partner_id?: string | null
          specs?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: string | null
          category_code?: string
          created_at?: string
          desc_en?: string | null
          desc_ko?: string | null
          id?: string
          images?: string[] | null
          model_no?: string | null
          name_en?: string
          name_ko?: string
          partner_id?: string | null
          specs?: Json | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
