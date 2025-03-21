require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth.routes");
const profileRoute = require("./routes/profile.routes");
const allPostRoute = require("./routes/allPost.routes");
const connectDB = require("./config/db.config");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use(authRoute);
app.use(allPostRoute);
app.use(profileRoute);

connectDB();

app.listen(3000);
