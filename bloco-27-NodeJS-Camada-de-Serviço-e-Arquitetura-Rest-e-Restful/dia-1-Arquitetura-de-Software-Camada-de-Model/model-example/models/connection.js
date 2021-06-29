// models/connection.js

const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'danimuller20',
    password: 'canas1359',
    database: 'model_example'});

module.exports = connection;