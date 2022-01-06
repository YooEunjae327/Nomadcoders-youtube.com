import express from "express"
import { getEdit,  watch, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController"

const videoRouter = express.Router()

videoRouter.route('/upload').get(getUpload).post(postUpload)
videoRouter.get('/:id', watch)
videoRouter.route('/:id/edit').get(getEdit).post(postEdit)
videoRouter.route('/:id/delete').get(deleteVideo)


export default videoRouter
