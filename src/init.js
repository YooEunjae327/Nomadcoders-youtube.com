<<<<<<< HEAD
import "dotenv/config"
import "./db"
import "./models/Video"
import "./models/User"
import app from "./server"
const PORT = 4000
=======
import 'dotenv/config'
import './db'
import './models/Video'
import './models/User'
import app from './server'
const PORT = 3000
>>>>>>> 329d88c75d397b779330b0b05daa8669a811fa88

app.listen(PORT, () => {
  console.log(`✅ Server running on port:${PORT}`)
})
