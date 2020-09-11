const router = require('express').Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
//imports
const db = require('../jokes/jokes-model');

// definitions
const authError = {err: 'invalid credentials'}


/*  REGISTER NEW USER  */
router.post('/register', async (req, res, next) => {
  try {
    const {username, password} = req.body

    console.log(req.body)

    const existingUser = await db.findBy({username})

    if (existingUser) {return res.status(409).json({err: 'username taken'})}

    const newUser = await db.createUser({username, password: await bcrypt.hash(password, 12)}) 

    if (newUser) {return res.status(201).json({msg: 'user created'})}

  }
  catch(err) {next(err)}
});

/*  LOGIN USER  */
router.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body

    console.log(username, password)

    const user = await db.findBy(username)

    if (!user) {return res.status(401).json(authError)}

    const checkPass = await bcrypt.compare(password, user.password)

    if (!checkPass) {return res.status(401).json(authError)}

    const payload = {
      userId: user.id,
      username: username,

    }

    res.cookie('token', jwt.sign(payload, 'cake'))
    res.json({msg: `welcome ${username}`})
    
  }
  catch(err) {next(err)}
});

module.exports = router;
