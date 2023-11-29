const express = require("express");
const app = express();



// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const mongoConnect = require("./helper/mongoConnect");

mongoConnect.connect().catch((e) => {
  console.log(e);
});


require("./api/routes/index").default(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});