export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          icp: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          icp?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          icp?: string | null
        }
      }
      icp_history: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      biographies: {
        Row: {
          id: string
          user_id: string
          name_and_role: string
          company_name: string
          niche: string
          help_description: string
          services: string
          experience: string
          achievements: string
          recognition: string | null
          differential: string
          best_clients: string
          preferred_clients: string
          avoid_clients: string | null
          additional_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name_and_role: string
          company_name: string
          niche: string
          help_description: string
          services: string
          experience: string
          achievements: string
          recognition?: string | null
          differential: string
          best_clients: string
          preferred_clients: string
          avoid_clients?: string | null
          additional_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name_and_role?: string
          company_name?: string
          niche?: string
          help_description?: string
          services?: string
          experience?: string
          achievements?: string
          recognition?: string | null
          differential?: string
          best_clients?: string
          preferred_clients?: string
          avoid_clients?: string | null
          additional_info?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
