import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/auth'
import productsRoutes from './routes/products'
import categoriesRoutes from './routes/categories'
import cartRoutes from './routes/cart'
import ordersRoutes from './routes/orders'
import usersRoutes from './routes/users'
import transactionsRoutes from './routes/transactions'
import logsRoutes from './routes/logs'
import contactRoutes from './routes/contact'
import wishlistRoutes from './routes/wishlist'

dotenv.config()
// Also load monorepo root .env (does not override keys already set from apps/api/.env).
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const app = express()
const PORT = Number(process.env.PORT) || 4000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Concise request log — visible when web/admin logs are hidden in `npm run dev`.
app.use((req, res, next) => {
  const started = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - started
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`)
  })
  next()
})

app.get('/', (req, res) => {
  res.json({ message: 'Riyansh E-Commerce API' })
})


app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/logs', logsRoutes)
app.use('/api/contact', contactRoutes)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app
  .listen(PORT, '0.0.0.0', () => {
    console.log(`API server running on http://0.0.0.0:${PORT}`)
    console.log(`  local:   http://localhost:${PORT}`)
    console.log(`  LAN:     http://<your-lan-ip>:${PORT}  (e.g. http://192.168.1.8:${PORT})`)
  })
  .on('error', (err: any) => {
    console.error('Server error:', err)
  })
