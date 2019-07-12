//express and ejs setup
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//password encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

//my external resource files
const {checkUserEmail} = require('./helpers.js');
const {generateRandomString} = require('./helpers.js');
const {usersURL} = require('./helpers');
const {users} = require('./resources.js');
const {urlDatabase} = require('./resources.js');

//cookie encryption
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['Elephantsandumbrellasgetwetintherain', 'WhyohWhymustwealwaysencryptthingsMaywenotbemoreopen']
}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b> World</b></body></html>\n");
});

//login
app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

//login
app.post("/login", (req, res) => {
  const {valid, user} = checkUserEmail(req.body.email, users);
  if (valid) {
    if (bcrypt.compareSync(req.body.password, user['password'])) {
      req.session.user_id = user['id'];
      res.redirect("/urls");
      return;
    } else {
      res.status(403).send("Error! Incorrect password, Please try again... or... perhaps try registering!?");
    }
  } else {
    res.status(403).send("Error incorrect email, Please try again... or... perhaps try registering!?");
  }
});

//registration
app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("registration", templateVars);
});

//registration
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(404).send("Not found, please enter a valid email and password.");
  }
  
  if (checkUserEmail(req.body.email, users).valid) {
    res.status(404).send("Error, email already registered. Perhaps try logging in instead!?");
  } else {
    let userID = generateRandomString();
    req.session.user_id = userID;
    users[userID] = { id: userID, email: req.body.email, password: bcrypt.hashSync((req.body.password), saltRounds)};
    res.redirect("/urls");
  }
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;

  res.redirect("/urls");
});

//urls index page
app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (users[req.session.user_id]) {
    templateVars['userUrls'] = usersURL(req.session.user_id, urlDatabase);
    res.render("urls_index", templateVars);
  } else {
    res.render("login", templateVars);
  }
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session.user_id;
  res.redirect(`/urls/${shortURL}`);
});


//adding a new url
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (users[req.session.user_id]) {
    res.render("urls_new", templateVars);
  } else {
    res.render("login", templateVars);
  }
});

//deleting a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//generating the short url and redirecting to URLS show
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]};

  if (urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    let templateVars = {
      shortURL,
      longURL,
      user: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  } else {
    res.render("login", templateVars);
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: users[req.session.user_id].id};
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});