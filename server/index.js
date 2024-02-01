const express = require("express");
const crypto = require("crypto");
const app = express();
const port = 3000;

app.use(express.json());

function getPasswordHash(pass) {
  const secret = pass;
  return crypto.createHmac("sha256", secret).update(secret).digest("hex");
}

// dummy database
// first hashed pass is pass1, second is pass2
const users = [
  {
    id: "1",
    username: "user1",
    password_hash:
      "5a007b8bddb83c250f02cc2313dc0e91aa13ed0e99ad9fd3acccea3b148095e5",
    token: "1234567890",
  },
  {
    id: "2",
    username: "user2",
    password_hash:
      "1d2f78bde99920ed1cf9eefd585d556fff5d6c2ff9286df1a1c2f8b3bf016004",
    token: "0987654321",
  },
];
const usersJson = JSON.parse(JSON.stringify(users));

app.post("/login", async (req, res) => {
  try {
    // first we need the request body object
    const obj = req.body;
    // normally you need to sanitise data and query if it does exists in the sql database etc.
    // but we're just using a json for simplicity and regex sucks

    // then we compare it with whats on the database
    // if the account username and password hash does match we send the token back
    if (
      obj.username === usersJson[0].username &&
      getPasswordHash(obj.password) === usersJson[0].password_hash
    ) {
      // account credentials has passed so we're sending the user token
      const token = usersJson[0].token;
      res.json({ token });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Auth app listening on port ${port}`);
});
