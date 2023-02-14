const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Alternatively you can use validator (install validator) instead of match
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        minlength: [3, 'The minimum length for Name is  3']
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [7, "The minimum password length is 7 characters"]
    },
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.generateToken = function (){
    return jwt.sign ({userId: this._id, name: this.name}, process.env.JWT_SECRET, { expiresIn: '3d'})
};

userSchema.methods.comparePassword = async function(userPassword){
    const isCorrect = await bcrypt.compare(userPassword, this.password)
    return isCorrect;
};

module.exports = mongoose.model('User', userSchema)