function validateUser(user) {
    let errors = [];

    if (!user.username || user.username.length < 3) {
        errors.push('username must be at least 3 characters long');
    }
    if (!user.password || user.password.length < 3) {
        errors.push('password needs to be at least 3 characters long')
    }
    return {
        errors
    }
}

module.exports = {
    validateUser
}