import express from "express"
import { 
    getEdit,
    postEdit,
    logout, 
    see, 
    startGithubLogin, 
    finishGithubLogin, 
    getJoin, 
    postJoin, 
    getChangePassword, 
    postChangePassword
} from '../controllers/userController'
import { avatarUpload, protectedMiddleware, publicOnlyMiddleware } from '../middlewares'

const userRouter = express.Router()

userRouter.get('/logout', protectedMiddleware, logout)
userRouter.route('/edit').all(protectedMiddleware).get(getEdit).post(avatarUpload.single('avatar'), postEdit)
userRouter.route('/change-password').all(protectedMiddleware).get(getChangePassword).post(postChangePassword)
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin)
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin)

userRouter.get('/:id', see)

export default userRouter
