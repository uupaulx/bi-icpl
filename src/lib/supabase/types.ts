export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: "admin" | "user";
          department: string | null;
          is_active: boolean;
          avatar_url: string | null;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          display_name: string;
          role?: "admin" | "user";
          department?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          role?: "admin" | "user";
          department?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          embed_url: string;
          category_id: string;
          sort_order: number;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          embed_url: string;
          category_id: string;
          sort_order?: number;
          is_active?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          embed_url?: string;
          category_id?: string;
          sort_order?: number;
          is_active?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_report_access: {
        Row: {
          id: string;
          user_id: string;
          report_id: string;
          granted_by: string;
          granted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_id: string;
          granted_by: string;
          granted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          report_id?: string;
          granted_by?: string;
          granted_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "admin" | "user";
    };
  };
}

// Helper types for API responses
export type DbUser = Database["public"]["Tables"]["users"]["Row"];
export type DbCategory = Database["public"]["Tables"]["categories"]["Row"];
export type DbReport = Database["public"]["Tables"]["reports"]["Row"];
export type DbUserReportAccess = Database["public"]["Tables"]["user_report_access"]["Row"];
export type DbActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
