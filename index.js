const server = require('./api/server.js')

const PORT = process.env.PORT || 6666
server.listen(PORT, () => {
  console.log(`\n on Port ${PORT} \n`)
})
