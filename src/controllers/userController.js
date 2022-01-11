import User from '../models/User'
import bcrypt from 'bcrypt'
import fetch from 'node-fetch'
import { json, response } from 'express'

export const getJoin = (req, res) => res.render('join', { pagetitle : 'Join'})
export const postJoin = async (req, res) => {
    console.log(req.body)
    const { name, username, email, password, password2, location } = req.body
    const pagetitle = 'Join'

    if(password !== password2) {
        return res.status(400).render('join',{ 
            pagetitle,
            errorMessage : 'Passsword confirmation does not match.'
        })
    }

    const exists = await User.exists({$or : [{username }, { email }] })
    if(exists) {
        return res.status(400).render('join',{ 
            pagetitle,
            errorMessage : 'This username is already taken.'
    })
    }

    try {
        await User.create({
            name,
            username,
            email,
            password,
            location
        })
    } catch(err) {
        console.log(err)
        return res.status(400).render('join', {
        pagetitle : 'Join', 
        errorMessage : err._message, 
        })
    }
    return res.redirect('/login')
}


export const getLogin = (req, res) => res.render('Login', { pagetitle : 'Login'})

export const postLogin = async (req, res) => {
    const { username, password } = req.body
    const pagetitle = 'Login'
    const user = await User.findOne({ username, socialOnly : false })
    if(!user) {
        return res.status(400).render('login', { pagetitle, errorMessage : 'An account with this username does not exists.' })
    }
    
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) {
        return res.status(400).render('login', { pagetitle, errorMessage : 'Wrong password' })
    }
    req.session.loggedIn = true
    req.session.user = user
    return res.redirect('/')
}

export const startGithubLogin = (req, res) => { 
    const baseUrl = 'https://github.com/login/oauth/authorize'
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : 'read:user user:email'
    }
    const params = new URLSearchParams(config).toString()
    const finalUrl = `${baseUrl}?${params}`
    return res.redirect(finalUrl)
}

export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token'

  const config = {
    client_id : process.env.GH_CLIENT,
    client_secret : process.env.GH_SECRET,
    code : req.query.code
  }
  const params = new URLSearchParams(config).toString()
  const finalUrl = `${baseUrl}?${params}`


  const tokenRequest = await (await fetch(finalUrl, {
    method : 'POST',
    headers : {
        Accept : 'application/json',
    }
  })
  ).json()

  if('access_token' in  tokenRequest ) {
    const { access_token } = tokenRequest

    const apiUrl = 'https://api.github.com'
    const userData = await (await fetch(`${apiUrl}/user`, {
        headers : {
            Authorization : `token ${access_token}`
        }
    })
    ).json()

    const emailData = await (await fetch(`${apiUrl}/user/emails`, {
        headers : {
            Authorization : `token ${access_token}`
        }
    })
    ).json()
    const emailObj = emailData.find(email => email.primary === true && email.verified === true)
    if(!emailObj) {
        return res.redirect('/login')
    }
    let user = await User.findOne({ email : emailObj.email })
    if (!user) {
        user = await User.create({
            avatarUrl : userData.avatar_url,
            name : userData.name,
            username : userData.login,
            email : emailObj.email,
            password : '',
            socialOnly : true,
            location : userData.location
        })
    }
    req.session.loggedIn = true
    req.session.user = user
    return res.redirect('/') 
  
  } else {
    return res.redirect('/login')
  }
}

export const edit = (req, res) => res.send('Edit User')
export const logout = (req, res) => {
    req.session.destroy()
    return res.redirect('/')
}
export const see = (req, res) => res.see('See User')

