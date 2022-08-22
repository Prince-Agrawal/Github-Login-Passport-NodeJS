const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport')
require('dotenv').config()
require('./auth.js');

const app = express();

app.use(cookieSession({
  keys: ['secret'],
  maxAge: 5 * 60 * 1000
}))

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.status(401).send(`Not Logged In <a href="/"> login <a/>`);
  } else {
    next();
  }
}

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(req.user.displayName)
})

app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/')
})

app.get('/profile', isLoggedIn, (req, res) => {
  res.send(`<h1> Hello, ${req.user.displayName} <h1/> <a href="/logout"> logout <a/>`)
})

app.get('/auth/github/callback', passport.authenticate('github'), (req, res) => {
  res.redirect('/profile');
});

app.get('/auth/github',
  passport.authenticate('github', {
    scope: ['profile']
  }));

app.get('/', (req, res) => {
  res.send('<a href="/auth/github"> Authenticate with github <a/>');
})

app.listen('3000', () => {
  console.log('server connected on port 3000')
})