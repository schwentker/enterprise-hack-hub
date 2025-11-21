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
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      awards: {
        Row: {
          award_type: string
          awarded_at: string
          id: string
          submission_id: string
        }
        Insert: {
          award_type: string
          awarded_at?: string
          id?: string
          submission_id: string
        }
        Update: {
          award_type?: string
          awarded_at?: string
          id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "awards_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          prize_amount: number | null
          recommended_track: string | null
          sponsor: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          prize_amount?: number | null
          recommended_track?: string | null
          sponsor?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          prize_amount?: number | null
          recommended_track?: string | null
          sponsor?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_settings: {
        Row: {
          auto_advance_phases: boolean | null
          current_phase: string
          event_end_date: string | null
          event_name: string
          event_start_date: string | null
          event_status: string
          id: string
          next_phase_at: string | null
          registration_deadline: string | null
          registration_limit: number | null
          settings: Json | null
          submission_deadline: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          auto_advance_phases?: boolean | null
          current_phase?: string
          event_end_date?: string | null
          event_name?: string
          event_start_date?: string | null
          event_status?: string
          id?: string
          next_phase_at?: string | null
          registration_deadline?: string | null
          registration_limit?: number | null
          settings?: Json | null
          submission_deadline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          auto_advance_phases?: boolean | null
          current_phase?: string
          event_end_date?: string | null
          event_name?: string
          event_start_date?: string | null
          event_status?: string
          id?: string
          next_phase_at?: string | null
          registration_deadline?: string | null
          registration_limit?: number | null
          settings?: Json | null
          submission_deadline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          integration_type: string
          settings: Json | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          integration_type: string
          settings?: Json | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          integration_type?: string
          settings?: Json | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      judge_assignments: {
        Row: {
          assigned_at: string
          id: string
          judge_id: string
          submission_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          judge_id: string
          submission_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          judge_id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_assignments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          subject: string
          template_type: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          subject: string
          template_type: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          subject?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      prizes: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          prize_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          prize_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          prize_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          agreed_to_code_of_conduct: boolean
          challenges: string[]
          company: string | null
          created_at: string
          email: string
          experience_level: string
          full_name: string
          how_heard: string
          id: string
          registration_number: number
          role: string
          team_status: string
          track: string
        }
        Insert: {
          agreed_to_code_of_conduct?: boolean
          challenges: string[]
          company?: string | null
          created_at?: string
          email: string
          experience_level: string
          full_name: string
          how_heard: string
          id?: string
          registration_number?: number
          role: string
          team_status: string
          track: string
        }
        Update: {
          agreed_to_code_of_conduct?: boolean
          challenges?: string[]
          company?: string | null
          created_at?: string
          email?: string
          experience_level?: string
          full_name?: string
          how_heard?: string
          id?: string
          registration_number?: number
          role?: string
          team_status?: string
          track?: string
        }
        Relationships: []
      }
      scores: {
        Row: {
          comments: string | null
          id: string
          impact_score: number
          innovation_score: number
          judge_id: string
          platform_score: number
          quality_score: number
          scored_at: string
          submission_id: string
        }
        Insert: {
          comments?: string | null
          id?: string
          impact_score: number
          innovation_score: number
          judge_id: string
          platform_score: number
          quality_score: number
          scored_at?: string
          submission_id: string
        }
        Update: {
          comments?: string | null
          id?: string
          impact_score?: number
          innovation_score?: number
          judge_id?: string
          platform_score?: number
          quality_score?: number
          scored_at?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scores_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          demo_link: string | null
          description: string | null
          id: string
          project_name: string
          repo_link: string | null
          slides_link: string | null
          status: string
          submitted_at: string
          team_id: string
          updated_at: string
          video_link: string | null
        }
        Insert: {
          created_at?: string
          demo_link?: string | null
          description?: string | null
          id?: string
          project_name: string
          repo_link?: string | null
          slides_link?: string | null
          status?: string
          submitted_at?: string
          team_id: string
          updated_at?: string
          video_link?: string | null
        }
        Update: {
          created_at?: string
          demo_link?: string | null
          description?: string | null
          id?: string
          project_name?: string
          repo_link?: string | null
          slides_link?: string | null
          status?: string
          submitted_at?: string
          team_id?: string
          updated_at?: string
          video_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          registration_id: string
          role: string | null
          team_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          registration_id: string
          role?: string | null
          team_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          registration_id?: string
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          team_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          team_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_notes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_seekers: {
        Row: {
          created_at: string
          email: string
          id: string
          looking_for_team: boolean
          role: string
          skills_needed: string[]
          skills_offered: string[]
          track: string
          user_name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          looking_for_team?: boolean
          role: string
          skills_needed?: string[]
          skills_offered?: string[]
          track: string
          user_name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          looking_for_team?: boolean
          role?: string
          skills_needed?: string[]
          skills_offered?: string[]
          track?: string
          user_name?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          challenge: string | null
          created_at: string
          id: string
          max_members: number
          name: string
          status: string
          track: string
          updated_at: string
        }
        Insert: {
          challenge?: string | null
          created_at?: string
          id?: string
          max_members?: number
          name: string
          status?: string
          track: string
          updated_at?: string
        }
        Update: {
          challenge?: string | null
          created_at?: string
          id?: string
          max_members?: number
          name?: string
          status?: string
          track?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_registration_number: { Args: never; Returns: number }
      get_submission_average_score: {
        Args: { submission_uuid: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "organizer" | "judge"
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
      app_role: ["admin", "organizer", "judge"],
    },
  },
} as const
