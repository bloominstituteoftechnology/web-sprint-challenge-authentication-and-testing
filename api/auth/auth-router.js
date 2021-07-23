const bcrypt = require("bcryptjs");
const router = require("express").Router();
const tokenBuilder = require("../auth/token-router");
const Users = require("../user/user.model");

const {
  checkUsernameExists,
  validateCredentials,
  checkUsernameUnique,
} = require("../middleware/middleware");

router.post( "/register", validateCredentials, checkUsernameUnique, async (req, res, next) => {




// hash the password for safty precautions.
const {username, password} = req.user;
    const hash = bcrypt.hashSync(password, 18);

  // here we are adding users to the database
    Users.addUser({username, password: hash }) 
	.then((newUser) => 
	{res.status(201).json(newUser);  })
      .catch(next);
  }
);



router.post("/login", validateCredentials, checkUsernameExists,(req, res, next) => {
   


    // Here we are vaildating the user by password.
    if (bcrypt.compareSync(req.body.password, req.user.password)) {
        
      const token = tokenBuilder(req.user);
          
         res.status(200).json({ message: `welcome, ${req.user.username}`,token, });
      } else {
         next({ status: 401, message: "invalid credentials",
      });
    }
  }
);

module.exports = router;
