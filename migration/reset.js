require('colors')
require('dotenv').config()
const fs = require('fs').promises
const path = require('path')
const mysql = require('mysql')
const { Observable } = require('../function')
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})
connection.connect()
fs.readdir(path.join(__dirname, 'history')).then(folder => {
  const steps = folder
    .sort()
    .filter(file => file.substring(18, 24) === 'create')
    .map(file => {
      return () => {
        const MigrationTable = require('./history/' + file)
        const Table = new MigrationTable({ connection, file })
        return Table.down()
          .then(result => {
            // console.log(result)
          })
          .catch(error => {
            console.log('sqlMessage:', error.sqlMessage.red)
            console.log('sqlQuery:', error.sql)
            conn.end()
          })
      }
    })
  const observable = new Observable(subscriber => {
    steps.reverse().forEach(run => {
      subscriber.next(run)
    })
    subscriber.complete(() => {
      console.log('Database migration drop.'.red)
      connection.end()
    })
  })
  observable.run()
})
