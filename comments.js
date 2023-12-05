// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Create a new comment
app.post('/comments', async (req, res) => {
  const { comment, post_id } = req.body;
  const result = await pool.query(
    'INSERT INTO comments (comment, post_id) VALUES ($1, $2) RETURNING *',
    [comment, post_id]
  );
  res.status(201).send(result.rows[0]);
});
// Get all comments
app.get('/comments', async (req, res) => {
  const result = await pool.query('SELECT * FROM comments');
  res.status(200).send(result.rows);
});
// Get a comment by id
app.get('/comments/:id', async (req, res) => {
  const id = req.params.id;
  const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
  res.status(200).send(result.rows[0]);
});
// Update a comment
app.put('/comments/:id', async (req, res) => {
  const id = req.params.id;
  const { comment, post_id } = req.body;
  const result = await pool.query(
    'UPDATE comments SET comment = $1, post_id = $2 WHERE id = $3 RETURNING *',
    [comment, post_id, id]
  );
  res.status(200).send(result.rows[0]);
});
// Delete a comment
app.delete('/comments/:id', async (req, res) => {
  const id = req.params.id;
  const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  res.status(204).send();
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});