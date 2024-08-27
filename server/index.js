const express = require('express');
const passport = require('passport');
const User = require('./models/user')
const session = require('express-session');
var cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();


// mongoose setup
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_API_URL;
main().then(console.log("MongoDB connected")).catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,//(https://your-client-app.com)
    optionsSuccessStatus: 200,
    credentials: true
  };

app.use(cors(corsOptions));

app.use(express.json()) //Add it first then others follow
app.use(express.urlencoded({ extended: true }))

app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.EXPRESS_SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  is_logged_in: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

const LocalStrategy = require('passport-local').Strategy; 
passport.use(new LocalStrategy({
  usernameField: 'email'
}, User.authenticate()));


// Routes
var users = require('./routes/user');
app.use('/users', users);

var bookshelfs = require('./routes/bookshelf');
app.use('/bookshelfs', bookshelfs);

var books = require('./routes/book')
app.use('/books', books)

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Ok");
});


app.get('/search/:value', (req, front_end_res) => {
      const query = req.params.value
      let url = "https://www.googleapis.com/books/v1/volumes?q="
      url = url + query
      url = url + `&key=${process.env.GOOGLE_BOOKS_API_KEY}`
        fetch(url)
        .then(res => res.json())
        .then(res => {
          if (res?.error) {
            console.log(res?.error)
            front_end_res.json({success: false})
          } else {
            front_end_res.json({success: true, ...res})
          }
        })
        .catch((error) => {
          console.log(error)
          front_end_res.json({success: false})
        })
});


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);