const router = require('express').Router();

router.post('/register', (req, res) => {
  res.end('implement register, please!');
  let user = req.body;

  if(user.username === undefined || user.password === undefined) {
    res.status(500).send("username and password required")
  }
  const hash = bcrypt.hashSync(user.password, 12);
  
  user.password = hash;

  res.status(200).json({
    ...user,
    id: id + 1
  })
});

router.post('/login', (req, res) => {
  res.end('implement login, please!');

    let {username, password} = req.body;

    if (username === undefined || password === undefined) {
      res.status(500).send("username and password required")
    } 

    Users.findBy({username: username}).first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)){
          res.status(200).json({message: "Invalid credentials"})
      } else {
        res.status(401).json({message: 'Invalid credentials'})
      }
})
.catch(error => {
  res.status(500).json(error);
  })
});

module.exports = router;
