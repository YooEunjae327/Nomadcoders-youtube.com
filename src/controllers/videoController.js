import { response } from 'express'
import Video from '../models/Video'

export const home = async(req, res) => {
    try {
    const videos = await Video.find({})
    // console.log(videos)
    return res.render('home', { pagetitle : "Home", videos}) 
    } catch {
        console.log('err')
    }
}
export const watch = async (req, res) => {    
    const { id } = req.params
    const video = await Video.findById(id)
    if(video) {
        return res.render('watch', { pagetitle : video.title, video})
    }
    return res.render('404', { pagetitle : 'Video not found.' })
}
export const getEdit = (req, res) => {
    const { id } = req.params
    return res.render('edit', {pagetitle : `Editing`})
}
export const postEdit = (req, res) => {
    const {  id } = req.params
    const { title } = req.body
    return res.redirect(`/videos/${id}`)
}

export const getUpload = (req, res) => {
    return res.render('upload', {pagetitle : 'Upload Video'})
}

export const postUpload = async (req, res) => {
    const { title, description, hashtags} = req.body
    // const video = new Video ({
    //     title : title,
    //     description : description,
    //     createdAt : Date.now(),
    //     hashtags : hashtags.split(',').map(word => `#${word}`),
    //     meta : {
    //         views : 0,  
    //         rating : 0,
    //     }
    // })
    // await video.save() 
    
    try {
        await Video.create({
            title : title,
            description : description,
            hashtags : hashtags.split(',').map(word => `#${word}`),
        })
        return res.redirect('/')
    } catch(err) {
        console.log(err)
        return res.render('upload', {
        pagetitle : 'Upload Video', 
        errorMessage : err._message, 
        })
    }

     
}