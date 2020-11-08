const router = require('express').Router();

const User = require('./users-model')

const {restrict} = require('./authenticate-middleware')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')


router.post('/register', async (req, res, next) => {
 try {
   const { username, password} = req.body

   const user = await User.findBy({username}).first()

   if(user) {
     return res.status(409).json({
       message: "Username is Taken"
     })
   }

   const addUser = await User.add({
     username,
     password: await bcrypt.hash(password, 14)
   })

   res.status(201).json(addUser)

 } catch(err) {
   next(err)
 }
});

router.post('/login', (req, res) => {
  try {
    const { username, password} = req.body
    const user = await User.findBy({username}).first()

    if (!user ) {
      return res.status(401).json({
        message: "Invalid User"
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if(!validPassword) {
      return res.status(401).json({
        message: "Invalid Password"
      })
    }

    //create new JSON toke with user details

    const token = jwt.sign({
      userID: user.id,
    }, process.env.JWT_SECRET)

    // req.session.user = user

    // save client cookie

    res.cookie("token", token)

    res.json({
      message: `Welcome ${user.username} !!!!`
    })
  } catch(err) {

  }
});

module.exports = router;
