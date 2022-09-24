const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const modelSchema = new mongoose.Schema({
    appname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true

    }
})
const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    recoveryEmail: {
        type: String,
        default: null
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})
//Generating token
registerSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this.id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token })
        await this.save()
        return token;
    } catch (err) {
        console.log(err)
    }
}
//Hashing
registerSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next()
    }
})
const Model = mongoose.model('user-data', modelSchema)
const Register = mongoose.model('user-credentials', registerSchema)
module.exports = { Model, Register }