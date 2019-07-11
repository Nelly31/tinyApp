const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['Elephantsandumbrellasgetwetintherain', 'WhyohWhymustwealwaysencryptthingsMaywenotbemoreopen'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "ba768n"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "biszb0"}
};

let users = {
  ba768n: {
    id: 'ba768n',
    email: 'nel@me',
    password: '$2b$10$OEo/etHzpn6XxTb9xCFi4e48OjnS91t0MKRyhfNvnNHg8vprDmKIW'
  },
  biszb0: {
    id:'biszb0',
    email:'abc@me',
    password: '$2b$10$yiNWqL8/JfL/XcRmraDyeOLu/RA6g0bFvi2npoBqPRlW2jlS6vWgO'
  }
};

//check if an email is already registered
const checkUserEmail = (bodyEmail) => {
  for (let user in users) {
    if (users[user].email === bodyEmail) {
      return {valid:true, user:users[user]};
    }
  } return {valid:false, user:null};
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
  const {valid, user} = checkUserEmail(req.body.email);
  console.log("++++++++++USER+++++++++",req.body.email);
  console.log(user);
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
  
  if (checkUserEmail(req.body.email).valid) {
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

// const urlDatabase = {
//   "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
//   "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
// };

//find the URLS for the userID
const urlsForUser = function(id) {
  let userURLs = {};
  for (let key in urlDatabase) {
    if ((urlDatabase[key].userID) === id) {
      userURLs[key] = urlDatabase[key];
    }
  }
  return userURLs;
};

//urls homepage
app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (users[req.session.user_id]) {
    templateVars['userUrls'] = urlsForUser(req.session.user_id);
    console.log("+++++TempateVars+++++",templateVars);
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
  // templateVars['urls'] = urlDatabase;
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


// //generating the short url and redirecting to URLS show
// app.get("/urls/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;
//   const longURL = urlDatabase[shortURL].longURL;
//   let templateVars = {
//     shortURL,
//     longURL,
//     user: users[req.cookies["userID"]]
//   };
//   res.render("urls_show", templateVars);
// });

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

