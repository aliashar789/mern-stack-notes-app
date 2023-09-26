const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')

const app = express();
const port = 8000

app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


connectToMongo();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

