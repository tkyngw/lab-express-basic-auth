const router = require('express').Router();
const { hash } = require('bcrypt');
const bcrypt = require('bcrypt');
const { create } = require('connect-mongo');
const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body
    if(password.length < 4){
        res.render('signup', {message: 'Your password has to be longer than 4 characters'})
        return
    }
    if(username.length === 0){
        res.render('signup', {message: 'Your username connat be empty'})
        return
    }
    User.findOne({username: username})
    .then(userFromDB => {
        if(userFromDB !== null){
            res.render('signup', {message: 'Your username is already taken'})
            return
        } else {
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)
            User.create({
                username : username,
                password: hash
            })
                .then(createdUser => {
                    console.log(createdUser)
                    res.redirect('/')
                })
                .catch(err => {
                    next(err)
                })
        }
    })
 
})

router.get('/login', (req, res,next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    User.findOne({username: username})
    .then(userFromDB => {
        if(userFromDB === null){
            res.render('login', {message: 'Username doesn\'t exist'})
            return
        } 
        if (bcrypt.compareSync(password, userFromDB.password)){
            // this part I didn't fully get it. Is this coming from express-session?
            req.session.user = userFromDB
            res.redirect('/profile')
        } else {
            res.render('login', {message : 'Invalid Credentials'})
        }
        
        
    })
})

module.exports = router