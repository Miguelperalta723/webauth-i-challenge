const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const restricted = require('./restricted-middleware.js')

const db = require('./data/dbConfig.js')

const server = express();

const sessionCofig = {
    name: 'notsession', 
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
}

server.use(express.json())
server.use(session(sessionCofig));


server.get('/', (req, res) => {
    res.send('api is up')
});

server.get('/users', restricted, (req, res) => {
    db('users')
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json({
            message: `${error}`
        })
    })
});

server.post('/register', (req, res) => {
    const user = req.body;
    console.log(user.password)
    user.password = bcrypt.hashSync(user.password, 12)
    console.log(user.password)
    db('users').insert(user)
    .then(registeredUser => {
        req.session.user = registeredUser;
        res.status(200).json(registeredUser)
    })
    .catch(error => {
        res.status(500).json({
            message: `${error}`
        })
    })

});


server.post('/login', (req, res) => {
    const {username , password} = req.body;
    db('users').where({username})
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password , user.password)){
            req.session.user = user;
            res.status(200).json({
                message: `welcome ${user.username}`
            })
        } else {
            res.status(404).json({
                message: `user not found`
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: `${err}`
        })
    })
});












module.exports = server;