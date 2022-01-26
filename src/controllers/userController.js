import User from "../models/User"
import Video from "../models/Video"
import bcrypt from "bcrypt"
import fetch from "node-fetch"

export const getJoin = (req, res) => res.render("join", { pagetitle: "Join" })
export const postJoin = async (req, res) => {
  console.log(req.body)
  const { name, username, email, password, password2, location } = req.body
  const pagetitle = "Join"

  if (password !== password2) {
    return res.status(400).render("join", {
      pagetitle,
      errorMessage: "Passsword confirmation does not match.",
    })
  }

  const exists = await User.exists({ $or: [{ username }, { email }] })
  if (exists) {
    return res.status(400).render("join", {
      pagetitle,
      errorMessage: "This username/email is already taken.",
    })
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).render("join", {
      pagetitle: "Join",
      errorMessage: err._message,
    })
  }
  return res.redirect("/login")
}

export const getLogin = (req, res) =>
  res.render("Login", { pagetitle: "Login" })

export const postLogin = async (req, res) => {
  const { username, password } = req.body
  const pagetitle = "Login"
  const user = await User.findOne({ username, socialOnly: false })
  if (!user) {
    return res
      .status(400)
      .render("login", {
        pagetitle,
        errorMessage: "An account with this username does not exists.",
      })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    return res
      .status(400)
      .render("login", { pagetitle, errorMessage: "Wrong password" })
  }
  req.session.loggedIn = true
  req.session.user = user
  return res.redirect("/")
}

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize"
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  }
  const params = new URLSearchParams(config).toString()
  const finalUrl = `${baseUrl}?${params}`
  return res.redirect(finalUrl)
}

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token"

  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  }
  const params = new URLSearchParams(config).toString()
  const finalUrl = `${baseUrl}?${params}`

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json()

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest

    const apiUrl = "https://api.github.com"
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json()

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json()
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    )
    if (!emailObj) {
      return res.redirect("/login")
    }
    let user = await User.findOne({ email: emailObj.email })
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      })
    }
    req.session.loggedIn = true
    req.session.user = user
    return res.redirect("/")
  } else {
    return res.redirect("/login")
  }
}

export const logout = (req, res) => {
  req.session.destroy()
  return res.redirect("/")
}

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pagetitle: "Edit Profile" })
}
export const postEdit = async (req, res) => {
  const { file } = req

  const {
    user: { _id, avatarUrl },
  } = req.session
  const { name, email, username, location } = req.body

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  )
  req.session.user = updatedUser
  return res.redirect("/users/edit")
}

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/")
  }
  return res.render("users/change-password", { pagetitle: "Change Password" })
}
export const postChangePassword = async (req, res) => {
  const {
    user: { _id, password },
  } = req.session
  const { oldPassword, newPassword, newPasswordConfirmation } = req.body

  const ok = await bcrypt.compare(oldPassword, password)
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pagetitle: "Change Password",
      errorMessage: "The current password is incorrect",
    })
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pagetitle: "Change Password",
      errorMessage: "The password deos not match the confirmaiton",
    })
  }

  const user = await User.findById(_id)
  user.password = newPassword
  await user.save()
  req.session.user.password = user.password

  return res.redirect("/")
}

export const see = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) {
    return res.status(404).render("404", { pagetitle: "User not found " })
  }
  const videos = await Video.find({ owner : user._id })
  console.log(videos)
  return res.render("users/profile", { pagetitle: user.name, user, videos })
}
