import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all activity logs (admin only)
router.get('/', async (req, res) => {
  try {
    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500) // Limit to last 500 logs

    if (error) throw error

    // Fetch user details for each log
    const logsWithUsers = await Promise.all(
      logs.map(async (log) => {
        if (!log.user_id) {
          return {
            ...log,
            user: null,
          }
        }

        const { data: user } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', log.user_id)
          .single()

        return {
          ...log,
          user,
        }
      })
    )

    res.json(logsWithUsers)
  } catch (error: any) {
    console.error('Error fetching logs:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get user's own activity logs
router.get('/my-logs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    res.json(logs)
  } catch (error: any) {
    console.error('Error fetching user logs:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create activity log (helper function for other routes)
export const logActivity = async (data: {
  user_id?: string
  action: string
  entity_type?: string
  entity_id?: string
  description: string
  metadata?: any
  ip_address?: string
  user_agent?: string
}) => {
  try {
    await supabase.from('activity_logs').insert(data)
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

export default router
