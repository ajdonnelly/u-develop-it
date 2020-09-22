//import SQL NPM package
// This statement sets the execution mode to verbose to produce messages in the terminal regarding the state of the runtime. This feature can help explain what the application is doing, specifically SQLite.
const sqlite3 = require('sqlite3').verbose();

const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the election database.');
  });

 // Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
  });

// Delete a candidate
//endpoint includes a route parameter to uniquely identify the candidate to remove. 
//remove using HTTP request method delete(). because app here is the express server. 
app.delete('/api/candidate/:id', (req, res) => {
    //set the prepared SQL statement with a placeholder equal to constant
    const sql = `DELETE FROM candidates WHERE id = ?`;
    //set the id of the thing to be deleted to a constant which will be plugged in as the parameter
    const params = [req.params.id];
    //database method with run, with paramater set to the SQL command and the ID chosen then run the funciton with either an error or the result
    db.run(sql, params, function(err, result) {
    //if there is an error, return this status message
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({
    //by default, if there is no error, return the resquest as a json response in the form of a message that lets user know what they asked to be delted has been delted
        message: 'successfully deleted',
        changes: this.changes
      });
    });
  });

  // Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
// VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function(err, result) {
// if (err) {
// console.log(err);
// }
// console.log(result, this.lastID);
// });

//Express route to page
app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });

  // Default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
  });

// Start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });