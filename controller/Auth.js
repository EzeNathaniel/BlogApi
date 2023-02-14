const { response } = require('express');
const Users = require('../models/user');
const handlerrors = require('../handleerror/handleError');



const register = async (req, res) => {
    const {email, name, password} = req.body
    if (!email||!name||!password){
        res.status(400).json({success:false,  message:'Please provide neccessary information'});
    }
    try {
        const user = await Users.create({...req.body});
        const token = user.generateToken();
        res.status(201).json({ data: {name: user.name, email: user.email}, token});
    } catch (error) {
        // console.log(error);
        const errors = handleErrors(error);
        res.status(400).json({})
        
    }
};

const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400).json({success:false,  message:'Please provide neccessary information'});
    }
    try {
        const user = await Users.findOne({email})
        if (!user) {
            throw Error ('incorrect Email')
            // return res.status(400).json({success:false, message:''})
        }
        const authenticated = await user.comparePassword(password)
        if (!authenticated) {
            throw Error ('incorrect Password')
        }
        const token = user.generateToken();
        res.status(200).json({user:{name: user.name, email: user.email}, token})
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({error});
    }
};

module.exports = {register, login}