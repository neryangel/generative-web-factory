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
  public: {
    Tables: {
      assets: {
        Row: {
          alt_text: string | null
          created_at: string | null
          filename: string
          id: string
          metadata: Json | null
          mime_type: string
          site_id: string | null
          size_bytes: number | null
          storage_path: string
          tenant_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          filename: string
          id?: string
          metadata?: Json | null
          mime_type: string
          site_id?: string | null
          size_bytes?: number | null
          storage_path: string
          tenant_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          filename?: string
          id?: string
          metadata?: Json | null
          mime_type?: string
          site_id?: string | null
          size_bytes?: number | null
          storage_path?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          payload: Json | null
          site_id: string | null
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          payload?: Json | null
          site_id?: string | null
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          payload?: Json | null
          site_id?: string | null
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          cf_hostname_id: string | null
          created_at: string | null
          domain: string
          id: string
          site_id: string
          ssl_status: string | null
          status: Database["public"]["Enums"]["domain_status"] | null
          tenant_id: string
          verified_at: string | null
        }
        Insert: {
          cf_hostname_id?: string | null
          created_at?: string | null
          domain: string
          id?: string
          site_id: string
          ssl_status?: string | null
          status?: Database["public"]["Enums"]["domain_status"] | null
          tenant_id: string
          verified_at?: string | null
        }
        Update: {
          cf_hostname_id?: string | null
          created_at?: string | null
          domain?: string
          id?: string
          site_id?: string
          ssl_status?: string | null
          status?: Database["public"]["Enums"]["domain_status"] | null
          tenant_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string | null
          id: string
          is_homepage: boolean | null
          seo: Json | null
          site_id: string
          slug: string
          sort_order: number | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_homepage?: boolean | null
          seo?: Json | null
          site_id: string
          slug: string
          sort_order?: number | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_homepage?: boolean | null
          seo?: Json | null
          site_id?: string
          slug?: string
          sort_order?: number | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      publishes: {
        Row: {
          changelog: string | null
          id: string
          is_current: boolean | null
          published_at: string | null
          published_by: string | null
          site_id: string
          snapshot: Json
          tenant_id: string
          version: number
        }
        Insert: {
          changelog?: string | null
          id?: string
          is_current?: boolean | null
          published_at?: string | null
          published_by?: string | null
          site_id: string
          snapshot: Json
          tenant_id: string
          version: number
        }
        Update: {
          changelog?: string | null
          id?: string
          is_current?: boolean | null
          published_at?: string | null
          published_by?: string | null
          site_id?: string
          snapshot?: Json
          tenant_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "publishes_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publishes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      section_registry: {
        Row: {
          created_at: string | null
          default_content: Json
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          schema: Json
          supported_variants: string[] | null
          type: string
        }
        Insert: {
          created_at?: string | null
          default_content?: Json
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          schema?: Json
          supported_variants?: string[] | null
          type: string
        }
        Update: {
          created_at?: string | null
          default_content?: Json
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          schema?: Json
          supported_variants?: string[] | null
          type?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          page_id: string
          settings: Json | null
          sort_order: number | null
          tenant_id: string
          type: string
          updated_at: string | null
          variant: string | null
        }
        Insert: {
          content?: Json
          created_at?: string | null
          id?: string
          page_id: string
          settings?: Json | null
          sort_order?: number | null
          tenant_id: string
          type: string
          updated_at?: string | null
          variant?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          page_id?: string
          settings?: Json | null
          sort_order?: number | null
          tenant_id?: string
          type?: string
          updated_at?: string | null
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string | null
          id: string
          name: string
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["site_status"] | null
          template_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["site_status"] | null
          template_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["site_status"] | null
          template_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sites_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          blueprint_schema: Json
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          blueprint_schema?: Json
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          blueprint_schema?: Json
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tenant_members: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenants: { Args: { p_user_id: string }; Returns: string[] }
      has_tenant_role: {
        Args: {
          p_roles: Database["public"]["Enums"]["user_role"][]
          p_tenant_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      is_tenant_member: {
        Args: { p_tenant_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      domain_status: "pending" | "verifying" | "active" | "failed"
      site_status: "draft" | "published" | "archived"
      user_role: "owner" | "admin" | "editor" | "viewer"
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
    Enums: {
      domain_status: ["pending", "verifying", "active", "failed"],
      site_status: ["draft", "published", "archived"],
      user_role: ["owner", "admin", "editor", "viewer"],
    },
  },
} as const
