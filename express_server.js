const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const generateRandomString = function () {
  return Math.random().toString(36).substr(2, 6);
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b> World</b></body></html>\n");
});

//registration
app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["userID"]
  };
  res.render("registration", templateVars);
});

//check if an email is already registered
const checkUserEmail = (bodyEmail) => {
  let match = false;
  for (let user in users) {
    if (users[user].email === bodyEmail) {
      match = true;
    }
  } return match;
};

//registration
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(404).send("Not found, please enter a valid email and password.");
  }

  if (checkUserEmail(req.body.email)) {
    res.status(404).send("Error, email already registered. Perhaps try logging in instead!?");
  } else {
    let userID = generateRandomString();
    users[userID] = { userID, email: req.body.email, password: req.body.password };
    res.cookie("userID", userID);
    res.redirect("/urls");
  }
});


//login
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);

  res.redirect("/urls");
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("userID");

  res.redirect("/urls");
});

//urls homepage
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["userID"]
  };
  res.render("urls_index", templateVars);
});



//adding a new url
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

//generating the short url and redirecting to URLS show
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  let templateVars = {
    shortURL,
    longURL,
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;

  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

