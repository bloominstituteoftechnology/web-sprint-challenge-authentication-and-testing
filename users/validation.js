function validateUser(user) {
    let errors = [];

    if (!user.username || user.username.length < 6) {
        errors.push('Username must have at least six characters');
    }
    if (!user.password || user.password.length < 8) {
        errors.push('Password must be at least eight characters')
    }
    return {
        isSuccessful: errors.length > 0 ? false : true,
        errors,
    }
}

module.exports = {
    validateUser
}