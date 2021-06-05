require('colors')
require('dotenv').config()
const path = require('path')
const fs = require('fs').promises
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
  const steps = folder.sort().map(file => {
    return () => {
      const MigrationTable = require('./history/' + file)
      const Table = new MigrationTable({ connection, file })
      return Table.up()
        .then(result => {
          // console.log(result)
        })
        .catch(error => {
          console.log('sqlMessage:', error.sqlMessage)
          console.log('sqlQuery:', error.sql)
          conn.end()
        })
    }
  })
  const observable = new Observable(subscriber => {
    steps.forEach(run => {
      subscriber.next(run)
    })
    subscriber.error(err => {
      connection.end()
      console.log(err)
    })
    subscriber.complete(() => {
      console.log('Database migration success.'.green)
      connection.end()
    })
  })
  observable.run()
})
