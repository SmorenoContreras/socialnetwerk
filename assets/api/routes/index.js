const express = require("express");


const user = require('./user');
const thought = require('./thought');
const like = require('./like')


module.exports.default = (app) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: false }));

  app.use('/api/v1/user', user);
  app.use('/api/v1/thought', thought);
  app.use('/api/v1/like', like);

  app.use('/success', (req, res) => {
    console.log("req.body", req.body),
      console.log("req.query", req.query),
      res.send(200)

  })
  app.use('/health', (req, res) => { res.send("OK") })

};
