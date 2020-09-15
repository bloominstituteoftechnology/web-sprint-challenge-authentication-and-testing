function validateUser(user) {
    let errors = [];

    if (!user.username || user.username.length >= 7) {
        errors.push('Username must have at least seven characters');
    }
    if (!user.password || user.password.length >= 7) {
        errors.push('Password must be at least seven characters')
    }
    return {
        isSuccessful: errors.length > 0 ? false : true,
        errors,
    }
}

module.exports = { validateUser }