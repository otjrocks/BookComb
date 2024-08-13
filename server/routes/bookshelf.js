const express = require('express');  
const router = express.Router();  
const passport = require('passport')
const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const Bookshelf = require('../models/bookshelf');


router.get("/get/:username", (req, res) => { 
    // username maps to user_id which maps to a users bookshelf items
    User.findOne({username: req.params.username })
        .then((user) => {
            Bookshelf.findOne({user_id: user._id})
                     .then((bookshelf) => {
                        res.json({success: true, bookshelf: bookshelf.isbn_list, message: "Success"})
                     })
                     .catch((err) => {
                        res.json({success: false, message: "This bookshelf is empty. Try again."})
                     });
        })
        .catch((err) => {
            res.json({success: false, message: "Bookshelf does not exist."});
            console.log(err);
        });
});

router.post("/add/:isbn/:year", (req, res) => { 
    async function updateBookshelf(req, res, user) {
        try {
            const bookshelf = await Bookshelf.findOne({ user_id: user._id });
    
            if (bookshelf) {
                // Check if the item already exists
                const exists = bookshelf.isbn_list.some(item => item.isbn === req.params.isbn && item.year === req.params.year);
                if (!exists) {
                    // If it does not exist, add the new item
                    bookshelf.isbn_list.push({ isbn: req.params.isbn, year: req.params.year });
                    await bookshelf.save();
                }
            } else {
                // If no bookshelf exists, create a new one with the item
                const newBookshelf = new Bookshelf({
                    user_id: user._id,
                    isbn_list: [{ isbn: req.params.isbn, year: req.params.year }]
                });
                await newBookshelf.save();
            }
    
            res.json({ success: true, authenticated: true, bookshelf });
        } catch (err) {
            res.json({ success: false, authenticated: false, message: "Unable to modify bookshelf" });
        }
    }

    const token = req?.cookies?.token
    if (!token) {
        res.json({ success: false, message: "Unauthorized"})
    } else {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findOne({_id: decoded.userId })
            .then((user) => {
                // res.json({success: true, authenticated: true, email: user.email, username: user.username, id: user._id})
                // find user's bookshelf and add new book
                updateBookshelf(req, res, user);
            })
            .catch((err) => {
                res.json({success: false, authenticated: false, message: "Invalid user token."})
                console.log(err);
            });
    }
}); 

router.post("/remove/:isbn", (req, res) => { 
    async function removeBook(req, res, user) {
        try {
          const bookshelf = await Bookshelf.updateOne(
            { user_id: user._id },
            { $pull: { isbn_list: { isbn: req.params.isbn } } },
          );
          res.json({ success: true, authenticated: true, bookshelf });
        } catch (err) {
          res.json({ success: false, authenticated: false, message: "Unable to modify bookshelf" });
        }
    }

    const token = req?.cookies?.token
    if (!token) {
        res.json({ success: false, message: "Unauthorized"})
    } else {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findOne({_id: decoded.userId })
            .then((user) => {
                // res.json({success: true, authenticated: true, email: user.email, username: user.username, id: user._id})
                // find user's bookshelf and add new book
                removeBook(req, res, user);
            })
            .catch((err) => {
                res.json({success: false, authenticated: false, message: "Invalid user token."})
                console.log(err);
            });
    }
});




module.exports = router;