import User from '../models/User'

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


export const getLogin = (req, res) => res.send('Login')
export const postLogin = (req, res) => res.send('Login')

export const edit = (req, res) => res.send('Edit User')
export const remove = (req, res) => res.send('Remove User')
export const logout = (req, res) => res.send('Logout')
export const see = (req, res) => res.see('See User')

