const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./auth-model")

const router = express.Router()

router.post('/register', async(req, res, next) => {

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
});

router.post('/login', async(req, res, next) => {
  // implement login
  try {
	const { username, password } = req.body
	const user = await Users.findBy({ username }).first()
	if (!user) {
		return res.status(401).json({
			message: "Invalid Credentials, wrong user name",
		})
	}
	// hash the password again and see if it matches what we have in the database
	const passwordValid = await bcrypt.compare(password, user.password)
	if (!passwordValid) {
		return res.status(401).json({
			message: "Invalid Credentials, wrong password",
		})
	}
	// generate a new JSON web token
	const token = jwt.sign({
		userID: user.id,
		userRole: "basic", // this value would normally come from the database
	}, process.env.JWT_SECRET)

	// send the token back as a cookie
	res.cookie("token", token)

	res.json({
      message: `Welcome ${user.username}!`,
      token,
		})
	} catch(err) {
		next(err)
	}
});

module.exports = router;
