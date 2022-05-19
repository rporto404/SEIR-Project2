//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const seedData = require('./models/productSeed.js');
const Products = require('./models/productSchema.js');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , () => {
  console.log('connected to mongo');
});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000
app.get('/seed', (req,res) => {
  seedData.forEach((product, i) => {
    Products.create(seedData[i], (error, data) => {
      if (error){
        console.log(error.message);
      }
    });
  });
  res.redirect('/');
});

app.get('/' , (req, res) => {
  Products.find({}, (error, productData) => {
    res.render('index.ejs', {
      data: productData
    });
  });
});

app.get('/new', (req,res) => {
  res.render('new.ejs');
});

app.get('/home', (req,res) => {
  res.render('home.ejs');
});

app.get('/about', (req,res) => {
  res.render('about.ejs');
});

app.get('/contact', (req,res) => {
  res.render('contact.ejs');
});

app.get('/:id', (req, res) => {
  Products.findById(req.params.id, (error, foundData) => {
    res.render('show.ejs', {
      data: foundData
    });
  });
});

app.post('/', (req, res) => {
  Products.create(req.body, (error, newProduct) => {
    if (error) {
      console.log(error);
    }
    res.redirect('/');
  });
});

app.get('/:id/edit', (req, res) => {
  Products.findById(req.params.id, (error, editData) => {
    res.render('edit.ejs', {
      data: editData
    });
  });
});

app.put('/:id', (req, res) => {
  Products.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedProduct) => {
    res.redirect('/');
  });
});

app.delete('/:id', (req, res) => {
  Products.findByIdAndDelete(req.params.id, (error, data) => {
    res.redirect('/');
  });
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
