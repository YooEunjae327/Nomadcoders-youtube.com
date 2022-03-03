import "dotenv/config"
import "./db"
import "./models/Video"
import "./models/User"
import app from "./server"
const PORT = 4000

app.listen(PORT, () => {
  console.log(`✅ Server running on port:${PORT}`)
})
