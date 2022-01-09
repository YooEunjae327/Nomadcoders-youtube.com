export const localsMiddleware = (req, res, next) => {
    console.log(req.session)
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    // req.locals.stieName = 'Wetube'
    console.log(res.locals)
    next()
}