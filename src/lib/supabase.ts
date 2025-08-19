import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          user_id?: string;
          wallet_address?: string;
          context: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          wallet_address?: string;
          context: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallet_address?: string;
          context?: any;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          content: string;
          role: 'user' | 'assistant';
          timestamp: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          content: string;
          role: 'user' | 'assistant';
          timestamp?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          content?: string;
          role?: 'user' | 'assistant';
          timestamp?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          wallet_address?: string;
          source: string;
          interests: string[];
          messages: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          wallet_address?: string;
          source: string;
          interests?: string[];
          messages?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          wallet_address?: string;
          source?: string;
          interests?: string[];
          messages?: string[];
        };
      };
      analytics_events: {
        Row: {
          id: string;
          event: string;
          properties: any;
          session_id?: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          event: string;
          properties: any;
          session_id?: string;
          timestamp?: string;
        };
        Update: {
          id?: string;
          event?: string;
          properties?: any;
          session_id?: string;
          timestamp?: string;
        };
      };
    };
  };
}