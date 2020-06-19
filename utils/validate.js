module.exports = {
    isValid,
}

function isValid(user) {
    return Boolean(user.username && user.password && typeof user.password === "string");
  }// checks to see if username and password exist, and if password is a valid alpha numerical string
