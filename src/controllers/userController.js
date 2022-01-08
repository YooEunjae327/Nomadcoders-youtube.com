import User from '../models/User'
import bcrypt from 'bcrypt'

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
    const user = await User.findOne({ username })
    if(!user) {
        return res.status(400).render('login', { pagetitle, errorMessage : 'An account with this username does not exists.' })
    }
    
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) {
        return res.status(400).render('login', { pagetitle, errorMessage : 'Wrong password' })
    }
    console.log('LOG USER IN! COMING SOON!')
    return res.redirect('/')
}

export const edit = (req, res) => res.send('Edit User')
export const remove = (req, res) => res.send('Remove User')
export const logout = (req, res) => res.send('Logout')
export const see = (req, res) => res.see('See User')

