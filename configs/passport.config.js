const session = require("express-session")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const flash = require("connect-flash")

const User = require('./../models/user.mondel')

module.exports = app => {

    app.use(session({
        secret: "dance-app2020",
        resave: true,
        saveUninitialized: true
    }))

    passport.serializeUser((user, cb) => cb(null, user._id))

    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            if (err) { return cb(err); }
            cb(null, user);
        })
    })

    app.use(flash())

    passport.use(new LocalStrategy({

        usernameField: 'email',
        passReqToCallback: true

    }, (req, username, password, next) => {

        User.findOne({ email: username }, (err, user) => {

            if (err) {
                return next(err);
            }
            if (!user) {
                return next(null, false, { message: "User not registered, please, create an account" })
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return next(null, false, { message: "Incorrect password, try again" })
            }
            return next(null, user);
        })
    }))


    app.use(passport.initialize())
    app.use(passport.session())

}