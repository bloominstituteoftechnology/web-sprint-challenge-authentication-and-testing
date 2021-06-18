const db = require('./auth-model')

const checkUsernameExists = async(req, res, next) => {
    console.log(req.body.username)
    try{
        const [user] = await db.findBy({username: req.body.username})
        console.log(user)
        if(user){
            next({status: 422, message: "username taken"})
        }//end of if
       
        else{
            req.user = user
            next()
        }

    }//end of try
    catch(err){
        next(err)
      }

}
const validateUserExsist = async(req, res, next) => {
    console.log(req.body.username)
    try{
        const [user] = await db.findBy({username: req.body.username})
        console.log(user)
        if(!user){
            next({status: 422, message: "Invalid credentials"})
        }//end of if
       
        else{
            req.user = user
            next()
        }

    }//end of try
    catch(err){
        next(err)
      }

}

const checkBodyValidation = (req,res,next)=>{
    if(!req.body.username || !req.body.password){
        next({status: 422, message: "username and password required"})
    }else{next()}

}
module.exports ={
    checkUsernameExists,
    checkBodyValidation,
    validateUserExsist
}