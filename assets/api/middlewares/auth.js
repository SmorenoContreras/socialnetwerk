require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verifyToken = function (req, res, next) {
    //get the token from the header if present
    token = req.headers.authorization;
    //if no token found, return response (without going to the next middelware)
    if (!token) {
      return res.status(401).send({ message: "Unauthorized"});
    }
    try {
      if (token.includes("Bearer")) {
        token = token.substr(7);
      }
      //if can verify the token, set req.user and pass to next middleware
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("user",decoded)
      req.user = decoded;
      next();
    } catch (ex) {
        console.log(ex+ 'test')
        res.status(500).send({ error: ex });
    }
};



