import express from "express"
import { getEdit,  watch, postEdit, getUpload, postUpload } from "../controllers/videoController"

const videoRouter = express.Router()

videoRouter.route('/upload').get(getUpload).post(postUpload)
videoRouter.get('/:id', watch)
videoRouter.route('/:id/edit').get(getEdit).post(postEdit)
videoRouter.route

export default videoRouter
