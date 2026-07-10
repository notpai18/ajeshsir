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
      announcements: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["announcement_category"]
          created_at: string
          id: string
          pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          id?: string
          pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      doubt_replies: {
        Row: {
          attachment_urls: string[] | null
          audio_urls: string[] | null
          created_at: string
          doubt_id: string
          id: string
          image_urls: string[] | null
          is_edited: boolean
          professor_id: string
          reply_order: number
          reply_text: string | null
          updated_at: string
          video_urls: string[] | null
        }
        Insert: {
          attachment_urls?: string[] | null
          audio_urls?: string[] | null
          created_at?: string
          doubt_id: string
          id?: string
          image_urls?: string[] | null
          is_edited?: boolean
          professor_id: string
          reply_order?: number
          reply_text?: string | null
          updated_at?: string
          video_urls?: string[] | null
        }
        Update: {
          attachment_urls?: string[] | null
          audio_urls?: string[] | null
          created_at?: string
          doubt_id?: string
          id?: string
          image_urls?: string[] | null
          is_edited?: boolean
          professor_id?: string
          reply_order?: number
          reply_text?: string | null
          updated_at?: string
          video_urls?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "doubt_replies_doubt_id_fkey"
            columns: ["doubt_id"]
            isOneToOne: false
            referencedRelation: "doubts"
            referencedColumns: ["id"]
          }
        ]
      }
      doubts: {
        Row: {
          answer_text: string | null
          attachment_name: string | null
          attachment_url: string | null
          created_at: string
          email: string
          id: string
          is_answered: boolean
          name: string
          question: string
          subject: string
          updated_at: string
        }
        Insert: {
          answer_text?: string | null
          attachment_name?: string | null
          attachment_url?: string | null
          created_at?: string
          email: string
          id?: string
          is_answered?: boolean
          name: string
          question: string
          subject: string
          updated_at?: string
        }
        Update: {
          answer_text?: string | null
          attachment_name?: string | null
          attachment_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_answered?: boolean
          name?: string
          question?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at: string
          description: string
          download_count: number
          file_size: string
          file_url: string
          id: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          description?: string
          download_count?: number
          file_size?: string
          file_url?: string
          id?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          chapter?: string
          course?: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          description?: string
          download_count?: number
          file_size?: string
          file_url?: string
          id?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      practice_sheets: {
        Row: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at: string
          description: string
          file_size: string
          file_url: string
          id: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          description?: string
          file_size?: string
          file_url?: string
          id?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          chapter?: string
          course?: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          description?: string
          file_size?: string
          file_url?: string
          id?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      pyqs: {
        Row: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          question_size: string
          question_url: string
          solution_size: string
          solution_url: string
          subject: string
          updated_at: string
          year: number
        }
        Insert: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          question_size?: string
          question_url?: string
          solution_size?: string
          solution_url?: string
          subject: string
          updated_at?: string
          year: number
        }
        Update: {
          chapter?: string
          course?: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          question_size?: string
          question_url?: string
          solution_size?: string
          solution_url?: string
          subject?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      videos: {
        Row: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at: string
          description: string
          duration: string
          id: string
          subject: string
          thumbnail: string
          title: string
          updated_at: string
          youtube_link: string
        }
        Insert: {
          chapter: string
          course: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          description?: string
          duration?: string
          id?: string
          subject: string
          thumbnail?: string
          title: string
          updated_at?: string
          youtube_link: string
        }
        Update: {
          chapter?: string
          course?: Database["public"]["Enums"]["exam_type"]
          created_at?: string
          description?: string
          duration?: string
          id?: string
          subject?: string
          thumbnail?: string
          title?: string
          updated_at?: string
          youtube_link?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_professor: { Args: never; Returns: boolean }
    }
    Enums: {
      announcement_category: "general" | "exam" | "resource" | "schedule"
      chemistry_subject: "Physical Chemistry" | "Organic Chemistry" | "Inorganic Chemistry"
      difficulty_level: "Easy" | "Medium" | "Hard"
      exam_type: "jee-main" | "jee-advanced" | "neet" | "net" | "msc-entrance"
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
    Enums: {
      announcement_category: ["general", "exam", "resource", "schedule"],
      chemistry_subject: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"],
      difficulty_level: ["Easy", "Medium", "Hard"],
      exam_type: ["jee-main", "jee-advanced", "neet", "net", "msc-entrance"],
    },
  },
} as const

