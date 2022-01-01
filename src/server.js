
import express from 'express'
import globalRouter from './routers/globalRouter'
import videoRouter from './routers/videoRouter'
import userRouter from './routers/userRouter'

const app = express()

app.set('view engine', 'pug')
app.set('views', './src/views')
app.use(express.urlencoded({ extended : true}))

app.use('/', globalRouter)
app.use('/videos', videoRouter)
app.use('/user', userRouter)

export default app

 

