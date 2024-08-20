const express = require('express');  
const router = express.Router();  
const passport = require('passport')
const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.post("/register", function (req, res) { 
    User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, async function (err, user) {
        if (err) { 
            const findEmail = await User.findOne({ email: req.body.email })
            if (findEmail) {
                res.json({ success: false, message: "This email is already associated with an account." }); 
            } else {
                res.json({ success: false, message: "Username already taken or invalid password." })
            }
        } 
        else { 
            req.login(user, (er) => { 
                if (er) { 
                    res.json({ success: false, message: "Invalid username or password, try again" }); 
                } 
                else { 
                    res.json({ success: true, message: "Your account has been saved" }); 
                } 
            }); 
        } 
    }); 
}); 


router.post("/login", function (req, res) { 
    if (!req.body.email) { 
        res.json({ success: false, message: "Email was not given" }) 
    } 
    else if (!req.body.password) { 
        res.json({ success: false, message: "Password was not given" }) 
    }
    else { 
        passport.authenticate("local", function (err, user, info) { 
            if (err) { 
                res.json({ success: false, message: "Error with authentication" }); 
            } 
            else { 
                if (!user) { 
                    res.json({ success: false, message: "Incorrect username or password." }); 
                } 
                else { 
                    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" }); 
                    // Configure the `token` HTTPOnly cookie
                    let options = {
                        maxAge: 1000 * 60 * 60 * 24, // expire after 24 hours
                        httpOnly: true, // Cookie will not be exposed to client side code
                        sameSite: "Strict", // If client and server origins are different
                        secure: true // use with HTTPS only
                    }
                    res.cookie( "token", token, options );
                    res.json({ success: true, message: "Authentication successful" }); 
                } 
            } 
        })(req, res); 
    } 
}); 

router.post("/logout", function (req, res) {  
    res.cookie('token', '', {maxAge: 0})
    res.json({ success: true, message: 'Logout successful' })
})

router.get("/info", function (req, res) {
    const token = req?.cookies?.token
    if (!token) {
        res.json({ success: false, authenticated: false, message: "Unauthorized"})
    } else {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findOne({_id: decoded.userId })
            .then((user) => {
                res.json({success: true, authenticated: true, email: user.email, username: user.username, id: user._id})
            })
            .catch((err) => {
                res.json({success: false, authenticated: false, message: "Invalid user token."})
                console.log(err);
            });
    }
});

router.post('/forgot', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({success: false, message: 'No user with that email'});
        }

        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'BookComb Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `https://bookcomb.com/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);
        res.json({success: true, message: 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
    } catch (err) {
        console.log(err);
        res.json({success: false, message: 'Server Error, try again later.'});
    }
});


// post to reset password after email has been sent with token
router.post('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.json({success: false, message: 'Password reset token is invalid or has expired.'});
        }
        if (req.body.password === req.body.confirm) {
            await user.setPassword(req.body.password);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();
            res.json({success: true, message: 'Password has been reset successfully.'});
        } else {
            res.json({success: false, message: 'Passwords do not match.'});
        }
    } catch (err) {
        res.json({sucess: false, message: 'Server error, try again later.'});
    }
});


module.exports = router;