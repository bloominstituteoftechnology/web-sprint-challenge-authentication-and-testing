const router = require('express').Router();
const db = require('../database/dbConfig')
const bcrypt = require('bcryptjs')

router.post('/register', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password)
    return db('users').insert(req.body)
    .then(resp => {
        if(resp){
          req.session.user = resp
          res.status(201).json({message:`user created, welcome ${req.body.username}`})
        } else {
          res.status(400).json({message:'something went wrong!'})
        }
    })
    .catch(err => {
      res.status(500).json({message:'something really went wrong!!'})
    })
});

router.post('/login', (req, res) => {
  const username = req.body.username
   return db('users').where({'username':req.body.username})
        .then(user => {
          console.log(user[0].password)
          console.log(req.body)
          if(user && bcrypt.compareSync(req.body.password,user[0].password)){
            console.log('it worked!')
            req.session.user = user
            res.status(200).json({message:`welcome back ${user[0].username}`})
          } else {
            res.status(404).json({message:'invalid credentials!'})
          }
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({message:'something really went wrong!'})
        })
});

module.exports = router;
