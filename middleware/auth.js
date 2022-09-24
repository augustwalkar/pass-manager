const jwt = require('jsonwebtoken')
const Register = require('../Model/model').Register
require('dotenv').config()
async function auth(req, res, next) {
    try {
        let authenticated = false
        const token = req.cookies.jwtToken;
        if (token) {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
            const Users = await Register.findOne({ _id: verifyToken._id })

            if (Users != null) {
                authenticated = true;
                res.username = Users.name
                res.userEmail = Users.email
            } else {
                authenticated = false;
            }
        }
        res.authenticated = authenticated;
        next()
    } catch (err) {
        console.log(err)
    }
}
async function checkTimedOut(req, res, next) {
    try {
        let authenticated = false;
        const token = req.cookies.changeToken;
        if (token) {
            // const verifyToken = jwt.verify(token, process.env.TIMED_OUT_KEY)
            authenticated = true
        } else {
            authenticated = false;
        }
        res.authenticated = authenticated
        next()
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
async function recoveryTimedOut(req, res, next) {
    try {
        let authenticated = false
        const token = req.cookies.recoverToken;
        if (token) {
            // const verifyToken = jwt.verify(token, process.env.RECOVER_TIMED_OUT_KEY)
            authenticated = true;
        } else {
            authenticated = false;
        }
        res.authenticated = authenticated
        next()
    } catch (err) {
        console.log(err)

    }
}
module.exports = { auth, checkTimedOut, recoveryTimedOut }