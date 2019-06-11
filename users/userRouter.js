const express = 'express';

const router = require('express').Router();
const Users = require('./userDb')
const Posts = require('../posts/postDb')

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(response => {
    res.status(200).send({message: `created user ${response.name} `})
  })
  .catch(error => {
    console.log(error)
    res.status(500).send("an error occured")
  })
})

router.post('/:id/posts', validatePost, (req, res) => {
    Posts.insert(req.body)
    .then(response => {
      res.status(200).send({message: `created post '${response.text}'`})
    })
    .catch(error => {
      console.log(error)
      res.status(500).send(error)
    })
});

router.get('/', (req, res) => {
const users = Users.get()
    .then(users => {
        res.status(200).send(users)
    })
    .catch(error => {
        res.status(500).send(error)
    })
});

router.get('/:id', validateUserId, (req, res) => {
    const user = Users.getById(req.params.id)
    .then(user => {
        res.status(200).send(user)
    })
    .catch(error => {
        res.status(500).send(error)
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const posts = Users.getUserPosts(req.params.id)
    .then(posts => {
        res.status(200).send(posts)
    })
    .catch(error => {
        res.status(500).send(error)
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    const deleteUser = Users.remove(req.params.id)
    .then(deleteUser => {
        res.status(200).send(`User deleted.`)
    })
    .catch(error => {
        res.status(500).send(error)
    })
});

router.put('/:id', validateUserId, (req, res) => {
    const updatedUser = Users.update(req.params.id, req.body)
    .then(updatedUser => {
        res.status(200).send(`User updated.`)
    })
    .catch(error => {
        res.status(500).send(error)
    })
});

//custom middleware

function validateUserId (req, res, next) {
    console.log('user validated')
    Users.getById(req.params.id)
    .then(user => {
      if (user) {
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

module.exports = router;
