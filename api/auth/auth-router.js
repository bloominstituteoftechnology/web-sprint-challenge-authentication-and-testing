
const router = require('express').Router();
const auth = require('./auth-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {restrict} = require('./middleware/restricted.js');

router.post('/register', async (req, res) => {
  try{
    const {username, password} = req.body;
    const user = await auth.getUserBy({ username });

    if(user){
      return res.status(409).json({
        message: "Username is taken"
      })
    }

    const newUser = await auth.addUser({
      username,
      password: await bcrypt.hash(password, 13)
    })

    return res.status(200).json({
      message: `Welcome ${username}`
    })

  } catch(error){
    console.log(error)
  }
});

router.post('/login', async (req, res, next) => {
  try{
    const {username, password} = req.body;
    const user = await auth.getUserBy({ username })

    if(!user){
      return res.status(401).json({
        message: "Invalid"
      })
    }

    const passwordValidate = await bcrypt.compare(password, user.password);
    
    if(!passwordValidate){
      return res.status(401).json({
        message: "Invalid"
      })
    }

  const token = jwt.sign({
      userID: user.id,
      username: user.username
  }, 'hjkgjkfdsjdsjgh')

  res.cookie('token', token);

  return res.status(200).json({
    message: `Welcome back ${username}`
  })
  } catch(error){
    console.log(error);
    console.log(process.env.TOKEN)
  }
});

module.exports = router;