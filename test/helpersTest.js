const {assert} = require('chai');

const {checkUserEmail} = require('../helpers.js');
const {generateRandomString} = require('../helpers.js');
const {usersURL} = require('../helpers.js');


const testUsers = {
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

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "ba768n"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "biszb0"}
};

//Testing URLs belong to a user
describe('returnsShortURLForUser', function() {
  it('if given a userId returns the shortURL for that user', function() {
    const output = Object.keys(usersURL("ba768n", urlDatabase));
    const expectedOutput = 'b2xVn2';
    assert.equal(output, expectedOutput);
  });
});

//testing userEmail
describe('checkUserEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkUserEmail("user@example.com", testUsers).user.id;
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
});

describe('checkEmailNotValid', function() {
  it('should return false if the email is not found', function() {
    const user = checkUserEmail("nottheright@email", testUsers).valid;
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

describe('checkEmailisValid', function() {
  it('should return true if the email is found', function() {
    const user = checkUserEmail("user2@example.com", testUsers).valid;
    const expectedOutput = true;
    assert.equal(user, expectedOutput);
  });
});

//Testing random numbers
describe('stringIsCorrectLength', function() {
  it('returns a string 6 characters long', function() {
    const randomNumLength = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(randomNumLength, expectedOutput);
  });
});

describe('2AreNotTheSame', function() {
  it('2 randomly generated numbers are not the same', function() {
    const randomOutput = generateRandomString();
    const randomOutput2 = generateRandomString();
    assert.notEqual(randomOutput, randomOutput2);
  });
});



