<<<<<<< HEAD
import multer from "multer"

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn)
  res.locals.loggedInUser = req.session.user || {}
  next()
}

export const protectedMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next()
  } else {
    return res.redirect("/login")
  }
}

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next()
  } else {
    return res.redirect("/")
  }
}

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
})

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000000,
  },
})
=======
import multer from 'multer'

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    res.locals.loggedInUser = req.session.user || {}
    next()
}

export const protectedMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        return next()
    } else {
        return res.redirect('/login')
    }
} 

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next()
    } else {
        return res.redirect('/')
    }
}

export const avatarUpload = multer({ dest : 'uploads/avatars/', limits : {
    fileSize : 3000000
}})

export const videoUpload = multer({ dest : 'uploads/videos/', limits : {
    fileSize : 10000000000
}})

>>>>>>> 329d88c75d397b779330b0b05daa8669a811fa88
