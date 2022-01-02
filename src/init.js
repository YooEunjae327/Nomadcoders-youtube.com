import './db'
import './models/Video'
import app from './server'
const PORT = 3000

app.listen(PORT, () => {
    console.log(`✅ Server running on port:${PORT}`)
})
