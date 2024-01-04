const mysql = require('mysql2')

const dbconn = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise()

module.exports = dbconn