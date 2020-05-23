//const flash = require('connect-flash');
const express = require('express');
var bodyParser = require('body-parser');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
var user = require('./routes/func');




var indexj = require('./routes/index');


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/Images/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

//body parsermiddleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Public Folder
app.use(express.static('./public'));

// route files
app.use('/', indexj);

// mysql connection 
var db = require('./routes/db')


app.get('/up', (req, res) => res.render('index'));

app.post('/upload', 
(req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('registration', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('registration', {
          msg: 'Error: No File Selected!'
        });
      } else {
        console.log(req.file.destination);
        console.log(req.file.filename);
        var n=  req.body.name;
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var ch=format.test(n);
        if(ch){
            res.send("Special characters are not allowed in name");
        }
  
        var pass = req.body.psw;
        var pass2= req.body.psw2;
        if(pass != pass2){
            res.send("Your password doesn't match");
        }else{
        let post = {
              id:'Null',
              name: req.body.name,
              email: req.body.email,
              username: req.body.username,
              password: req.body.psw,
              about:req.body.about,
              image: req.file.filename};
        let sql = 'INSERT INTO user SET ?';
        user.hel(post,sql);
        res.render('registration', {
          msg: 'File Uploaded!',
          file: `Images/${req.file.filename}`
        });
      }}
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
