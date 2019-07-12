const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "ba768n"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "biszb0"},
  "432jlk": {longURL: "https://kottke.org", userID: "biszb0"},
  "65lkjq": {longURL: "https://www.wikipedia.org", userID: "ba768n"},
  "54ssdj": {longURL: "https://www.bbc.com", userID: "biszb0"},
  "fs65jl": {longURL: "https://example.com", userID: "ba768n"},
  "8djasl": {longURL: "https://www.theguardian.com", userID: "ba768n"}
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

module.exports = { urlDatabase, users };