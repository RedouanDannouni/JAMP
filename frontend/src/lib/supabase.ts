import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type LearningGoal = {
  id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

export type LogEntry = {
  id: string
  goal_id: string
  timestamp: string
  status: 'success' | 'failed' | 'flagged'
  raw_output: string | null
  goal?: LearningGoal
}