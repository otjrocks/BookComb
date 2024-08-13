const express = require('express');  
const router = express.Router();  
const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const isImageURL = require('image-url-validator').default;


router.get("/get/:username", (req, res) => { 
    User.findOne({username: req.params.username })
        .then((user) => {
            Book.find({user_id: user._id})
            .then((books) => {
                res.json({success: true, books: books, message: "Success"});
            })
            .catch((err) => {
                res.json({success: false, message: "Unable to retrieve books"});
                console.log(err);
            });
        })
        .catch((err) => {
            res.json({success: false, authenticated: false, message: "Invalid user token."})
            console.log(err);
        });
});

router.get("/get/:user_id/:isbn", (req, res) => { 
    Book.findOne({user_id: req.params.user_id, isbn: req.params.isbn})
        .then((book) => {
            res.json({success: true, book: book, message: "Success"})
        })
        .catch((err) => {
            res.json({success: false, message: "Unable to retreve book"})
            console.log(err)
        })
});

router.post("/add", (req, res) => {
    async function updateBook(req, res, user) {  // first try to find the book if it already exists and update it, otherwise create new book entry
        try {
          const isImage = await isImageURL(req.body.coverImage);
          if (!isImage) {
            req.body.coverImage = ''
          }
          const book = await Book.findOneAndUpdate(
            { user_id: user._id, isbn: req.body.isbn  },
            { $set: { user_id: user._id, isbn: req.body.isbn, title: req.body.title, subtitle: req.body.subtitle, author: req.body.author, coverImage: req.body.coverImage } },
            { new: true, upsert: true } // upsert will create a new book if it does not exist
          );
          res.json({ success: true, authenticated: true, book: book });
        } catch (err) {
          res.json({ success: false, authenticated: false, message: "Unable to add book. Please try again." });
        }
    }

    const token = req?.cookies?.token
    if (!token) {
        res.json({ success: false, message: "Unauthorized"})
    } else {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findOne({_id: decoded.userId })
            .then((user) => {
                updateBook(req, res, user);
            })
            .catch((err) => {
                res.json({success: false, authenticated: false, message: "Invalid user token."})
                console.log(err);
            });
    }
})




module.exports = router;