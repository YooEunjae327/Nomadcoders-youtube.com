import express from 'express'
import session from 'express-session'
import rootRouter from './routers/rootRouter'
import videoRouter from './routers/videoRouter'
import userRouter from './routers/userRouter'

const app = express()

app.set('view engine', 'pug')
app.set('views', './src/views')
app.use(express.urlencoded({ extended : true}))

app.use(
    session({
        secret : 'Hello!',
        resave : true,
        saveUninitialized : true,
    })
)

app.use((req, res, next) => {
    console.log(req)
    req.sessionStore.all((err, sessions) => {
        console.log(sessions)
        next()
    })
})

app.use('/', rootRouter)
app.use('/videos', videoRouter)
app.use('/user', userRouter)

export default app



 

