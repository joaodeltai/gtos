import { SupabaseClient } from "@supabase/supabase-js"

export async function saveIcpToHistory(content: string, supabase: SupabaseClient) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      throw sessionError
    }
    
    if (!session) {
      console.error('No session found')
      throw new Error('No session found')
    }

    console.log('Attempting to save ICP to history for user:', session.user.id)
    
    const { data, error } = await supabase
      .from('icp_history')
      .insert({
        user_id: session.user.id,
        content: content,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting into icp_history:', error)
      throw error
    }

    console.log('Successfully saved ICP to history:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error in saveIcpToHistory:', error)
    return { success: false, error }
  }
}
