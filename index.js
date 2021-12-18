const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const connectToDb = require("./Config/db.connect");
const routeNotFoundHandler = require("./Middlewares/routeNotFoundHandler");
const errorHandler = require("./Middlewares/errorHandler");

const user = require("./Routers/user.router");
const login = require("./Routers/login.router");
const signup = require("./Routers/signup.router");

const PORT = process.env.PORT || 5500;

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cors()
);

// start DB connection
connectToDb();

//Use the routes
app.use("/api/user", user);
app.use("/api/login", login);
app.use("/api/signup", signup);

app.use(routeNotFoundHandler);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json("Hello from the other side");
});

app.listen(PORT, () => {
  console.log(`Server connected successfully at Port: ${PORT}`);
});
