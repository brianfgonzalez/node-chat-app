const path = require('path')
  express = require('express')
  port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')

var app = express()
app.use(express.static(publicPath))

// bind app to local port
app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
