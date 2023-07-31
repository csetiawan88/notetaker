// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Const generating unique ids
const uuid = require("uuid");

// Use express.js
const app = express();

// Creating specific port to start the app
const PORT = process.env.PORT || 8888;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static("public"));

// Get notes from db.json
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// Post notes to db.json
app.post("/api/notes", (req, res) => {
  // Reading Notes from db.json
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const newNotes = req.body;
  // Creating unique ID for each note
  newNotes.id = uuid.v4();
  // Push new note to db.json
  notes.push(newNotes);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

// Delete Notes
app.delete("/api/notes/:id", (req, res) => {
  // Reading Notes from db.json
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  // Removing Note
  const deleteNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
  // Re-writing note
  fs.writeFileSync("./db/db.json", JSON.stringify(deleteNote));
  res.json(deleteNote);
});

// Call index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
// Call notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// App listener and starts the server with specific PORT
app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
  console.log(`Link to Run: http://localhost:${PORT}`);
});
