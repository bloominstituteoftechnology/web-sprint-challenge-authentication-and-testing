const router = require('express').Router();
const Users = require('./auth-model');
const bcrypt = require('bcryptjs')
const buildToken = require('./token-builder');


const {checkUsernameExists, checkBodyValidation, validateUserExsist} = require('./middleware')

router.post('/register', checkUsernameExists,checkBodyValidation , (req, res, next) => {

      const {username, password} = req.body
      const hash = bcrypt.hashSync(password, 8)

      Users.add({username, password:hash})
        .then(newUser=>{
          res.status(201).json(newUser)
        })
        .catch(next)


      
});

router.post('/login',checkBodyValidation,validateUserExsist, (req, res, next) => {
  if(bcrypt.compareSync(req.body.password, req.user.password)){
    const token = buildToken(req.user)
    res.json({
      message: `${req.user.username} is back!`,
      token,
    })

  }else{next({status: 401, message: 'Invalid credentials'})}

});


module.exports = router;
