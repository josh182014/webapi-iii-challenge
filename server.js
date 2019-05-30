const express = require('express');

const server = express();
const Users = require('./users/userDb')
const Posts = require('./posts/postDb')
const userRouter = require('./users/userRouter')

server.use(express.json())
server.use(logger)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});


server.use('/user', userRouter);
//custom middleware

function logger(req, res, next) {
  console.log(`A ${req.method} request to '${req.url}' was made at ${ new Date()}`);
  next();
}

module.exports = server;