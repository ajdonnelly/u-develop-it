const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

/* Next, remove all of the candidate-related routes from server.js and add them here. 
You'll need to make a few modifications, though. Namely, the app object should be changed to router, 
and the route URLs don't need to include '/api' anymore because that prefix is defined in server.js.*/



 // Get all candidates
 router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id`;
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
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
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

  //change a candidate 
  router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
  
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: req.body,
        changes: this.changes
      });
    });
  });

  // Delete a candidate
//endpoint includes a route parameter to uniquely identify the candidate to remove. 
//remove using HTTP request method delete(). because app here is the express server. 
router.delete('/candidate/:id', (req, res) => {
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

// Create a candidate
//using HTTP request method post ()
//insert a candidate into the candidates table
//In the callback function, we use the object req.body to populate the candidate's data. Using body destructing to pull the body out of the request object.
router.post('/candidate', ({ body }, res) => {
    //we assign errors to receive the return from the inputCheck function
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    //database call
    //the statement we need to run to add to the database is saved into constant sql. 
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
    //params assignment
    //the user input we need to enter a new candidate is saved into params constant.
    //contains three elements in its array that contains the user data collected in req.body
    const params = [body.first_name, body.last_name, body.industry_connected];
    // ES5 function, not arrow function, to use `this`
    //Using the run() method, we can execute the prepared SQL statement. We use the ES5 function in the callback to use the Statement object that's bound to this.
    db.run(sql, params, function(err, result) {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    //send the response using the res.json() method with this.lastID, the id of the inserted row
    res.json({
        message: 'success',
        data: body,
        id: this.lastID
    });
});
  });

  module.exports = router;