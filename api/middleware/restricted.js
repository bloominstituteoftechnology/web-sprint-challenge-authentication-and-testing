module.exports = function restricted(){
    return (req, res, next)=>{
        if(req.session.user && req.session.token){
            console.log(`User Authenticated`);
            next();
        }else{
            res.status(403).json({message: `You are unauthorized`})
        }
    }
}
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

