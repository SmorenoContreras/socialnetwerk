const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connect = () => {
  return new Promise((resolve, reject) => {

    console.log("Mongo Url", process.env.DB_STRING);
    mongoose
      .connect(process.env.DB_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then((connection) => {
        console.log(`Mongo connected`);
        return resolve(connection);
      })
      .catch((err) => {
        return reject(err);
      });
    mongoose.connection.on("error", (err) => {
      console.log(`Error in mongoose conection - ${err.message}`);
      throw err;
    });
  });
};

module.exports.close = () => {
  return mongoose.disconnect();
};
