const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


// Gets all books from the logged in user
router.get('/', rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM "book" WHERE "user_id" = $1;`;
  pool.query(queryText, [req.user.id])
  .then(result => {
    res.send(result.rows); //result.rows contains all the user's books
  })
  .catch(err => {
    console.log('Error getting books', err);
    res.sendStatus(500)
  })
}); //End GET

// Adds inputted book to database
router.post('/', (req, res) => {
  const queryText = `
  INSERT INTO "book" ("user_id", "title", "author", "page_count")
  VALUES ($1, $2, $3, $4);
  `;
  pool.query(queryText, [req.user.id, req.body.title, req.body.author, req.body.page_count])
  .then(result => {
    res.sendStatus(201);
  })
  .catch(err => {
    console.log('Error POSTing new book', err);
    res.sendStatus(500)
  })
}); //End POST

// Updates the book information in the database and on the DOM
router.put('/:updateId', (req, res) => {
  const updateId = req.params.updateId;
  const queryText = `
  UPDATE "book"
  SET ("title", "author", "page_count") = ($1, $2, $3)
  WHERE "id" = $4;
  `;
  pool.query(queryText, [req.body.title, req.body.author, req.body.page_count, updateId])
  .then(result => {
    console.log('result is', result);
    res.sendStatus(200);
  })
  .catch(err => {
    console.log('Error updating book', err);
    res.sendStatus(500)
  })
}); //End PUT

// Adds reading progress to database
router.post('/progress', (req, res) => {
  const queryText = `
  INSERT INTO "reading_session" ("book_id", "date", "duration", "page")
  VALUES ($1, $2, $3, $4);
  `;
  console.log('!!!!', req.body);
  pool.query(queryText, [req.body.book_id, req.body.date, req.body.duration, req.body.page])
  .then(result => {
    res.sendStatus(201);
  })
  .catch(err => {
    console.log('Error POSTing reading progress', err);
    res.sendStatus(500)
  })
}); //End POST

module.exports = router;
