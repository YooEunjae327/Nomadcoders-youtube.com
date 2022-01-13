import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import rootRouter from './routers/rootRouter'
import videoRouter from './routers/videoRouter'
import userRouter from './routers/userRouter'
import { localsMiddleware } from './middlewares'

const app = express()

app.set('view engine', 'pug')
app.set('views', './src/views')
app.use(express.urlencoded({ extended : true}))

app.use(
    session({
        secret : process.env.COKIE_SECRET,
        resave : false,
        saveUninitialized : false,
        store : MongoStore.create({ mongoUrl : process.env.DB_URL })
    })
)

app.use(localsMiddleware)
app.use('/uploads', express.static('uploads'))
app.use('/', rootRouter)
app.use('/videos', videoRouter)
app.use('/users', userRouter)

export default app
 


 

