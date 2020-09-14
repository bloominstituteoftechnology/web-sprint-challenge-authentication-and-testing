const router = require('express').Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./auth-model")
const restrict = require("./authenticate-middleware")

router.post('/register',  async(req, res, next) => {
  try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			// hash the password with a time complexity of "14"
			password: await bcrypt.hash(password, 14),
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
  // implement registration
});

router.post('/login', async (req, res,next) => {
  try {
    const { username, password } = req.body
    const user = await Users.findBy({ username }).first()

    if (!user) {
      return res.status(401).json({
        message: 'You shall not pass!!',
      })
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return res.status(401).json({
        message: 'You shall not pass!!',
      })
    }

    const payload = {
      userId: user.id,
      username: user.username,
      userRole: 'basic',
    }

    res.cookie('token', jwt.sign(payload, 'safe'))
    res.json({
      message: `Welcome ${user.username}!`,
     
    })
  } catch (err) {
    next(err)
  }
})

router.get("/users",restrict(), async (req,res,next)=>{
  try{
    res.json(await Users.find())
  }catch(err){
      next(err)
  }
})



module.exports = router;
