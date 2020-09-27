const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');


// Rout to get all voters from database
//This route will perform a SELECT * FROM 
//voters and return the rows on success or a 500 status if there were errors.
router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`;
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


//route to get individual voter
  router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
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

//post request for user to register and give first name last name and email address
  router.post('/voter', ({ body }, res) => {
// input check to make sure incoming data is good
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];
  
    db.run(sql, params, function(err, data) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: body,
        id: this.lastID
      });
    });
  });

//PUT request to allow user to update email address Next, 
//let's build the PUT route so users can update their email address. 
//Following best practices, this will require a combination of req.params 
//(to capture who is being updated) and req.body (to capture what is being updated).

router.put('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'email');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    // Prepare statement
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];
  
    // Execute
    db.run(sql, params, function(err, data) {
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

//DELETE request
  router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
  
    db.run(sql, req.params.id, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({ message: 'deleted', changes: this.changes });
    });
  });

  module.exports = router;