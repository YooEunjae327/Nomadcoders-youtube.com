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
    if(!video) {
        return res.render('404', { pagetitle : 'Video not found.' })
    }
    return res.render('watch', { pagetitle : video.title, video})
}
export const getEdit = async (req, res) => {
    const { id } = req.params
    const video = await Video.findById(id)
    if(!video) {
        return res.render('404', { pagetitle : 'Video not found.' })
    }
    return res.render('edit', {pagetitle : `Edit:${video.title}`, video})
}
export const postEdit = async (req, res) => {
    const { id } = req.params
    const { title, description, hashtags } = req.body

    const video = await Video.exists({_id : id})
    //const video = await Video.findById(id)

    if(!video) {
        return res.render('404', { pagetitle : 'Video not found.' })
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags : Video.formatHashtags(hashtags)
    })
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
            hashtags : Video.formatHashtags(hashtags),
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