//check if an email in a DB is already registered
const checkUserEmail = (bodyEmail, database) => {
  for (let user in database) {
    if (database[user].email === bodyEmail) {
      return {valid:true, user:database[user]};
    }
  } return {valid:false, user:null};
};

//function to generate a random number
const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};


//find the URLS for the userID
const usersURL = (id, database) => {
  let userURLs = {};
  for (let key in database) {
    if ((database[key].userID) === id) {
      userURLs[key] = database[key];
    }
  }
  return userURLs;
};

module.exports = { checkUserEmail, generateRandomString, usersURL };

