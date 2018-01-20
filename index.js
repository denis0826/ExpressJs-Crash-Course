/*
const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

fs.readFile('index.html', (err, html) => {
  if(err) {
    throw err;
  }
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(html);
    res.end();
  });
  
  server.listen(port, hostname, () => {
    console.log('Server Started on port', port);
  });
  
});
*/

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const expressValidator = require('express-validator');
const mongojs = require('mongojs');

const db = mongojs('customerapp', ['users']);

const app = express();

/*
const logger = (req, res, next) => {
  console.log('Logging...');
  next();
};

app.use(logger);
*/
//View Engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use((req, res, next) =>{
  res.locals.errors = null;
  next();
})

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'), 
      root    = namespace.shift(), 
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// const person = {
//   name: 'Jeff',
//   age: 30
// }

const users = [{
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe@gmail.com'
},{
  id: 2,
  first_name: 'Bob',
  last_name: 'Doe',
  email: 'bobdoe@gmail.com'
},{
  id: 3,
  first_name: 'Jill',
  last_name: 'Doe',
  email: 'jilldoe@gmail.com'
}]

app.get('/', (req, res) => {
  // find everything
  db.users.find(function (err, docs) {
    // docs is an array of all the documents in mycollection
    console.log(docs);
    res.render('index', {
      title: 'Customers',
      // users
      users: docs
    });
  });

  // res.render('index', {
  //   title: 'Customers',
  //   users: users
  // });
  // res.send('Hello World!');
  // res.json(person);
});

app.post('/user/add', function(req, res) {

  req.checkBody('first_name', 'First Name is Required').notEmpty();
  req.checkBody('last_name', 'Last Name is Required').notEmpty();
  req.checkBody('email', 'Email is Required').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('index', {
      title: 'Customers',
      users,
      errors
    });
    console.log('ERRORS');
  } else {
    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    }
    db.users.insert(newUser,(err, result)=> {
      if(err) {
        console.log(err);
      }
      res.redirect('/');
    });
    console.log('SUCCESS');
  }



});

app.delete('/users/delete/:id', (req, res) => {
  console.log(req.params.id);
  db.users.remove({_id:mongojs.ObjectId(req.params.id)},function(err, result) {
    if(err) {
      console.log(err);
    }
    res.redirect('/');
  });
})

app.listen(port, () => {
  console.log('Server Started on port', port);
});

