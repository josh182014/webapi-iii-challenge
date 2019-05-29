const express = require('express');

const server = express();
const Users = require('./users/userDb')
const Posts = require('./posts/postDb')

server.use(express.json())
server.use(logger)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

server.get('/user/:id',  validateUserId, (req, res) => {
  // console.log('success')
  res.send(req.user)
})

server.post('/user/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(response => {
    res.status(200).send({message: `created user ${response.name} `})
  })
  .catch(error => {
    console.log(error)
    res.status(500).send("an error occured")
  })

})

server.post('/post', validatePost, (req, res) => {
  Posts.insert(req.body)
  .then(response => {
    res.status(200).send({message: `created post '${response.text}'`})
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })
})

//custom middleware

function logger(req, res, next) {
  console.log(`A ${req.method} request to '${req.url}' was made at ${ new Date()}`);
  next();
}

function validateUserId (req, res, next) {
    console.log('user validated')
    Users.getById(req.params.id)
    .then(user => {
      if (user) {
        console.log(user)
        req.user = user
        next()
      }
      else {
        res.status(400).send({ message: "invalid user id" })
      }
    }) 
    .catch(err => {
      res.status(500).send({message: "An error occorued", error: err})
    })
}

function validateUser (req, res, next ) {
  function isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
      return true;
  }
  if (!isEmpty(req.body)) {
    if (req.body.name) {
      next();
    }
    else {
      res.status(400).send({message: "missing required name field"})
    }
  }
  else {
    res.status(400).send({message: "missing user data"})
  }
}

function validatePost (req, res, next ) {
  function isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
      return true;
  }
  if (!isEmpty(req.body)) {
    if (req.body.text) {
      next();
    }
    else {
      res.status(400).send({message: "missing required text field"})
    }
  }
  else {
    res.status(400).send({message: "missing post data"})
  }

}

module.exports = server;