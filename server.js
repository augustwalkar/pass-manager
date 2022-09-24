const port = 5000 || process.env.PORT
const hostname = '127.0.0.1'
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
//Middleware
const middleware = require('./middleware/auth')
//Models
const Model = require('./Model/model').Model
const Register = require('./Model/model').Register
require('dotenv').config()
app.set('view engine', 'ejs')
app.set('views', 'Views')
app.use('/static', express.static('Static'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
//GET
app.get('/', middleware.auth, async (req, res) => {
    try {
        res.authenticated = false;
        if (res.authenticated) {
            const userEmail = res.userEmail
            const Data = await Model.find({ userEmail })
            return res.render('home', { Data, title: res.username })
        } else {
            res.render('login', { result: null })
        }
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.get('/add', middleware.auth, (req, res) => {
    if (res.authenticated) {
        return res.render('index', { Data: null, title: res.username })
    } else {
        return res.redirect('/')
    }
})
app.get('/signup', (req, res) => {
    res.render('signup', { result: null })
})
app.get('/recovery', middleware.recoveryTimedOut, (req, res) => {
    if (res.authenticated) {
        res.render('recoveryemail')

    } else {
        res.redirect('/signup')
    }
})
app.get('/change/:id', middleware.checkTimedOut, async (req, res) => {
    if (res.authenticated) {
        const { id } = req.params
        res.render('change', { id, result: null })
    } else {

        return res.redirect('/forgot')
    }
})
app.get('/forgot', (req, res) => {
    res.render('forgot', { result: null })
})
app.get('/return', (req, res) => {
    res.render('return')
})
app.get('/home', middleware.auth, async (req, res) => {
    try {
        if (res.authenticated) {

            const userEmail = res.userEmail
            const Data = await Model.find({ userEmail })
            Data.forEach((data) => {
                console.log(data.appname)
            })
            return res.render('home', { Data, title: res.username })
        } else {
            res.redirect('/')
        }
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.get('/editOne/:id', async (req, res) => {
    try {
        const { id: _id } = req.params
        const singleData = await Model.findOne({ _id })
        if (!singleData) {
            return res.json({ msg: `No data with id : ${_id}` })
        } else {
            return res.render('edit', { singleData })
        }
    } catch (err) {
        console.log(err)
        return res.json({ msg: err })
    }
})
app.get('*', (req, res) => {
    return res.send('Route not found')
})
//POST
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const Users = await Register.findOne({ email })
        if (Users === null) {
            console.log('User not found')
            return res.render('login', { result: 'User not found' })
        } else {
            const Comparing = await bcrypt.compare(password, Users.password)
            if (Comparing) {
                console.log('logged in successfully')
                const token = await Users.generateAuthToken()
                res.cookie('jwtToken', token, {
                    expires: new Date(Date.now() + 600000)

                })
                return res.redirect('/add')
            } else {
                console.log('Incorrect password')
                return res.render('login', { result: 'Incorrect password' })
            }
        }
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.post('/signup', async (req, res) => {
    try {
        const { name, password, email, confirm_password } = req.body
        const Users = await Register.findOne({ email })
        if (Users != null) {
            if (Users?.email === email) {
                console.log('Email already taken')
                return res.render('signup', { result: 'Email already taken' })
            }
        } else {
            if (password !== confirm_password) {
                console.log('password and confirm password are not same')
                return res.render('signup', { result: 'Password and Confirm password are not same' })

            } else {
                const clientRegister = new Register({
                    name,
                    password,
                    email,
                })
                await clientRegister.save()
                const Users = await Register.findOne({ email })
                if (Users) {
                    let recoverToken = jwt.sign({ _id: Users.id }, process.env.RECOVER_TIMED_OUT_KEY)
                    res.cookie('recoverToken', recoverToken, {
                        expires: new Date(Date.now() + 180000)
                    })
                    return res.redirect('/recovery')
                } else {
                    console.log('User not found')
                    res.redirect('/signup')
                }

            }
        }
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.post('/recovery', async (req, res) => {
    try {
        const { recoveryEmail } = req.body
        const token = req.cookies.recoverToken;
        if (token) {
            const verifyToken = jwt.verify(token, process.env.RECOVER_TIMED_OUT_KEY)
            await Register.findOneAndUpdate({ _id: verifyToken._id }, { recoveryEmail })

            return res.redirect('/')
        } else {
            console.log('Token not found')
            return res.redirect('/signup')
        }

    } catch (err) {
        console.log(err)
        return res.send(err)

    }

})
app.post('/add', async (req, res) => {
    try {
        const { appname, username, password, email } = req.body
        const token = req.cookies.jwtToken
        if (token) {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
            const Users = await Register.findOne({ _id: verifyToken })
            const userEmail = Users.email
            if (Users != null) {
                const clientData = new Model({
                    appname,
                    username,
                    email,
                    password,
                    userEmail
                })
                await clientData.save()
                console.log('Added')
                return res.redirect('/home')
            } else {
                console.log('User not found')
                return res.redirect('/add')
            }

        } else {
            console.log('Token not found')
            return res.redirect('/')
        }


    } catch (err) {

        console.log(err)
        return res.send(err)
    }
})
app.post('/change/:id', async (req, res) => {
    try {
        const { id: _id } = req.params
        const { password, newpassword, confirmpassword } = req.body
        const token = req.cookies.changeToken
        if (token) {
            const verifyToken = jwt.verify(token, process.env.TIMED_OUT_KEY)

            const Users = await Register.findOne({ _id: verifyToken })
            console.log(Users.email)
            if (Users === null) {
                console.log('User not found')
                return res.render('change', { id: _id, result: 'User not found' })
            } else {
                const Comparing = await bcrypt.compare(password, Users.password)
                if (Comparing) {
                    if (newpassword === confirmpassword) {
                        const hashedPass = await bcrypt.hash(newpassword, 10)
                        await Register.updateOne({ _id }, { $set: { password: hashedPass } })
                        console.log('Password changed successfully')
                        return res.redirect('/')
                    } else {
                        return res.render('change', { id: _id, result: "New passowrd and Confirm password doesn't match" })
                    }

                } else {
                    console.log('Wrong password')
                    return res.render('change', { id: _id, result: 'Wrong password' })
                }
            }
        } else {
            console.log('Token not found')
            return res.redirect('/forgot')
        }

    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.post('/forgot', async (req, res) => {
    try {
        const { email, recoveryEmail } = req.body
        const Users = await Register.findOne({ email, })
        if (Users) {
            if (recoveryEmail === Users.recoveryEmail) {
                let changeToken = jwt.sign({ _id: Users.id }, process.env.TIMED_OUT_KEY)
                res.cookie('changeToken', changeToken, {
                    expires: new Date(Date.now() + 180000)
                })
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });
                let mailOptions = {
                    from: process.env.EMAIL,
                    to: recoveryEmail,
                    subject: `Getting email from Pass Manager `,
                    text: `Hii ${Users.name}, click on http://127.0.0.1:5000/change/${Users.id} to reset your password`
                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err)
                        return res.send(err)
                    } else {
                        console.log(info.response)
                        return res.redirect('/return')
                    }
                })
            } else {
                return res.render('forgot', { result: 'Recovery Email is different' })
            }
        } else {
            return res.render('forgot', { result: 'User not found' })
        }
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.post('/deleteOne/:id', async (req, res) => {
    try {
        const { id: _id } = req.params
        const Data = await Model.findOneAndDelete({ _id })
        if (!Data) {
            return res.json({ msg: `No data with id:${_id}` })
        } else {
            return res.redirect('/home')
        }
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.post('/editOne/:id', async (req, res) => {
    try {
        const { id: _id } = req.params
        const { appname, username, email, password } = req.body
        const Data = await Model.findOneAndUpdate({ _id }, { appname, username, email, password }, { new: true, runValidators: true })
        if (!Data) {
            return res.json({ msg: `No data with id:${_id}` })
        } else {
            return res.redirect('/home')
        }
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
// Run
const run = async (url) => {
    try {
        await mongoose.connect(url)
        app.listen(port, () => {
            console.log(`This server is running on port http://${hostname}:${port}`)
        })
    } catch (err) {
        console.log(err)
    }
}
run(process.env.MONGO_URI)