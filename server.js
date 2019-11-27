//'use strict';

const express = require("express");
const cors = require("cors");
const formidable = require("formidable");
const fs = require("fs");

const app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.static(process.cwd() +'/uploads'));

app.get("/", function(req, res) {
 
  fs.readdir("uploads", (err, files) => {
    if (err) return res.send("error in reading files");
    for (let file of files) {
      fs.unlink("uploads/" + file, err => {
        if (err) return res.send("error in removing files");
      });
    }
  });
 
  //-- get the homepage
  return res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/hello", function(req, res) {
  res.json({ greetings: "Hello, API" });
});

console.log(process.cwd() );

//-- post form (get the files and read the properties)

app.post("/api/fileanalyse", function(req, res) {
  var form = new formidable.IncomingForm();

  //-- using formidable events

  form
    .parse(req)
    .on("fileBegin", (name, file) => {
      file.path =  `uploads/${file.name}`;
    })
    .on("file", (name, file) => {
     // console.log(name, file.name, file.type, file.size);
      return res.json({ name: file.name, type: file.type, size: file.size });
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

