const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())

const router = require('./router/teacherrouter')
app.use(router)
app.listen(process.env.PORT, () => {
    console.log("server listned at " + process.env.PORT)
})


