// Port used is 3001
const PORT = process.env.PORT || 3001;

const { randomUUID } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

//middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

//Start Listen function
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

  // Get Route gets notes saved and joins in db.json
 app.get('/api/notes', (req, res) =>{
     res.sendFile( path.join(__dirname, './db/db.json'))
 });
  

  // Post Route to add new noted to db.json
  app.post('/api/notes', (req, res) => {
      const notes = JSON.parse(fs.readFileSync("./db/db.json"));
      const newNotes = req.body;
      newNotes.id = randomUUID();
      notes.push(newNotes);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notes))
        res.json(notes);
    });
    

  // Delete Notes using unique Id's
  app.delete('/api/notes/:id', (req, res) => {
      const id = req.params.id;
      const notes = JSON.parse(fs.readFileSync("./db/db.json"));
      const filterNotes = notes.filter(note => {
          return note.id != id ;
      })
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(filterNotes))
        res.json(filterNotes);
  })


  // HTML calls
  // Call for index.html 
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  //call for notes.html
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
  // undefined call to redirect to main html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });



    