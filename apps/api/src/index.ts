import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import productsRoutes from './routes/products'
import categoriesRoutes from './routes/categories'
import cartRoutes from './routes/cart'
import ordersRoutes from './routes/orders'
import usersRoutes from './routes/users'
import transactionsRoutes from './routes/transactions'
import logsRoutes from './routes/logs'
import contactRoutes from './routes/contact'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Riyansh E-Commerce API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/logs', logsRoutes)
app.use('/api/contact', contactRoutes)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app
  .listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`)
  })
  .on('error', (err: any) => {
    console.error('Server error:', err)
  })
