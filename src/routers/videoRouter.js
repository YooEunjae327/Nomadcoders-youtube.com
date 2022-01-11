import express from "express"
import { getEdit,  watch, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController"
import { protectedMiddleware } from "../middlewares"

const videoRouter = express.Router()

videoRouter.route('/upload').all(protectedMiddleware).get(getUpload).post(postUpload)
videoRouter.get('/:id', watch)
videoRouter.route('/:id/edit').all(protectedMiddleware).get(getEdit).post(postEdit)
videoRouter.route('/:id/delete').all(protectedMiddleware).get(deleteVideo)


export default videoRouter
