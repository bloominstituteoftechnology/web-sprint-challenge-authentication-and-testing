require('dotenv')
  .config()
const server = require('./api/server.js')
const {PORT} = require('./config')

server.listen(PORT, () => {
  console.log(`\n=== turtle up on port ${PORT} ===\n`)
})
