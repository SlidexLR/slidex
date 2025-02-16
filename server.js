const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('public'));

let globalNotes = [];

app.get('/api/notes', (req, res) => {
  res.json(globalNotes);
});

app.post('/api/notes', (req, res) => {
  const text = req.body.text;
  if (typeof text === 'string' && text.trim() !== '') {
    const note = { text: text.trim(), timestamp: Date.now() };
    globalNotes.push(note);
    res.status(201).json(note);
  } else {
    res.status(400).json({ error: 'Invalid note text' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
