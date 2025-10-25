import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all transactions (admin only)
router.get('/', async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Fetch user details for each transaction
    const transactionsWithUsers = await Promise.all(
      transactions.map(async (transaction) => {
        const { data: user } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', transaction.user_id)
          .single()

        return {
          ...transaction,
          user,
        }
      })
    )

    res.json(transactionsWithUsers)
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get user's own transactions
router.get('/my-transactions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(transactions)
  } catch (error: any) {
    console.error('Error fetching user transactions:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    // Fetch user details
    const { data: user } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', transaction.user_id)
      .single()

    res.json({
      ...transaction,
      user,
    })
  } catch (error: any) {
    console.error('Error fetching transaction:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
