const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const generateRandomString = function() {
  return Math.random().toString(36).substr(2,6);
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

//urls homepade
app.get("/urls", (req,res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//adding a new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//generating the short url and redirecting to URLS show
app.get("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  let templateVars = {shortURL, longURL};
  res.render("urls_show",templateVars);
});


app.get("/u/:shortURL", (req,res) => {
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

